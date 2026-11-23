/**
 * GetShortlisted.in — Cloudflare Worker
 *
 * Static pages are served by Workers Static Assets (./public).
 * This Worker only handles /api/* (see run_worker_first in wrangler.jsonc):
 *   POST /api/lead      -> validate (+ optional Turnstile), save lead + resume to D1, email the owner (resume attached)
 *   GET  /api/whatsapp  -> 302 to wa.me/<WHATSAPP_NUMBER> (number lives only in a Cloudflare secret, never in HTML)
 *   POST /api/referrer  -> referral partner signup → returns their code (first name, e.g. AKASH / AKASH2)
 *   POST /api/referrer/stats -> partner dashboard (mobile + email must match) → counts, earnings, recent referrals
 *   GET  /api/ref       -> ?code=AKASH → { ok, code, first_name } (pre-fills "Referred by" on the form)
 *   GET  /api/health    -> simple health check
 *
 * Secrets / variables (Cloudflare dashboard → Worker → Settings → Variables and Secrets):
 *   NOTIFY_TO          (secret)  inbox that receives leads — must be a verified Email Routing destination
 *   WHATSAPP_NUMBER    (secret)  e.g. 91XXXXXXXXXX (country code + number, digits only)
 *   TURNSTILE_SECRET   (secret, optional) enables the bot check (site key goes in site/config.mjs)
 *   NOTIFY_FROM, SITE_URL (plain vars in wrangler.jsonc)
 */
import { EmailMessage } from "cloudflare:email";
import {
  SOURCE, SOURCE_LABEL, REFERRAL_RATE, codeBase, codeCandidates, normalizeCode, cleanReferralInput, localMobile, classifyReferral, inr,
} from "./referral.js";

const MAX = { name: 80, phone: 20, email: 120, login: 120, experience: 40, plan: 40, target_role: 120, message: 1500, utm: 100, page: 200 };
const EXPERIENCE_OPTIONS = ["Fresher (0-1 yr)", "1-3 yrs", "3-6 yrs", "6-10 yrs", "10-15 yrs", "15+ yrs"];
const PLANS = { makeover: "Profile Makeover (₹5,999)", "done-for-you": "Done-For-You Job Search (₹8,999)" };
// Abuse ceilings, not real-user limits. Indian mobile networks (Jio/Airtel CGNAT) put thousands of phones
// behind one public IP, so these must stay HIGH. Bots are stopped by Turnstile + honeypot + per-phone dedupe.
const LEADS_PER_IP_PER_HOUR = 300;
const PARTNER_SIGNUPS_PER_IP_PER_HOUR = 100;
const DUPLICATE_WINDOW_MIN = 10; // same mobile again within 10 min = same lead (double taps on slow networks)
const MAX_FILE = 1_900_000; // D1 rows are limited to 2 MB
const MAX_BODY = 2_500_000; // whole request (file + fields)
const FILE_TYPES = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", magic: [0x50, 0x4b, 0x03, 0x04] }, // PK zip
  doc: { mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE2
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let res;
    if (url.pathname === "/api/lead") {
      res = request.method === "POST" ? await handleLead(request, env, ctx) : json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
    } else if (url.pathname === "/api/referrer/stats") {
      res = request.method === "POST" ? await handlePartnerStats(request, env) : json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
    } else if (url.pathname === "/api/referrer") {
      res = request.method === "POST" ? await handleReferrer(request, env, ctx) : json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
    } else if (url.pathname === "/api/ref") {
      res = await handleRefLookup(url, env);
    } else if (url.pathname === "/api/whatsapp") {
      res = handleWhatsApp(url, env);
    } else if (url.pathname === "/api/health") {
      res = json({ ok: true, time: new Date().toISOString() });
    } else if (url.pathname.startsWith("/api/")) {
      res = json({ ok: false, error: "Not found" }, 404);
    } else {
      return env.ASSETS.fetch(request);
    }
    // API responses: never indexed, never framed, never sniffed.
    const h = new Headers(res.headers);
    h.set("X-Robots-Tag", "noindex, nofollow");
    h.set("X-Content-Type-Options", "nosniff");
    h.set("X-Frame-Options", "DENY");
    h.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(res.body, { status: res.status, headers: h });
  },
};

/* ------------------------------------------------------------------ */
/* WhatsApp redirect                                                   */
/* ------------------------------------------------------------------ */

function handleWhatsApp(url, env) {
  const number = String(env.WHATSAPP_NUMBER || "").replace(/\D/g, "");
  if (number.length < 10) return Response.redirect(new URL("/contact/", url).toString(), 302);
  const plan = url.searchParams.get("plan") || "";
  const opener = "Hi team! My Naukri profile has been around forever, but recruiter calls are still a rare sight. 😭";
  const text = plan === "done-for-you"
    ? `${opener} I want the Done-For-You Job Search (₹8,999) — please take over my Naukri job search and help me turn things around!`
    : `${opener} I desperately need a profile makeover. Help me turn things around!`;
  return new Response(null, {
    status: 302,
    // api.whatsapp.com keeps emojis intact; the wa.me short link turns them into "�" when it re-redirects.
    headers: { Location: `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(text)}`, "Cache-Control": "no-store" },
  });
}

/* ------------------------------------------------------------------ */
/* Lead handler                                                        */
/* ------------------------------------------------------------------ */

async function handleLead(request, env, ctx) {
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  const reply = (status, body) => {
    if (wantsJson) return json(body, status);
    const target = body.ok ? "/thank-you/" : "/contact/?error=1";
    return Response.redirect(new URL(target, request.url).toString(), 303);
  };

  // Same-origin check (blocks other websites posting into the form).
  const origin = request.headers.get("Origin");
  if (origin) {
    let host = "";
    try { host = new URL(origin).host; } catch {}
    if (host !== new URL(request.url).host) return reply(403, { ok: false, error: "Invalid origin." });
  }

  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > MAX_BODY) return reply(413, { ok: false, error: "Your resume file is too large. Please upload a PDF under 2 MB." });

  let data, file;
  try {
    ({ data, file } = await readBody(request));
  } catch {
    return reply(400, { ok: false, error: "Could not read the form. Please try again." });
  }

  // Honeypot: real users never see or fill this field. Pretend success for bots.
  if (clean(data.company_website, 200)) return reply(200, { ok: true });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  // Optional Cloudflare Turnstile bot check (on when TURNSTILE_SECRET is set).
  if (env.TURNSTILE_SECRET) {
    const passed = await verifyTurnstile(env.TURNSTILE_SECRET, data["cf-turnstile-response"], ip);
    if (!passed) return reply(403, { ok: false, error: "Quick security check failed. Please refresh the page and try again." });
  }

  const lead = {
    name: clean(data.name, MAX.name),
    phone: clean(data.phone, MAX.phone),
    email: clean(data.email, MAX.email).toLowerCase(),
    naukri_login: clean(data.naukri_login, MAX.login),
    plan: clean(data.plan, MAX.plan),
    experience: clean(data.experience, MAX.experience),
    target_role: clean(data.target_role, MAX.target_role),
    message: clean(data.message, MAX.message, true),
    source_page: clean(data.source_page, MAX.page),
    utm_source: clean(data.utm_source, MAX.utm),
    utm_medium: clean(data.utm_medium, MAX.utm),
    utm_campaign: clean(data.utm_campaign, MAX.utm),
    referral_input: cleanReferralInput(data.referral),
  };

  let resume = null;
  if (file) {
    const checked = await checkFile(file);
    if (checked.error) return reply(422, { ok: false, error: checked.error });
    resume = checked;
  }
  lead.resume_name = resume ? resume.name : "";

  const errors = validate(lead, !!resume);
  if (errors.length) return reply(422, { ok: false, error: errors[0], errors });

  await ensureSchema(env);

  const ipHash = await sha256(`${ip}|getrecruitercalls`);
  const userAgent = clean(request.headers.get("User-Agent"), 300);

  const phoneLocal = localMobile(lead.phone);
  const ipLimit = Number(env.LEADS_PER_IP_PER_HOUR) || LEADS_PER_IP_PER_HOUR;

  // One round-trip: duplicate check (same mobile, last 10 min) + abuse ceiling per IP (last hour).
  try {
    const [dup, ipRow] = await env.DB.batch([
      env.DB.prepare(
        `SELECT id, lead_source FROM leads WHERE phone_local = ?1
           AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-${DUPLICATE_WINDOW_MIN} minutes') ORDER BY id DESC LIMIT 1`
      ).bind(phoneLocal),
      env.DB.prepare(
        "SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ?1 AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-1 hour')"
      ).bind(ipHash),
    ]);
    const existing = dup && dup.results && dup.results[0];
    if (existing) return reply(200, { ok: true, id: existing.id, source: existing.lead_source || "organic", duplicate: true });
    const n = ipRow && ipRow.results && ipRow.results[0] ? ipRow.results[0].n : 0;
    if (n >= ipLimit) {
      return reply(429, { ok: false, error: "We’re getting a lot of requests from your network. Please try again in a few minutes, or message us on WhatsApp." });
    }
  } catch (err) {
    console.error("dedupe/limit check failed", err); // never block a real lead because a check failed
  }

  // Referral: organic / referral / referral-unverified / self-referral (+ 20% commission when verified).
  Object.assign(lead, await resolveReferral(env, lead));

  let leadId;
  try {
    const res = await env.DB.prepare(
      `INSERT INTO leads (name, phone, email, naukri_login, plan, resume_name, experience, target_role, message,
                          source_page, utm_source, utm_medium, utm_campaign, ip_hash, user_agent,
                          lead_source, referral_input, referral_code, referrer_id, referral_note, commission_inr, commission_status, phone_local)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23)`
    ).bind(
      lead.name, lead.phone, lead.email, lead.naukri_login || null, lead.plan || null, lead.resume_name || null,
      lead.experience || null, lead.target_role || null, lead.message || null,
      lead.source_page || null, lead.utm_source || null, lead.utm_medium || null, lead.utm_campaign || null,
      ipHash, userAgent,
      lead.lead_source, lead.referral_input || null, lead.referral_code || null, lead.referrer_id || null,
      lead.referral_note || null, lead.commission_inr || 0, lead.commission_inr ? "pending" : null, phoneLocal || null
    ).run();
    leadId = res.meta && res.meta.last_row_id;
    if (leadId && resume) {
      await env.DB.prepare("INSERT INTO resumes (lead_id, filename, mime, size, data) VALUES (?1, ?2, ?3, ?4, ?5)")
        .bind(leadId, resume.name, resume.mime, resume.size, resume.bytes).run();
    }
  } catch (err) {
    console.error("D1 insert failed", err);
    // Still try to email the lead so it is never lost.
  }

  ctx.waitUntil(notifyOwner(env, lead, leadId, resume));
  return reply(200, { ok: true, id: leadId || null, source: lead.lead_source });
}

/* ------------------------------------------------------------------ */
/* Referral programme                                                  */
/* ------------------------------------------------------------------ */

async function resolveReferral(env, lead) {
  const input = lead.referral_input;
  let byCode = null, byName = [], sameBaseCount = 0;
  if (input) {
    try {
      const code = normalizeCode(input);
      if (code) {
        byCode = await env.DB.prepare("SELECT id, code, name, phone, upi_phone FROM referrers WHERE code = ?1").bind(code).first();
        const base = code.replace(/\d+$/, "");
        const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM referrers WHERE code_base = ?1").bind(base).first();
        sameBaseCount = row ? row.n : 0;
      }
      if (!byCode) {
        const r = await env.DB.prepare("SELECT id, code, name, phone, upi_phone FROM referrers WHERE lower(name) = lower(?1) LIMIT 5").bind(input).all();
        byName = (r && r.results) || [];
      }
    } catch (err) {
      console.error("referral lookup failed", err);
    }
  }
  const c = classifyReferral({ input, byCode, byName, sameBaseCount, leadPhone: lead.phone, plan: lead.plan });
  return {
    lead_source: c.source,
    referral_code: c.referrer ? c.referrer.code : "",
    referrer_id: c.referrer ? c.referrer.id : null,
    referrer: c.referrer,
    referral_note: c.note,
    commission_inr: c.commission,
  };
}

async function handleRefLookup(url, env) {
  const code = normalizeCode(url.searchParams.get("code"));
  if (!code) return json({ ok: false }, 404);
  try {
    await ensureSchema(env);
    const r = await env.DB.prepare("SELECT code, name FROM referrers WHERE code = ?1").bind(code).first();
    if (!r) return json({ ok: false }, 404);
    return json({ ok: true, code: r.code, first_name: String(r.name).split(" ")[0] });
  } catch (err) {
    console.error("ref lookup failed", err);
    return json({ ok: false }, 500);
  }
}

async function handleReferrer(request, env, ctx) {
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  const reply = (status, body) => {
    if (wantsJson) return json(body, status);
    const target = body.ok && body.code ? `/refer/?code=${encodeURIComponent(body.code)}` : "/refer/?error=1";
    return Response.redirect(new URL(target, request.url).toString(), 303);
  };

  const origin = request.headers.get("Origin");
  if (origin) {
    let host = "";
    try { host = new URL(origin).host; } catch {}
    if (host !== new URL(request.url).host) return reply(403, { ok: false, error: "Invalid origin." });
  }
  if (Number(request.headers.get("Content-Length") || 0) > 20_000) return reply(413, { ok: false, error: "Request too large." });

  let data;
  try {
    ({ data } = await readBody(request));
  } catch {
    return reply(400, { ok: false, error: "Could not read the form. Please try again." });
  }
  if (clean(data.company_website, 200)) return reply(200, { ok: true });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (env.TURNSTILE_SECRET) {
    const passed = await verifyTurnstile(env.TURNSTILE_SECRET, data["cf-turnstile-response"], ip);
    if (!passed) return reply(403, { ok: false, error: "Quick security check failed. Please refresh the page and try again." });
  }

  const p = {
    name: clean(data.name, MAX.name),
    phone: localMobile(data.phone),
    upi_phone: localMobile(data.upi_same ? data.phone : data.upi_phone),
    email: clean(data.email, MAX.email).toLowerCase(),
  };
  if (p.name.length < 2) return reply(422, { ok: false, error: "Please enter your full name." });
  if (!p.phone) return reply(422, { ok: false, error: "Please enter a valid 10-digit mobile number." });
  if (!p.upi_phone) return reply(422, { ok: false, error: "Please enter the 10-digit number linked to your Google Pay / UPI." });
  if (!EMAIL_RE.test(p.email)) return reply(422, { ok: false, error: "Please enter a valid email address." });

  await ensureSchema(env);

  // Already a partner with this mobile → give the same code back (also works as "forgot my code").
  const existing = await env.DB.prepare("SELECT id, code, name, email FROM referrers WHERE phone = ?1").bind(p.phone).first();
  if (existing) {
    // Stats only when the email matches too (a phone number alone shouldn't reveal someone's earnings).
    const stats = String(existing.email).toLowerCase() === p.email ? await partnerStats(env, existing.id) : null;
    return reply(200, { ok: true, existing: true, code: existing.code, name: existing.name, link: shareLink(env, existing.code), ...(stats ? { stats } : {}) });
  }

  const ipHash = await sha256(`${ip}|getrecruitercalls`);
  try {
    const row = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM referrers WHERE ip_hash = ?1 AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-1 hour')"
    ).bind(ipHash).first();
    if (row && row.n >= (Number(env.PARTNER_SIGNUPS_PER_IP_PER_HOUR) || PARTNER_SIGNUPS_PER_IP_PER_HOUR)) return reply(429, { ok: false, error: "Too many sign-ups from this network. Please try again later." });
  } catch (err) {
    console.error("partner rate-limit check failed", err);
  }

  const base = codeBase(p.name);
  let code = "";
  for (const candidate of codeCandidates(p.name)) {
    try {
      await env.DB.prepare(
        "INSERT INTO referrers (code, code_base, name, phone, upi_phone, email, ip_hash) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)"
      ).bind(candidate, base, p.name, p.phone, p.upi_phone, p.email, ipHash).run();
      code = candidate;
      break;
    } catch (err) {
      const msg = String(err && err.message || err);
      if (!/UNIQUE/i.test(msg)) { console.error("partner insert failed", err); break; }
      if (/phone/i.test(msg)) { // same phone registered a moment ago
        const again = await env.DB.prepare("SELECT code, name FROM referrers WHERE phone = ?1").bind(p.phone).first();
        if (again) return reply(200, { ok: true, existing: true, code: again.code, name: again.name, link: shareLink(env, again.code) });
      }
    }
  }
  if (!code) return reply(500, { ok: false, error: "Could not create your code right now. Please try again or WhatsApp us." });

  ctx.waitUntil(notifyNewPartner(env, { ...p, code }));
  return reply(200, { ok: true, existing: false, code, name: p.name, link: shareLink(env, code) });
}

// Commission lifecycle on leads.commission_status:
//   pending   = friend filled the form, hasn't paid yet
//   earned    = friend paid us → we owe the partner
//   paid      = we sent the partner their money
//   cancelled = friend didn't buy
const FRIEND_STATUS = { pending: "Form filled", earned: "Paid — you’ve earned", paid: "Paid to you", cancelled: "Didn’t join" };

async function partnerStats(env, referrerId) {
  const [tot, recent] = await env.DB.batch([
    env.DB.prepare(
      `SELECT COUNT(*) AS referred,
              SUM(CASE WHEN commission_status IN ('earned','paid') THEN 1 ELSE 0 END) AS paid_clients,
              SUM(CASE WHEN commission_status IN ('earned','paid') THEN commission_inr ELSE 0 END) AS earned_inr,
              SUM(CASE WHEN commission_status = 'paid' THEN commission_inr ELSE 0 END) AS paid_out_inr,
              SUM(CASE WHEN commission_status = 'pending' THEN commission_inr ELSE 0 END) AS potential_inr
         FROM leads WHERE referrer_id = ?1 AND lead_source = 'referral'`
    ).bind(referrerId),
    env.DB.prepare(
      `SELECT created_at, name, commission_status, commission_inr FROM leads
        WHERE referrer_id = ?1 AND lead_source = 'referral' ORDER BY id DESC LIMIT 20`
    ).bind(referrerId),
  ]);
  const t = (tot.results && tot.results[0]) || {};
  return {
    referred: t.referred || 0,
    paid_clients: t.paid_clients || 0,
    earned_inr: t.earned_inr || 0,
    paid_out_inr: t.paid_out_inr || 0,
    due_inr: (t.earned_inr || 0) - (t.paid_out_inr || 0),
    potential_inr: t.potential_inr || 0,
    recent: (recent.results || []).map((r) => ({
      date: String(r.created_at).slice(0, 10),
      friend: String(r.name || "").trim().split(/\s+/)[0] || "Friend", // first name only
      status: FRIEND_STATUS[r.commission_status] || "Form filled",
      amount_inr: r.commission_inr || 0,
    })),
  };
}

async function handlePartnerStats(request, env) {
  const origin = request.headers.get("Origin");
  if (origin) {
    let host = "";
    try { host = new URL(origin).host; } catch {}
    if (host !== new URL(request.url).host) return json({ ok: false, error: "Invalid origin." }, 403);
  }
  let data;
  try {
    ({ data } = await readBody(request));
  } catch {
    return json({ ok: false, error: "Could not read the form." }, 400);
  }
  const phone = localMobile(data.phone);
  const email = clean(data.email, MAX.email).toLowerCase();
  if (!phone || !EMAIL_RE.test(email)) return json({ ok: false, error: "Enter the mobile number and email you joined with." }, 422);
  await ensureSchema(env);
  const r = await env.DB.prepare("SELECT id, code, name, email FROM referrers WHERE phone = ?1").bind(phone).first();
  if (!r || String(r.email).toLowerCase() !== email) {
    return json({ ok: false, error: "No partner found with this mobile and email. Check both, or join below." }, 404);
  }
  return json({ ok: true, code: r.code, name: r.name, link: shareLink(env, r.code), stats: await partnerStats(env, r.id) });
}

const shareLink = (env, code) => `${(env.SITE_URL || "https://getshortlisted.in").replace(/\/$/, "")}/?ref=${encodeURIComponent(code)}`;

async function notifyNewPartner(env, p) {
  try {
    if (!(env.SEND_EMAIL && env.NOTIFY_TO && env.NOTIFY_FROM)) return;
    const rows = [["Name", p.name], ["Referral code", p.code], ["Mobile / WhatsApp", p.phone], ["Google Pay / UPI number", p.upi_phone], ["Email", p.email], ["Share link", shareLink(env, p.code)]];
    const text = `New referral partner on GetShortlisted.in\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nThey earn ${Math.round(REFERRAL_RATE * 100)}% of every plan bought by people they refer.\n`;
    const html = cardHtml({
      kicker: "New referral partner",
      title: `${p.name} joined Refer & Earn`,
      rows,
      buttons: [[`https://wa.me/91${p.phone}`, "#1DA851", `WhatsApp ${p.name.split(" ")[0]}`]],
      footer: `Code <b>${esc(p.code)}</b>. They earn ${Math.round(REFERRAL_RATE * 100)}% of every plan bought by people they refer — pay to the Google Pay / UPI number above after the client pays.`,
    });
    const raw = buildMime({
      from: `GetShortlisted Referrals <${env.NOTIFY_FROM}>`, fromAddr: env.NOTIFY_FROM, to: env.NOTIFY_TO, replyTo: p.email,
      subject: `New referral partner: ${p.name} (${p.code})`, text, html,
    });
    await env.SEND_EMAIL.send(new EmailMessage(env.NOTIFY_FROM, env.NOTIFY_TO, raw));
  } catch (err) {
    console.error("partner email failed", err && err.message ? err.message : err);
  }
}

async function verifyTurnstile(secret, token, ip) {
  if (!token || typeof token !== "string" || token.length > 2048) return false;
  try {
    const body = new FormData();
    body.append("secret", secret);
    body.append("response", token);
    if (ip && ip !== "unknown") body.append("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const j = await r.json();
    return !!(j && j.success);
  } catch (err) {
    console.error("turnstile verify failed", err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Resume file checks                                                  */
/* ------------------------------------------------------------------ */

async function checkFile(file) {
  const ext = (String(file.name || "").toLowerCase().match(/\.(pdf|docx|doc)$/) || [])[1];
  if (!ext) return { error: "Please upload your resume as PDF or Word (.pdf, .doc, .docx)." };
  if (file.size > MAX_FILE) return { error: "Your resume file is larger than 2 MB. Please upload a smaller PDF." };
  if (file.size < 100) return { error: "That resume file looks empty. Please choose the file again." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const t = FILE_TYPES[ext];
  if (!t.magic.every((b, i) => bytes[i] === b)) return { error: "That file doesn’t look like a real PDF or Word document. Please upload your resume again." };
  const base = clean(String(file.name).replace(/\.[^.]+$/, ""), 80).replace(/[^\w .()-]+/g, "_").trim() || "resume";
  return { name: `${base}.${ext}`, mime: t.mime, size: bytes.length, bytes };
}

/* ------------------------------------------------------------------ */
/* Database schema (self-creating + self-upgrading; mirrors migrations/) */
/* ------------------------------------------------------------------ */

let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  // Fast path: one round-trip proves the newest columns/tables exist (normal case after the first deploy).
  try {
    await env.DB.batch([
      env.DB.prepare("SELECT phone_local, commission_status FROM leads LIMIT 1"),
      env.DB.prepare("SELECT id FROM referrers LIMIT 1"),
    ]);
    schemaReady = true;
    return;
  } catch {}
  try {
    await env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL,
        naukri_url TEXT, resume_url TEXT, experience TEXT, target_role TEXT, message TEXT,
        source_page TEXT, utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
        ip_hash TEXT, user_agent TEXT, email_status TEXT NOT NULL DEFAULT 'pending')`),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_leads_ip_hash ON leads (ip_hash, created_at)"),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id INTEGER NOT NULL, filename TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, data BLOB NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')))`),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_resumes_lead ON resumes (lead_id)"),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS referrers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        code TEXT NOT NULL UNIQUE, code_base TEXT NOT NULL, name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE, upi_phone TEXT NOT NULL, email TEXT NOT NULL, ip_hash TEXT,
        status TEXT NOT NULL DEFAULT 'active')`),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_referrers_base ON referrers (code_base)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_referrers_ip ON referrers (ip_hash, created_at)"),
    ]);
    // v2 columns (migrations/0002). ALTER fails harmlessly if the column already exists.
    for (const col of ["naukri_login TEXT", "plan TEXT", "resume_name TEXT", "lead_source TEXT", "referral_input TEXT", "referral_code TEXT",
                       "referrer_id INTEGER", "referral_note TEXT", "commission_inr INTEGER", "commission_status TEXT", "phone_local TEXT"]) {
      try { await env.DB.prepare(`ALTER TABLE leads ADD COLUMN ${col}`).run(); } catch {}
    }
    await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (phone_local, created_at)").run();
    schemaReady = true;
  } catch (err) {
    console.error("schema setup failed", err);
  }
}

/* ------------------------------------------------------------------ */
/* Validation helpers                                                  */
/* ------------------------------------------------------------------ */

async function readBody(request) {
  const type = request.headers.get("Content-Type") || "";
  const out = {};
  let file = null;
  if (type.includes("application/json")) {
    const body = await request.json();
    return { data: body && typeof body === "object" ? body : {}, file };
  }
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    const form = await request.formData();
    for (const [k, v] of form.entries()) {
      if (typeof v === "string") out[k] = v;
      else if (k === "resume" && v && v.size > 0) file = v;
    }
    return { data: out, file };
  }
  throw new Error("Unsupported content type");
}

function clean(value, max, multiline = false) {
  if (value === undefined || value === null) return "";
  let s = String(value);
  s = multiline ? s.replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  s = s.replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");
  return s.trim().slice(0, max);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const indianMobile = (s) => {
  const d = s.replace(/\D/g, "");
  const local = d.length === 12 && d.startsWith("91") ? d.slice(2) : d.length === 11 && d.startsWith("0") ? d.slice(1) : d;
  return /^[6-9]\d{9}$/.test(local);
};

function validate(lead, hasResume) {
  const errors = [];
  if (lead.name.length < 2) errors.push("Please enter your full name.");
  if (!indianMobile(lead.phone)) errors.push("Please enter a valid 10-digit Indian mobile number.");
  if (!EMAIL_RE.test(lead.email)) errors.push("Please enter a valid email address.");
  if (!hasResume && !lead.naukri_login) errors.push("Please upload your resume or enter your Naukri login email / mobile.");
  if (lead.naukri_login && !EMAIL_RE.test(lead.naukri_login) && !indianMobile(lead.naukri_login))
    errors.push("Naukri login should be the email or mobile number you use on Naukri.");
  if (lead.experience && !EXPERIENCE_OPTIONS.includes(lead.experience)) errors.push("Please choose your experience from the list.");
  if (!Object.prototype.hasOwnProperty.call(PLANS, lead.plan)) errors.push("Please choose a plan: Profile Makeover or Done-For-You Job Search.");
  return errors;
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

/* ------------------------------------------------------------------ */
/* Email notification (Cloudflare Email Routing `send_email` binding) */
/* ------------------------------------------------------------------ */

async function notifyOwner(env, lead, leadId, resume) {
  let status = "skipped";
  try {
    if (env.SEND_EMAIL && env.NOTIFY_TO && env.NOTIFY_FROM) {
      const planLabel = PLANS[lead.plan] || "Plan not chosen";
      const raw = buildMime({
        from: `GetShortlisted Leads <${env.NOTIFY_FROM}>`,
        fromAddr: env.NOTIFY_FROM,
        to: env.NOTIFY_TO,
        replyTo: lead.email,
        subject: `[${lead.lead_source === SOURCE.REFERRAL ? `Referral: ${lead.referral_code}` : SOURCE_LABEL[lead.lead_source] || "Organic"}] New lead: ${lead.name} — ${planLabel}`,
        text: leadText(lead, leadId),
        html: leadHtml(lead, leadId),
        attachment: resume,
      });
      await env.SEND_EMAIL.send(new EmailMessage(env.NOTIFY_FROM, env.NOTIFY_TO, raw));
      status = "sent";
    } else {
      console.warn("SEND_EMAIL binding or NOTIFY_* missing — email skipped");
    }
  } catch (err) {
    status = "failed";
    console.error("email send failed", err && err.message ? err.message : err);
  }
  if (leadId) {
    try {
      await env.DB.prepare("UPDATE leads SET email_status = ?1 WHERE id = ?2").bind(status, leadId).run();
    } catch (err) {
      console.error("email_status update failed", err);
    }
  }
  return status;
}

const FIELDS = [
  ["Lead source", "source_label"], ["Referred by", "referrer_label"], ["Referrer Google Pay / UPI", "referrer_upi"],
  ["Referral commission (20%)", "commission_label"], ["Referral note", "referral_note"], ["Referral typed by client", "referral_typed"],
  ["Name", "name"], ["Phone / WhatsApp", "phone"], ["Email", "email"], ["Plan", "plan_label"], ["Naukri login", "naukri_login"],
  ["Resume", "resume_name"], ["Experience", "experience"], ["Target role", "target_role"], ["Message", "message"],
  ["Submitted from", "source_page"], ["UTM source", "utm_source"], ["UTM medium", "utm_medium"], ["UTM campaign", "utm_campaign"],
];
const withLabels = (lead) => {
  const r = lead.referrer;
  return {
    ...lead,
    plan_label: PLANS[lead.plan] || "Plan not chosen",
    resume_name: lead.resume_name ? `${lead.resume_name} (attached)` : "",
    source_label: SOURCE_LABEL[lead.lead_source] || "Organic",
    referrer_label: r ? `${r.name} · code ${r.code} · ${r.phone}` : "",
    referrer_upi: r && lead.lead_source === SOURCE.REFERRAL ? r.upi_phone : "",
    commission_label: lead.commission_inr ? `${inr(lead.commission_inr)} — pay after this client pays` : "",
    referral_typed: lead.lead_source === SOURCE.UNVERIFIED ? lead.referral_input : "",
  };
};

function leadText(lead, id) {
  const l = withLabels(lead);
  const lines = FIELDS.filter(([, k]) => l[k]).map(([label, k]) => `${label}: ${l[k]}`);
  return `New lead on GetShortlisted.in${id ? ` (#${id})` : ""}\n\n${lines.join("\n")}\n\nReply to this email to respond to the candidate directly.\nReminder: ask for the Naukri password only on WhatsApp, after the candidate chooses a plan.\n`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function leadHtml(lead, id) {
  // Phone-first, single-column, table-based layout (Gmail/Outlook-safe). Every label sits above its value,
  // so nothing overflows on a narrow screen; colours are chosen to survive Gmail's dark-mode inversion.
  const l = withLabels(lead);
  const waNumber = lead.phone.replace(/\D/g, "").replace(/^0/, "");
  const wa = waNumber.length === 10 ? `91${waNumber}` : waNumber;
  const first = esc(lead.name.split(" ")[0]);
  const F = "font-family:Arial,Helvetica,sans-serif;";
  const value = (k) => {
    const v = esc(l[k]).replace(/\n/g, "<br>");
    if (k === "email") return `<a href="mailto:${esc(lead.email)}" style="color:#1F48D1;text-decoration:none">${v}</a>`;
    if (k === "phone") return `<a href="tel:+${esc(wa)}" style="color:#1F48D1;text-decoration:none">${v}</a>`;
    return v;
  };
  const rows = FIELDS.filter(([, k]) => l[k]).map(([label, k]) => `
<tr><td style="${F}padding:12px 20px;border-bottom:1px solid #EEF0F3">
  <div style="font-size:11px;line-height:16px;letter-spacing:.06em;text-transform:uppercase;color:#6B7280;font-weight:700">${esc(label)}</div>
  <div style="font-size:16px;line-height:22px;color:#111827;margin-top:2px;word-break:break-word;overflow-wrap:anywhere">${value(k)}</div>
</td></tr>`).join("");
  const button = (href, bg, text) =>
    `<a href="${href}" style="${F}display:block;background:${bg};color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;line-height:20px;padding:14px 16px;border-radius:10px;text-align:center">${text}</a>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>New lead</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;-webkit-text-size-adjust:100%">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6">
<tr><td align="center" style="padding:16px 10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:14px;border-collapse:separate;overflow:hidden">
<tr><td style="${F}background:#0F3D3A;padding:20px">
  <div style="font-size:12px;line-height:18px;letter-spacing:.06em;text-transform:uppercase;color:#F4B13B;font-weight:700">New lead${id ? ` #${id}` : ""} · ${esc(l.plan_label)} · ${esc(l.source_label)}</div>
  <div style="font-size:21px;line-height:28px;font-weight:700;color:#FFFFFF;margin-top:6px">${esc(lead.name)} wants to get shortlisted</div>
</td></tr>
${rows}
<tr><td style="${F}padding:18px 20px 6px">${button(`https://wa.me/${esc(wa)}`, "#1DA851", `WhatsApp ${first}`)}</td></tr>
<tr><td style="${F}padding:6px 20px 6px">${button(`mailto:${esc(lead.email)}`, "#1F48D1", `Email ${first}`)}</td></tr>
<tr><td style="${F}padding:12px 20px 20px;font-size:12px;line-height:18px;color:#6B7280">
  Tap “Reply” to answer the candidate directly. Ask for the Naukri password only on WhatsApp, after they choose a plan.${lead.resume_name ? " The resume is attached to this email." : ""}
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function cardHtml({ kicker, title, rows, buttons = [], footer = "" }) {
  const F = "font-family:Arial,Helvetica,sans-serif;";
  const body = rows.filter(([, v]) => v).map(([k, v]) => `
<tr><td style="${F}padding:12px 20px;border-bottom:1px solid #EEF0F3">
  <div style="font-size:11px;line-height:16px;letter-spacing:.06em;text-transform:uppercase;color:#6B7280;font-weight:700">${esc(k)}</div>
  <div style="font-size:16px;line-height:22px;color:#111827;margin-top:2px;word-break:break-word;overflow-wrap:anywhere">${esc(v)}</div>
</td></tr>`).join("");
  const btns = buttons.map(([href, bg, label]) => `<tr><td style="${F}padding:12px 20px 4px"><a href="${esc(href)}" style="${F}display:block;background:${bg};color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;line-height:20px;padding:14px 16px;border-radius:10px;text-align:center">${esc(label)}</a></td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6"><tr><td align="center" style="padding:16px 10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:14px;border-collapse:separate;overflow:hidden">
<tr><td style="${F}background:#1F48D1;padding:20px"><div style="font-size:12px;line-height:18px;letter-spacing:.06em;text-transform:uppercase;color:#FFD27A;font-weight:700">${esc(kicker)}</div>
<div style="font-size:21px;line-height:28px;font-weight:700;color:#FFFFFF;margin-top:6px">${esc(title)}</div></td></tr>
${body}${btns}
<tr><td style="${F}padding:14px 20px 20px;font-size:12px;line-height:18px;color:#6B7280">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

// Base64 with 76-char lines (RFC 2045). Encodes 57-byte multiples per chunk so lines never straddle chunks —
// ~6x faster than one big btoa + regex (a 300 KB resume: ~3 ms instead of ~17 ms CPU), identical output.
function b64bytes(bytes) {
  const CHUNK = 57 * 512;
  const lines = [];
  for (let i = 0; i < bytes.length; i += CHUNK) {
    const sub = bytes.subarray(i, Math.min(i + CHUNK, bytes.length));
    let bin = "";
    for (let j = 0; j < sub.length; j += 0x2000) bin += String.fromCharCode.apply(null, sub.subarray(j, j + 0x2000));
    const b = btoa(bin);
    for (let k = 0; k < b.length; k += 76) lines.push(b.slice(k, k + 76));
  }
  return lines.join("\r\n");
}
const b64utf8 = (str) => b64bytes(new TextEncoder().encode(str));

function encodeHeader(str) {
  // RFC 2047 encoded-word for non-ASCII subjects/names.
  return /^[\x20-\x7E]*$/.test(str) ? str : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(str)))}?=`;
}

function buildMime({ from, fromAddr, to, replyTo, subject, text, html, attachment }) {
  const alt = `alt_${crypto.randomUUID()}`;
  const mixed = `mix_${crypto.randomUUID()}`;
  const domain = fromAddr.split("@")[1] || "getshortlisted.in";
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    "MIME-Version: 1.0",
    attachment ? `Content-Type: multipart/mixed; boundary="${mixed}"` : `Content-Type: multipart/alternative; boundary="${alt}"`,
  ].filter(Boolean);
  const altPart = [
    `--${alt}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64utf8(text),
    `--${alt}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64utf8(html),
    `--${alt}--`,
  ];
  if (!attachment) return [...headers, "", ...altPart, ""].join("\r\n");
  const fname = attachment.name.replace(/"/g, "");
  return [
    ...headers,
    "",
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    "",
    ...altPart,
    `--${mixed}`,
    `Content-Type: ${attachment.mime}; name="${fname}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${fname}"`,
    "",
    b64bytes(attachment.bytes),
    `--${mixed}--`,
    "",
  ].join("\r\n");
}

// Exported for tests.
export const _internal = { validate, clean, buildMime, checkFile, EXPERIENCE_OPTIONS, resolveReferral };

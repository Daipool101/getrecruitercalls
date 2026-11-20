/**
 * GetShortlisted.in — Cloudflare Worker
 *
 * Static pages are served by Workers Static Assets (./public).
 * This Worker only handles /api/* (see run_worker_first in wrangler.jsonc):
 *   POST /api/lead      -> validate (+ optional Turnstile), save lead + resume to D1, email the owner (resume attached)
 *   GET  /api/whatsapp  -> 302 to wa.me/<WHATSAPP_NUMBER> (number lives only in a Cloudflare secret, never in HTML)
 *   GET  /api/health    -> simple health check
 *
 * Secrets / variables (Cloudflare dashboard → Worker → Settings → Variables and Secrets):
 *   NOTIFY_TO          (secret)  inbox that receives leads — must be a verified Email Routing destination
 *   WHATSAPP_NUMBER    (secret)  e.g. 91XXXXXXXXXX (country code + number, digits only)
 *   TURNSTILE_SECRET   (secret, optional) enables the bot check (site key goes in site/config.mjs)
 *   NOTIFY_FROM, SITE_URL (plain vars in wrangler.jsonc)
 */
import { EmailMessage } from "cloudflare:email";

const MAX = { name: 80, phone: 20, email: 120, login: 120, experience: 40, plan: 40, target_role: 120, message: 1500, utm: 100, page: 200 };
const EXPERIENCE_OPTIONS = ["Fresher (0-1 yr)", "1-3 yrs", "3-6 yrs", "6-10 yrs", "10-15 yrs", "15+ yrs"];
const PLANS = { "": "Not sure — free check first", makeover: "Profile Makeover (₹6,000)", "done-for-you": "Done-For-You Job Search (₹8,000)" };
const RATE_LIMIT_PER_HOUR = 5;
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
  const planName = { makeover: "Profile Makeover (₹6,000)", "done-for-you": "Done-For-You Job Search (₹8,000)" }[plan];
  const text = planName
    ? `Hi GetShortlisted! I'm interested in the ${planName}. Can you check my Naukri profile?`
    : "Hi GetShortlisted! I'm not getting calls from Naukri. Can you check my profile?";
  return new Response(null, {
    status: 302,
    headers: { Location: `https://wa.me/${number}?text=${encodeURIComponent(text)}`, "Cache-Control": "no-store" },
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

  // Rate limit: max N leads per IP per hour (stops form bombing; DDoS itself is absorbed by Cloudflare).
  try {
    const row = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ?1 AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-1 hour')"
    ).bind(ipHash).first();
    if (row && row.n >= RATE_LIMIT_PER_HOUR) {
      return reply(429, { ok: false, error: "Too many requests. Please try again after some time, or message us on WhatsApp." });
    }
  } catch (err) {
    console.error("rate-limit check failed", err);
  }

  let leadId;
  try {
    const res = await env.DB.prepare(
      `INSERT INTO leads (name, phone, email, naukri_login, plan, resume_name, experience, target_role, message,
                          source_page, utm_source, utm_medium, utm_campaign, ip_hash, user_agent)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)`
    ).bind(
      lead.name, lead.phone, lead.email, lead.naukri_login || null, lead.plan || null, lead.resume_name || null,
      lead.experience || null, lead.target_role || null, lead.message || null,
      lead.source_page || null, lead.utm_source || null, lead.utm_medium || null, lead.utm_campaign || null,
      ipHash, userAgent
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
  return reply(200, { ok: true, id: leadId || null });
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
    ]);
    // v2 columns (migrations/0002). ALTER fails harmlessly if the column already exists.
    for (const col of ["naukri_login TEXT", "plan TEXT", "resume_name TEXT"]) {
      try { await env.DB.prepare(`ALTER TABLE leads ADD COLUMN ${col}`).run(); } catch {}
    }
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
  if (!(lead.plan in PLANS)) errors.push("Please choose a plan from the list.");
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
      const planLabel = PLANS[lead.plan] || PLANS[""];
      const raw = buildMime({
        from: `GetShortlisted Leads <${env.NOTIFY_FROM}>`,
        fromAddr: env.NOTIFY_FROM,
        to: env.NOTIFY_TO,
        replyTo: lead.email,
        subject: `New lead: ${lead.name} — ${lead.plan ? planLabel : "free profile check"} (${lead.experience || "exp n/a"})`,
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
  ["Name", "name"], ["Phone / WhatsApp", "phone"], ["Email", "email"], ["Plan", "plan_label"], ["Naukri login", "naukri_login"],
  ["Resume", "resume_name"], ["Experience", "experience"], ["Target role", "target_role"], ["Message", "message"],
  ["Submitted from", "source_page"], ["UTM source", "utm_source"], ["UTM medium", "utm_medium"], ["UTM campaign", "utm_campaign"],
];
const withLabels = (lead) => ({ ...lead, plan_label: PLANS[lead.plan] || PLANS[""], resume_name: lead.resume_name ? `${lead.resume_name} (attached)` : "" });

function leadText(lead, id) {
  const l = withLabels(lead);
  const lines = FIELDS.filter(([, k]) => l[k]).map(([label, k]) => `${label}: ${l[k]}`);
  return `New lead on GetShortlisted.in${id ? ` (#${id})` : ""}\n\n${lines.join("\n")}\n\nReply to this email to respond to the candidate directly.\nReminder: ask for the Naukri password only on WhatsApp, after the candidate chooses a plan.\n`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function leadHtml(lead, id) {
  const l = withLabels(lead);
  const waNumber = lead.phone.replace(/\D/g, "").replace(/^0/, "");
  const wa = waNumber.length === 10 ? `91${waNumber}` : waNumber;
  const rows = FIELDS.filter(([, k]) => l[k]).map(([label, k]) =>
    `<tr><td style="padding:8px 12px;color:#0F3D3A;font-weight:600;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:8px 12px;color:#222">${esc(l[k]).replace(/\n/g, "<br>")}</td></tr>`
  ).join("");
  return `<!doctype html><html><body style="margin:0;background:#F2E6D6;font-family:Arial,sans-serif">
<div style="max-width:620px;margin:0 auto;padding:24px">
  <div style="background:#0F3D3A;color:#F2E6D6;padding:20px 24px;border-radius:14px 14px 0 0">
    <div style="font-size:13px;color:#F4B13B;letter-spacing:.06em;text-transform:uppercase">New lead${id ? ` #${id}` : ""} · ${esc(l.plan_label)}</div>
    <div style="font-size:22px;font-weight:700;margin-top:4px">${esc(lead.name)} wants to get shortlisted</div>
  </div>
  <table style="width:100%;background:#fff;border-collapse:collapse;font-size:14px">${rows}</table>
  <div style="background:#fff;padding:16px 24px 24px;border-radius:0 0 14px 14px">
    <a href="https://wa.me/${esc(wa)}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px">WhatsApp ${esc(lead.name.split(" ")[0])}</a>
    &nbsp;<a href="mailto:${esc(lead.email)}" style="display:inline-block;background:#E0745E;color:#fff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px">Email</a>
    <p style="color:#666;font-size:12px;margin-top:16px">Hitting “Reply” on this email will reply to the candidate. Ask for the Naukri password only on WhatsApp, after they choose a plan.</p>
  </div>
</div></body></html>`;
}

function b64bytes(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/.{1,76}/g, "$&\r\n").trimEnd();
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
export const _internal = { validate, clean, buildMime, checkFile, EXPERIENCE_OPTIONS };

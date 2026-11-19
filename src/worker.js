/**
 * GetRecruiterCalls.com — Cloudflare Worker
 *
 * Static pages are served by Workers Static Assets (./public).
 * This Worker only handles /api/* (see run_worker_first in wrangler.jsonc):
 *   POST /api/lead    -> validate, save to D1, email notification to the owner
 *   GET  /api/health  -> simple health check
 */
import { EmailMessage } from "cloudflare:email";

const MAX = { name: 80, phone: 20, email: 120, url: 500, experience: 40, target_role: 120, message: 1500, utm: 100, page: 200 };
const EXPERIENCE_OPTIONS = ["Fresher (0-1 yr)", "1-3 yrs", "3-6 yrs", "6-10 yrs", "10-15 yrs", "15+ yrs"];
const RATE_LIMIT_PER_HOUR = 5;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/lead") {
      if (request.method === "POST") return handleLead(request, env, ctx);
      return json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
    }
    if (url.pathname === "/api/health") {
      return json({ ok: true, time: new Date().toISOString() });
    }
    if (url.pathname.startsWith("/api/")) {
      return json({ ok: false, error: "Not found" }, 404);
    }
    return env.ASSETS.fetch(request);
  },
};

/* ------------------------------------------------------------------ */
/* Lead handler                                                        */
/* ------------------------------------------------------------------ */

async function handleLead(request, env, ctx) {
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  const reply = (status, body) => {
    if (wantsJson) return json(body, status);
    // No-JS fallback: redirect to thank-you page or back to the form with an error flag.
    const target = body.ok ? "/thank-you/" : "/contact/?error=1";
    return Response.redirect(new URL(target, request.url).toString(), 303);
  };

  // Basic same-origin check (blocks other websites posting into the form).
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return reply(403, { ok: false, error: "Invalid origin." });
  }

  let data;
  try {
    data = await readBody(request);
  } catch {
    return reply(400, { ok: false, error: "Could not read the form. Please try again." });
  }

  // Honeypot: real users never see or fill this field. Pretend success for bots.
  if (clean(data.company_website, 200)) {
    return reply(200, { ok: true });
  }

  const lead = {
    name: clean(data.name, MAX.name),
    phone: clean(data.phone, MAX.phone),
    email: clean(data.email, MAX.email).toLowerCase(),
    naukri_url: clean(data.naukri_url, MAX.url),
    resume_url: clean(data.resume_url, MAX.url),
    experience: clean(data.experience, MAX.experience),
    target_role: clean(data.target_role, MAX.target_role),
    message: clean(data.message, MAX.message, true),
    source_page: clean(data.source_page, MAX.page),
    utm_source: clean(data.utm_source, MAX.utm),
    utm_medium: clean(data.utm_medium, MAX.utm),
    utm_campaign: clean(data.utm_campaign, MAX.utm),
  };

  const errors = validate(lead);
  if (errors.length) {
    return reply(422, { ok: false, error: errors[0], errors });
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ipHash = await sha256(`${ip}|getrecruitercalls`);
  const userAgent = clean(request.headers.get("User-Agent"), 300);

  // Simple rate limit: max N leads per IP per hour.
  try {
    const row = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ?1 AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-1 hour')"
    ).bind(ipHash).first();
    if (row && row.n >= RATE_LIMIT_PER_HOUR) {
      return reply(429, { ok: false, error: "Too many requests. Please try again after some time." });
    }
  } catch (err) {
    console.error("rate-limit check failed", err);
  }

  let leadId;
  try {
    const res = await env.DB.prepare(
      `INSERT INTO leads (name, phone, email, naukri_url, resume_url, experience, target_role, message,
                          source_page, utm_source, utm_medium, utm_campaign, ip_hash, user_agent)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)`
    ).bind(
      lead.name, lead.phone, lead.email, lead.naukri_url || null, lead.resume_url || null,
      lead.experience || null, lead.target_role || null, lead.message || null,
      lead.source_page || null, lead.utm_source || null, lead.utm_medium || null, lead.utm_campaign || null,
      ipHash, userAgent
    ).run();
    leadId = res.meta && res.meta.last_row_id;
  } catch (err) {
    console.error("D1 insert failed", err);
    // Still try to email the lead so it is never lost.
  }

  // Send the notification email in the background so the visitor gets an instant response.
  ctx.waitUntil(notifyOwner(env, lead, leadId));

  return reply(200, { ok: true, id: leadId || null });
}

/* ------------------------------------------------------------------ */
/* Validation helpers                                                  */
/* ------------------------------------------------------------------ */

async function readBody(request) {
  const type = request.headers.get("Content-Type") || "";
  if (type.includes("application/json")) {
    const body = await request.json();
    return body && typeof body === "object" ? body : {};
  }
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    const form = await request.formData();
    const out = {};
    for (const [k, v] of form.entries()) if (typeof v === "string") out[k] = v;
    return out;
  }
  throw new Error("Unsupported content type");
}

function clean(value, max, multiline = false) {
  if (value === undefined || value === null) return "";
  let s = String(value);
  s = multiline ? s.replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  // Strip control characters (keep newlines only for multiline fields).
  s = s.replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");
  return s.trim().slice(0, max);
}

function isHttpUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function validate(lead) {
  const errors = [];
  if (lead.name.length < 2) errors.push("Please enter your full name.");
  const digits = lead.phone.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  if (!/^[6-9]\d{9}$/.test(local)) errors.push("Please enter a valid 10-digit Indian mobile number.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.push("Please enter a valid email address.");
  if (!lead.naukri_url && !lead.resume_url) errors.push("Please share your Naukri profile link or your resume link.");
  if (lead.naukri_url && !isHttpUrl(lead.naukri_url)) errors.push("Naukri profile link should start with https://");
  if (lead.resume_url && !isHttpUrl(lead.resume_url)) errors.push("Resume link should start with https://");
  if (lead.experience && !EXPERIENCE_OPTIONS.includes(lead.experience)) errors.push("Please choose your experience from the list.");
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

async function notifyOwner(env, lead, leadId) {
  let status = "skipped";
  try {
    if (env.SEND_EMAIL && env.NOTIFY_TO && env.NOTIFY_FROM) {
      const raw = buildMime({
        from: `GetRecruiterCalls Leads <${env.NOTIFY_FROM}>`,
        fromAddr: env.NOTIFY_FROM,
        to: env.NOTIFY_TO,
        replyTo: lead.email,
        subject: `New lead: ${lead.name} (${lead.experience || "experience n/a"}) — GetRecruiterCalls`,
        text: leadText(lead, leadId),
        html: leadHtml(lead, leadId),
      });
      await env.SEND_EMAIL.send(new EmailMessage(env.NOTIFY_FROM, env.NOTIFY_TO, raw));
      status = "sent";
    } else {
      console.warn("SEND_EMAIL binding or NOTIFY_* vars missing — email skipped");
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
  ["Name", "name"], ["Phone / WhatsApp", "phone"], ["Email", "email"], ["Naukri profile", "naukri_url"],
  ["Resume link", "resume_url"], ["Experience", "experience"], ["Target role", "target_role"], ["Message", "message"],
  ["Submitted from", "source_page"], ["UTM source", "utm_source"], ["UTM medium", "utm_medium"], ["UTM campaign", "utm_campaign"],
];

function leadText(lead, id) {
  const lines = FIELDS.filter(([, k]) => lead[k]).map(([label, k]) => `${label}: ${lead[k]}`);
  return `New lead on GetRecruiterCalls.com${id ? ` (#${id})` : ""}\n\n${lines.join("\n")}\n\nReply to this email to respond to the candidate directly.\n`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function leadHtml(lead, id) {
  const waNumber = lead.phone.replace(/\D/g, "").replace(/^0/, "");
  const wa = waNumber.length === 10 ? `91${waNumber}` : waNumber;
  const rows = FIELDS.filter(([, k]) => lead[k]).map(([label, k]) => {
    const v = lead[k];
    const val = /_url$/.test(k) && isHttpUrl(v) ? `<a href="${esc(v)}">${esc(v)}</a>` : esc(v).replace(/\n/g, "<br>");
    return `<tr><td style="padding:8px 12px;color:#0F3D3A;font-weight:600;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:8px 12px;color:#222">${val}</td></tr>`;
  }).join("");
  return `<!doctype html><html><body style="margin:0;background:#F2E6D6;font-family:Arial,sans-serif">
<div style="max-width:620px;margin:0 auto;padding:24px">
  <div style="background:#0F3D3A;color:#F2E6D6;padding:20px 24px;border-radius:14px 14px 0 0">
    <div style="font-size:13px;color:#F4B13B;letter-spacing:.06em;text-transform:uppercase">New lead${id ? ` #${id}` : ""}</div>
    <div style="font-size:22px;font-weight:700;margin-top:4px">${esc(lead.name)} wants recruiter calls</div>
  </div>
  <table style="width:100%;background:#fff;border-collapse:collapse;font-size:14px">${rows}</table>
  <div style="background:#fff;padding:16px 24px 24px;border-radius:0 0 14px 14px">
    <a href="https://wa.me/${esc(wa)}" style="display:inline-block;background:#F4B13B;color:#0F3D3A;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px">WhatsApp ${esc(lead.name.split(" ")[0])}</a>
    &nbsp;<a href="mailto:${esc(lead.email)}" style="display:inline-block;background:#E0745E;color:#fff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px">Email</a>
    <p style="color:#666;font-size:12px;margin-top:16px">Hitting “Reply” on this email will reply to the candidate.</p>
  </div>
</div></body></html>`;
}

function b64utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/.{1,76}/g, "$&\r\n").trimEnd();
}

function encodeHeader(str) {
  // RFC 2047 encoded-word for non-ASCII subjects/names.
  return /^[\x20-\x7E]*$/.test(str) ? str : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(str)))}?=`;
}

function buildMime({ from, fromAddr, to, replyTo, subject, text, html }) {
  const boundary = `grc_${crypto.randomUUID()}`;
  const domain = fromAddr.split("@")[1] || "getrecruitercalls.com";
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean);
  return [
    ...headers,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64utf8(text),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64utf8(html),
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

// Exported for tests.
export const _internal = { validate, clean, buildMime, EXPERIENCE_OPTIONS };

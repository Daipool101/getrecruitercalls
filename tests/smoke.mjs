// Smoke tests against a running server.
// Usage: start `npm run dev` in one terminal, then `npm test` (or BASE=https://getshortlisted.in npm test — read-only checks only with READONLY=1).
const BASE = process.env.BASE || "http://127.0.0.1:8787";
const READONLY = process.env.READONLY === "1";
let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("  ✓", msg); } else { fail++; console.log("  ✗", msg); } };

async function get(path) {
  const r = await fetch(BASE + path, { redirect: "manual" });
  return { status: r.status, headers: r.headers, text: await r.text() };
}

console.log(`Testing ${BASE}\n`);

// 1. Every sitemap URL renders with complete SEO tags
console.log("Pages:");
const sitemap = await get("/sitemap.xml");
ok(sitemap.status === 200, "sitemap.xml 200");
const paths = [...sitemap.text.matchAll(/<loc>https:\/\/getshortlisted\.in([^<]*)<\/loc>/g)].map((m) => m[1]);
ok(paths.length >= 10, `sitemap lists ${paths.length} URLs`);
const titles = new Set(), descs = new Set();
for (const p of paths) {
  const r = await get(p);
  const title = (r.text.match(/<title>([^<]+)<\/title>/) || [])[1];
  const desc = (r.text.match(/<meta name="description" content="([^"]+)"/) || [])[1];
  const canon = (r.text.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const h1s = (r.text.match(/<h1[\s>]/g) || []).length;
  let ldOk = false;
  try {
    const ld = JSON.parse(r.text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    ldOk = Array.isArray(ld["@graph"]) && ld["@graph"].length >= 2;
  } catch {}
  const good = r.status === 200 && title && desc && canon === `https://getshortlisted.in${p}` && h1s === 1 && ldOk && !titles.has(title) && !descs.has(desc);
  titles.add(title); descs.add(desc);
  ok(good, `${p} — 200, unique title/description, canonical, single H1, JSON-LD (title ${title?.length}ch, desc ${desc?.length}ch)`);
}

// 2. Static files
console.log("\nStatic files:");
for (const f of ["/robots.txt", "/llms.txt", "/favicon.svg", "/favicon.ico", "/site.webmanifest", "/img/og-image.png", "/css/styles.css", "/js/main.js"]) {
  ok((await get(f)).status === 200, `${f} 200`);
}
const robots = await get("/robots.txt");
ok(robots.text.includes("Sitemap: https://getshortlisted.in/sitemap.xml"), "robots.txt points to sitemap");
const nf = await get("/this-page-does-not-exist/");
ok(nf.status === 404 && nf.text.includes("This page took a different job"), "unknown URL returns custom 404");
const ty = await get("/thank-you/");
ok(ty.text.includes('content="noindex, follow"'), "thank-you page is noindex");
const home = await get("/");
ok(home.headers.get("x-frame-options") === "DENY", "security headers applied");

// 3. API
console.log("\nAPI:");
const health = await fetch(BASE + "/api/health").then((r) => r.json());
ok(health.ok === true, "GET /api/health ok");
const getLead = await fetch(BASE + "/api/lead");
ok(getLead.status === 405, "GET /api/lead -> 405");
ok(!home.text.includes("wa.me/"), "WhatsApp number is not in the page HTML");
const wa = await fetch(BASE + "/api/whatsapp?from=test&plan=makeover", { redirect: "manual" });
ok(wa.status === 302 && /^(https:\/\/wa\.me\/\d{10,}\?text=|.*\/contact\/$)/.test(wa.headers.get("location") || ""), `GET /api/whatsapp redirects (${(wa.headers.get("location") || "").slice(0, 24)}…)`);
ok(wa.headers.get("x-robots-tag") === "noindex, nofollow", "API responses are noindex");

if (!READONLY) {
  const PDF = new Uint8Array([...new TextEncoder().encode("%PDF-1.4\n"), ...new Uint8Array(400).fill(32), ...new TextEncoder().encode("\n%%EOF")]);
  const post = (fields, { file, headers = {} } = {}) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.append(k, v);
    if (file) fd.append("resume", new Blob([file.bytes], { type: file.type || "application/pdf" }), file.name);
    return fetch(BASE + "/api/lead", { method: "POST", redirect: "manual", headers: { Accept: "application/json", ...headers }, body: fd });
  };
  const valid = {
    name: "Test Candidate", phone: "+91 98765 43210", email: "test.candidate@example.com",
    naukri_login: "test.candidate@example.com", plan: "makeover",
    experience: "3-6 yrs", target_role: "Data Analyst", message: "Smoke test — please ignore.", source_page: "/",
    utm_source: "smoke", utm_medium: "test", utm_campaign: "ci",
  };
  const resume = { bytes: PDF, name: "Test Resume.pdf" };

  let r = await post(valid, { file: resume });
  let j = await r.json();
  ok(r.status === 200 && j.ok && j.id, `valid lead with resume upload accepted (id ${j.id})`);

  r = await post({ ...valid, phone: "12345" });
  j = await r.json();
  ok(r.status === 422 && /mobile/.test(j.error), "invalid phone rejected");

  r = await post({ ...valid, email: "nope" });
  ok(r.status === 422, "invalid email rejected");

  r = await post({ ...valid, naukri_login: "" });
  j = await r.json();
  ok(r.status === 422 && /upload your resume or enter your Naukri login/.test(j.error), "missing resume and Naukri login rejected");

  r = await post({ ...valid, naukri_login: "not a login" });
  ok(r.status === 422, "invalid Naukri login rejected");

  r = await post(valid, { file: { bytes: new TextEncoder().encode("MZ".padEnd(500, "x")), name: "resume.pdf" } });
  j = await r.json();
  ok(r.status === 422 && /real PDF/.test(j.error), "fake PDF (wrong file content) rejected");

  r = await post(valid, { file: { bytes: PDF, name: "resume.exe", type: "application/octet-stream" } });
  ok(r.status === 422, "non-resume file type rejected");

  r = await post({ ...valid, plan: "free-iphone" });
  ok(r.status === 422, "unknown plan rejected");

  r = await post({ ...valid, experience: "100 yrs" });
  ok(r.status === 422, "unknown experience option rejected");

  r = await post({ ...valid, company_website: "http://spam.example" });
  j = await r.json();
  ok(r.status === 200 && j.ok && !j.id, "honeypot silently ignored (not saved)");

  r = await post(valid, { headers: { Origin: "https://evil.example" } });
  ok(r.status === 403, "cross-origin post blocked");

  // No-JS fallback: plain multipart form post -> 303 redirect to /thank-you/
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...valid, name: "No JS Candidate" })) fd.append(k, v);
  r = await fetch(BASE + "/api/lead", { method: "POST", redirect: "manual", body: fd });
  ok(r.status === 303 && (r.headers.get("location") || "").endsWith("/thank-you/"), "no-JS form post redirects to /thank-you/");

  // Rate limit: 20 per IP per hour (2 already saved above) -> eventually 429
  let saw429 = false;
  for (let i = 0; i < 25; i++) {
    const rr = await post({ ...valid, name: `Rate ${i}` });
    if (rr.status === 429) { saw429 = true; break; }
  }
  ok(saw429, "rate limit kicks in (429)");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

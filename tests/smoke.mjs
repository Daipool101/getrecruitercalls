// Smoke tests against a running server.
// Usage: start `npm run dev` in one terminal, then `npm test` (or BASE=https://getshortlisted.com npm test — read-only checks only with READONLY=1).
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
const paths = [...sitemap.text.matchAll(/<loc>https:\/\/getshortlisted.com([^<]*)<\/loc>/g)].map((m) => m[1]);
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
  const good = r.status === 200 && title && desc && canon === `https://getshortlisted.com${p}` && h1s === 1 && ldOk && !titles.has(title) && !descs.has(desc);
  titles.add(title); descs.add(desc);
  ok(good, `${p} — 200, unique title/description, canonical, single H1, JSON-LD (title ${title?.length}ch, desc ${desc?.length}ch)`);
}

// 2. Static files
console.log("\nStatic files:");
for (const f of ["/robots.txt", "/llms.txt", "/favicon.svg", "/favicon.ico", "/site.webmanifest", "/img/og-image.png", "/css/styles.css", "/js/main.js"]) {
  ok((await get(f)).status === 200, `${f} 200`);
}
const robots = await get("/robots.txt");
ok(robots.text.includes("Sitemap: https://getshortlisted.com/sitemap.xml"), "robots.txt points to sitemap");
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

if (!READONLY) {
  const post = (body, headers = {}) =>
    fetch(BASE + "/api/lead", {
      method: "POST",
      redirect: "manual",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", ...headers },
      body: new URLSearchParams(body).toString(),
    });
  const valid = {
    name: "Test Candidate", phone: "+91 98765 43210", email: "test.candidate@example.com",
    naukri_url: "https://www.naukri.com/mnjuser/profile?id=test", resume_url: "",
    experience: "3-6 yrs", target_role: "Data Analyst", message: "Smoke test — please ignore.", source_page: "/",
    utm_source: "smoke", utm_medium: "test", utm_campaign: "ci",
  };

  let r = await post(valid);
  let j = await r.json();
  ok(r.status === 200 && j.ok && j.id, `valid lead accepted (id ${j.id})`);

  r = await post({ ...valid, phone: "12345" });
  j = await r.json();
  ok(r.status === 422 && /mobile/.test(j.error), "invalid phone rejected");

  r = await post({ ...valid, email: "nope" });
  ok(r.status === 422, "invalid email rejected");

  r = await post({ ...valid, naukri_url: "", resume_url: "" });
  j = await r.json();
  ok(r.status === 422 && /Naukri profile link or your resume link/.test(j.error), "missing both links rejected");

  r = await post({ ...valid, naukri_url: "javascript:alert(1)" });
  ok(r.status === 422, "non-http link rejected");

  r = await post({ ...valid, experience: "100 yrs" });
  ok(r.status === 422, "unknown experience option rejected");

  r = await post({ ...valid, company_website: "http://spam.example" });
  j = await r.json();
  ok(r.status === 200 && j.ok && !j.id, "honeypot silently ignored (not saved)");

  r = await post(valid, { Origin: "https://evil.example" });
  ok(r.status === 403, "cross-origin post blocked");

  // No-JS fallback: plain form post -> 303 redirect to /thank-you/
  r = await fetch(BASE + "/api/lead", {
    method: "POST", redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...valid, name: "No JS Candidate" }).toString(),
  });
  ok(r.status === 303 && (r.headers.get("location") || "").endsWith("/thank-you/"), "no-JS form post redirects to /thank-you/");

  // Rate limit: 5 per IP per hour (2 already saved above) -> eventually 429
  let saw429 = false;
  for (let i = 0; i < 6; i++) {
    const rr = await post({ ...valid, name: `Rate ${i}` });
    if (rr.status === 429) { saw429 = true; break; }
  }
  ok(saw429, "rate limit kicks in (429)");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

// Spike / load test — simulates influencer traffic.
//   Full system (local dev server):  node tests/load.mjs --base http://127.0.0.1:8787 --visitors 3000 --concurrency 100
//   Pages only (live CDN, safe):     node tests/load.mjs --base https://getshortlisted.in --visitors 1500 --concurrency 100 --pages-only
// Each "visitor" opens the home page + CSS + JS; 25% submit the form (half with a ~300 KB PDF resume),
// 10% tap WhatsApp, 5% arrive with a referral code. Every visitor uses its own (simulated) IP address.
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://127.0.0.1:8787");
const VISITORS = Number(arg("visitors", 1000));
const CONCURRENCY = Number(arg("concurrency", 50));
const PAGES_ONLY = process.argv.includes("--pages-only");
const LOCAL = /127\.0\.0\.1|localhost/.test(BASE);
if (!LOCAL && !PAGES_ONLY) { console.error("Refusing to POST test leads to a live site. Use --pages-only for live."); process.exit(1); }

const PDF = new Uint8Array([...new TextEncoder().encode("%PDF-1.4\n"), ...new Uint8Array(300_000).fill(65), ...new TextEncoder().encode("\n%%EOF")]);
const stats = {};
const rec = (type, ms, status) => {
  const s = (stats[type] ||= { ms: [], codes: {} });
  s.ms.push(ms); s.codes[status] = (s.codes[status] || 0) + 1;
};
async function timed(type, url, init = {}) {
  const t = performance.now();
  try {
    const r = await fetch(url, { redirect: "manual", ...init });
    await r.arrayBuffer();
    rec(type, performance.now() - t, r.status);
    return r;
  } catch (e) {
    rec(type, performance.now() - t, "NETWORK_ERR");
    return null;
  }
}
let n = 0;
const fakeIp = () => `10.${(n >> 16) & 255}.${(n >> 8) & 255}.${n & 255}`;

async function visitor(i) {
  const ip = fakeIp(); n++;
  const h = LOCAL ? { "CF-Connecting-IP": ip } : {};
  const ref = i % 20 === 0;
  await timed("page /", `${BASE}/${ref ? "?ref=LOADREF" : ""}`, { headers: h });
  await Promise.all([timed("asset css", `${BASE}/css/styles.css`, { headers: h }), timed("asset js", `${BASE}/js/main.js`, { headers: h })]);
  if (i % 3 === 0) await timed("page /pricing/", `${BASE}/pricing/`, { headers: h });
  if (PAGES_ONLY) return;
  if (ref) await timed("api ref lookup", `${BASE}/api/ref?code=LOADREF`, { headers: h });
  if (i % 10 === 0) await timed("api whatsapp", `${BASE}/api/whatsapp?from=load`, { headers: h });
  if (i % 4 === 0) {
    const fd = new FormData();
    const phone = "7" + String(100000000 + i).slice(-9);
    Object.entries({ name: `Load Visitor ${i}`, phone, email: `load${i}@example.com`, naukri_login: `load${i}@example.com`,
      plan: i % 8 === 0 ? "done-for-you" : "makeover", experience: "1-3 yrs", source_page: "/", referral: ref ? "LOADREF" : "" })
      .forEach(([k, v]) => fd.append(k, v));
    if (i % 8 === 0) fd.append("resume", new Blob([PDF], { type: "application/pdf" }), `cv-${i}.pdf`);
    await timed(i % 8 === 0 ? "api lead + 300KB resume" : "api lead", `${BASE}/api/lead`, { method: "POST", headers: { ...h, Accept: "application/json" }, body: fd });
  }
}

const pct = (arr, p) => { const a = [...arr].sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor((p / 100) * a.length))] : 0; };
const t0 = performance.now();
let next = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (next < VISITORS) await visitor(next++); }));
const secs = (performance.now() - t0) / 1000;

let total = 0, bad = 0;
console.log(`\n${BASE} — ${VISITORS} visitors, ${CONCURRENCY} at the same time, ${secs.toFixed(1)}s\n`);
console.log("type".padEnd(26), "count".padStart(6), "p50 ms".padStart(8), "p95 ms".padStart(8), "max ms".padStart(8), "  status codes");
for (const [type, s] of Object.entries(stats)) {
  total += s.ms.length;
  for (const [code, c] of Object.entries(s.codes)) if (!/^(200|302|303|304|404)$/.test(code) || (code === "404" && type !== "api ref lookup")) bad += c;
  console.log(type.padEnd(26), String(s.ms.length).padStart(6), pct(s.ms, 50).toFixed(0).padStart(8), pct(s.ms, 95).toFixed(0).padStart(8), Math.max(...s.ms).toFixed(0).padStart(8), "  " + JSON.stringify(s.codes));
}
console.log(`\n${total} requests, ${(total / secs).toFixed(0)} req/s, failures: ${bad}`);
process.exit(bad ? 1 : 0);

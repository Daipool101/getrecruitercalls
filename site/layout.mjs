import { SITE, NAV, EXPERIENCE_OPTIONS } from "./config.mjs";

export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const abs = (path) => SITE.url + path;

/* ---------------- Schema.org (JSON-LD) helpers ---------------- */

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export function orgSchema() {
  const sameAs = Object.values(SITE.social).filter(Boolean);
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: ["Get Recruiter Calls", "getrecruitercalls.com"],
    url: SITE.url,
    logo: abs("/img/logo.png"),
    image: abs(SITE.ogImage),
    description: SITE.description,
    email: SITE.email,
    founder: { "@type": "Person", name: SITE.founder },
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "Naukri profile optimization", "Resume optimization", "ATS-friendly resume", "Naukri resume headline",
      "Naukri key skills", "Recruiter search (Resdex)", "Job search in India", "LinkedIn profile basics",
    ],
    serviceType: ["Naukri profile optimization", "Resume optimization", "ATS resume writing"],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqSchema(faqs) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: stripTags(f.a) } })),
  };
}

export function serviceSchema({ name, path, description, serviceType }) {
  return {
    "@type": "Service",
    "@id": `${abs(path)}#service`,
    name,
    serviceType,
    description,
    url: abs(path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
    audience: { "@type": "Audience", audienceType: "Job seekers in India" },
  };
}

export function articleSchema({ title, description, path, published, modified }) {
  return {
    "@type": "Article",
    "@id": `${abs(path)}#article`,
    headline: title,
    description,
    mainEntityOfPage: abs(path),
    image: abs(SITE.ogImage),
    datePublished: published,
    dateModified: modified || published,
    inLanguage: "en-IN",
    author: { "@type": "Person", name: SITE.founder, url: abs("/about/") },
    publisher: { "@id": ORG_ID },
  };
}

export const stripTags = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/* ---------------- Reusable UI blocks ---------------- */

export function faqList(faqs) {
  return `<div class="faq">${faqs
    .map((f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${f.a}</div></details>`)
    .join("")}</div>`;
}

export function breadcrumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
    .map((it, i) =>
      i === items.length - 1
        ? `<li aria-current="page">${esc(it.name)}</li>`
        : `<li><a href="${it.path}">${esc(it.name)}</a></li>`
    )
    .join("")}</ol></nav>`;
}

let formCount = 0;
export function leadForm({ heading = "Get your profile reviewed", sub = "Share your details. We'll reply on WhatsApp / email within 24 hours.", compact = false } = {}) {
  const n = ++formCount;
  const id = (f) => `${f}-${n}`;
  return `<form class="lead-form${compact ? " compact" : ""}" action="/api/lead" method="post" novalidate data-lead-form>
  <div class="form-head">
    <h2 class="form-title">${esc(heading)}</h2>
    <p class="form-sub">${esc(sub)}</p>
  </div>
  <div class="field">
    <label for="${id("name")}">Full name</label>
    <input id="${id("name")}" name="name" type="text" autocomplete="name" required minlength="2" maxlength="80" placeholder="e.g. Rahul Sharma">
  </div>
  <div class="field-row">
    <div class="field">
      <label for="${id("phone")}">Mobile (WhatsApp)</label>
      <input id="${id("phone")}" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20" placeholder="98XXXXXXXX">
    </div>
    <div class="field">
      <label for="${id("email")}">Email</label>
      <input id="${id("email")}" name="email" type="email" autocomplete="email" required maxlength="120" placeholder="you@email.com">
    </div>
  </div>
  <div class="field">
    <label for="${id("naukri")}">Naukri profile link</label>
    <input id="${id("naukri")}" name="naukri_url" type="url" inputmode="url" maxlength="500" placeholder="https://www.naukri.com/mnjuser/profile?id=...">
  </div>
  <div class="field">
    <label for="${id("resume")}">Resume link <span class="opt">(Google Drive / Dropbox)</span></label>
    <input id="${id("resume")}" name="resume_url" type="url" inputmode="url" maxlength="500" placeholder="https://drive.google.com/...">
    <p class="hint">Share at least one — Naukri link or resume link.</p>
  </div>
  <div class="field-row">
    <div class="field">
      <label for="${id("exp")}">Experience</label>
      <select id="${id("exp")}" name="experience" required>
        <option value="">Select</option>
        ${EXPERIENCE_OPTIONS.map((o) => `<option>${esc(o)}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label for="${id("role")}">Target job role</label>
      <input id="${id("role")}" name="target_role" type="text" maxlength="120" placeholder="e.g. Data Analyst">
    </div>
  </div>
  ${compact ? "" : `<div class="field">
    <label for="${id("msg")}">Anything else? <span class="opt">(optional)</span></label>
    <textarea id="${id("msg")}" name="message" rows="3" maxlength="1500" placeholder="Notice period, preferred city, current CTC, problem you are facing..."></textarea>
  </div>`}
  <div class="hp" aria-hidden="true"><label for="${id("cw")}">Company website</label><input id="${id("cw")}" name="company_website" type="text" tabindex="-1" autocomplete="off"></div>
  <input type="hidden" name="source_page" value="">
  <input type="hidden" name="utm_source" value="">
  <input type="hidden" name="utm_medium" value="">
  <input type="hidden" name="utm_campaign" value="">
  <button class="btn btn-gold btn-block" type="submit">Get Recruiter Calls <span aria-hidden="true">→</span></button>
  <p class="form-status" role="status" aria-live="polite"></p>
  <p class="form-legal">By submitting, you agree to our <a href="/privacy-policy/">Privacy Policy</a>. No spam.</p>
</form>`;
}

export function ctaBand({ title = "Ready to start getting recruiter calls?", text = "Share your Naukri profile or resume. We’ll show you exactly what’s stopping recruiters from calling — and fix it." } = {}) {
  return `<section class="cta-band"><div class="wrap cta-inner">
  <div><h2>${esc(title)}</h2><p>${esc(text)}</p></div>
  <a class="btn btn-gold btn-lg" href="/contact/">Get my profile optimized <span aria-hidden="true">→</span></a>
</div></section>`;
}

/* ---------------- Page shell ---------------- */

const LOGO = `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#F4B13B"/><path d="M27.6 25.4c-1.3 0-2.6-.2-3.8-.6-.4-.1-.8 0-1.1.3l-1.7 2.1c-3-1.5-5.4-3.9-6.8-6.8l2.1-1.8c.3-.3.4-.7.3-1.1-.4-1.2-.6-2.5-.6-3.8 0-.6-.5-1.1-1.1-1.1h-3.8c-.6 0-1.1.3-1.1 1.1C10 23.5 16.5 30 26.4 30c.8 0 1.1-.6 1.1-1.1v-2.4c0-.6-.5-1.1-1.1-1.1z" fill="#0F3D3A"/><circle cx="27" cy="13" r="4.2" fill="#E0745E"/></svg>`;

export function render(page) {
  const {
    path, title, description, body, schema = [], noindex = false, ogType = "website",
    published, modified, keywords,
  } = page;
  const canonical = abs(path);
  const graph = { "@context": "https://schema.org", "@graph": [orgSchema(), websiteSchema(), ...schema] };
  const suffixed = `${title} | ${SITE.name}`;
  const fullTitle = title.includes(SITE.name) || suffixed.length > 65 ? title : suffixed;

  const navLinks = NAV.map(
    (l) => `<li><a href="${l.href}"${l.href === path ? ' aria-current="page"' : ""}>${esc(l.label)}</a></li>`
  ).join("");

  const social = Object.entries(SITE.social).filter(([, v]) => v)
    .map(([k, v]) => `<a href="${esc(v)}" rel="me noopener" target="_blank">${k[0].toUpperCase() + k.slice(1)}</a>`).join(" · ");

  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ""}
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en-IN" href="${canonical}">
<link rel="alternate" hreflang="x-default" href="${canonical}">
<meta name="theme-color" content="${SITE.themeColor}">
<meta name="author" content="${esc(SITE.founder)}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(SITE.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="GetRecruiterCalls — Naukri profile and resume optimization">
${published ? `<meta property="article:published_time" content="${published}">\n<meta property="article:modified_time" content="${modified || published}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(SITE.ogImage)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/css/styles.css?v=${globalThis.ASSET_VER || SITE.updated}">
<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>
<script src="/js/main.js?v=${globalThis.ASSET_VER || SITE.updated}" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${esc(SITE.name)} home">${LOGO}<span>Get<b>Recruiter</b>Calls</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr">Menu</span><span class="bars" aria-hidden="true"></span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${navLinks}</ul>
      <a class="btn btn-gold btn-sm" href="/contact/">Get Calls</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <a class="brand brand-light" href="/">${LOGO}<span>Get<b>Recruiter</b>Calls</span></a>
      <p>Naukri profile optimization and ATS-friendly resume writing for job seekers across India — so recruiters find you, and call you.</p>
      <a class="btn btn-gold btn-sm" href="/contact/">Get my profile optimized</a>
    </div>
    <div>
      <h3>Services</h3>
      <ul>
        <li><a href="/naukri-profile-optimization/">Naukri Profile Optimization</a></li>
        <li><a href="/resume-optimization/">Resume Optimization</a></li>
        <li><a href="/#how-it-works">How it works</a></li>
        <li><a href="/faq/">FAQ</a></li>
      </ul>
    </div>
    <div>
      <h3>Free guides</h3>
      <ul>
        <li><a href="/blog/not-getting-calls-from-naukri/">Not getting calls from Naukri?</a></li>
        <li><a href="/blog/naukri-profile-optimization-tips/">Naukri profile tips</a></li>
        <li><a href="/blog/naukri-resume-headline-examples/">Resume headline examples</a></li>
        <li><a href="/blog/ats-friendly-resume-format/">ATS-friendly resume format</a></li>
      </ul>
    </div>
    <div>
      <h3>Company</h3>
      <ul>
        <li><a href="/about/">About</a></li>
        <li><a href="/contact/">Contact</a></li>
        <li><a href="/privacy-policy/">Privacy Policy</a></li>
        <li><a href="/terms/">Terms of Service</a></li>
      </ul>
      <p class="footer-mail"><a href="mailto:${SITE.email}">${SITE.email}</a></p>
      ${social ? `<p class="footer-social">${social}</p>` : ""}
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${new Date().getFullYear()} ${esc(SITE.name)}. All rights reserved.</p>
    <p class="disclaimer">GetRecruiterCalls is an independent career service. We are not affiliated with, endorsed by, or partnered with Naukri.com or Info Edge (India) Ltd. “Naukri” is a trademark of its respective owner.</p>
  </div>
</footer>
</body>
</html>
`;
}

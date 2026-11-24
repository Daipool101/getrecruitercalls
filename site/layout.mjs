import { SITE, NAV, EXPERIENCE_OPTIONS, PLANS, inr, REFERRAL_PERCENT } from "./config.mjs";
import { logoMark, WORDMARK } from "./brand.mjs";

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
    alternateName: ["Get Shortlisted", "getshortlisted.in"],
    slogan: "Get shortlisted. Get recruiter calls.",
    priceRange: `${inr(PLANS[0].price)} – ${inr(PLANS[PLANS.length - 1].price)}`,
    currenciesAccepted: "INR",
    url: SITE.url,
    logo: abs("/img/logo.png"),
    image: abs(SITE.ogImage),
    description: SITE.description,
    email: SITE.email,
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "Naukri profile optimization", "Resume optimization", "ATS-friendly resume", "Naukri resume headline",
      "Naukri key skills", "Recruiter search (Resdex)", "Job search in India", "LinkedIn profile basics",
    ],
    serviceType: ["Naukri profile optimization", "Resume optimization", "ATS resume writing", "Job application service"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Plans",
      itemListElement: PLANS.map((p) => planOffer(p)),
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function planOffer(p) {
  return {
    "@type": "Offer",
    name: p.name,
    description: p.pitch,
    price: String(p.price),
    priceCurrency: "INR",
    url: abs(p.url),
    availability: "https://schema.org/InStock",
    itemOffered: { "@type": "Service", name: p.name, areaServed: { "@type": "Country", name: "India" } },
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

export function serviceSchema({ name, path, description, serviceType, plan }) {
  return {
    ...(plan ? { offers: planOffer(plan) } : {}),
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
    author: { "@id": ORG_ID },
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
export const WA_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2zm5.8 14.03c-.25.69-1.45 1.33-2 1.38-.51.05-1 .23-3.36-.7-2.84-1.12-4.65-4.03-4.79-4.22-.14-.18-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.34.25-.28.55-.35.74-.35l.53.01c.17 0 .4-.06.62.48.25.6.84 2.06.92 2.21.07.14.12.31.02.5-.09.18-.14.3-.28.46l-.42.49c-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.92 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.7-.82.89-1.1.18-.28.37-.23.62-.14.25.09 1.6.76 1.88.9.27.13.46.2.53.32.07.11.07.65-.18 1.34z"/></svg>`;

/** Link to the WhatsApp redirect. The number lives only in a Cloudflare secret, never in the HTML. */
export const waHref = (from = "site", plan = "") =>
  `/api/whatsapp?from=${encodeURIComponent(from)}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`;

export function waButton({ from = "site", plan = "", label = "Chat on WhatsApp", cls = "btn btn-wa" } = {}) {
  return `<a class="${cls}" href="${waHref(from, plan)}" rel="nofollow noopener" target="_blank">${WA_ICON}<span>${esc(label)}</span></a>`;
}

export function leadForm({ heading = "Get shortlisted on Naukri", sub = "Takes 60 seconds. We reply on WhatsApp within 24 hours.", compact = false, plan = "" } = {}) {
  const n = ++formCount;
  const id = (f) => `${f}-${n}`;
  return `<form class="lead-form${compact ? " compact" : ""}" action="/api/lead" method="post" enctype="multipart/form-data" novalidate data-lead-form>
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
    <span class="label" id="${id("resume")}-l">Upload your resume <span class="opt">(PDF or Word, max 2 MB)</span></span>
    <label class="file-drop" for="${id("resume")}">
      <input id="${id("resume")}" name="resume" type="file" aria-labelledby="${id("resume")}-l" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
      <span class="file-btn" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg></span>
      <span class="file-text"><b>Choose file</b><span class="file-name"></span><span class="file-hint">From your phone or computer</span></span>
    </label>
  </div>
  <div class="field">
    <label for="${id("login")}">Naukri login email or mobile</label>
    <input id="${id("login")}" name="naukri_login" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="120" placeholder="The email / mobile you use on Naukri">
    <p class="hint lock">Naukri profiles have no shareable link, so we update yours from inside your account. <b>Never type your password here</b> — we ask for it only on WhatsApp, after you choose a plan.</p>
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
      <label for="${id("plan")}">Plan</label>
      <select id="${id("plan")}" name="plan" required>
        ${PLANS.map((p) => `<option value="${p.id}"${p.id === (plan || PLANS[0].id) ? " selected" : ""}>${esc(p.name)} · ${inr(p.price)}</option>`).join("")}
      </select>
    </div>
  </div>
  <div class="field">
    <label for="${id("role")}">Target job role <span class="opt">(optional)</span></label>
    <input id="${id("role")}" name="target_role" type="text" maxlength="120" placeholder="e.g. Data Analyst, Sales Manager">
  </div>
  <div class="field ref-field">
    <label for="${id("ref")}">Referred by someone? <span class="opt">(optional)</span></label>
    <input id="${id("ref")}" name="referral" type="text" maxlength="80" autocomplete="off" spellcheck="false" placeholder="Referral code or friend’s name" data-ref-input>
    <p class="hint" data-ref-status>Leave empty if no one referred you.</p>
  </div>
  ${compact ? "" : `<div class="field">
    <label for="${id("msg")}">Anything else? <span class="opt">(optional)</span></label>
    <textarea id="${id("msg")}" name="message" rows="3" maxlength="1500" placeholder="Notice period, preferred city, current CTC, problem you are facing..."></textarea>
  </div>`}
  ${SITE.turnstileSiteKey ? `<div class="cf-turnstile" data-sitekey="${esc(SITE.turnstileSiteKey)}" data-size="flexible" data-appearance="interaction-only"></div>` : ""}
  <div class="hp" aria-hidden="true"><label for="${id("cw")}">Company website</label><input id="${id("cw")}" name="company_website" type="text" tabindex="-1" autocomplete="off"></div>
  <input type="hidden" name="source_page" value="">
  <input type="hidden" name="utm_source" value="">
  <input type="hidden" name="utm_medium" value="">
  <input type="hidden" name="utm_campaign" value="">
  <button class="btn btn-gold btn-block btn-shine" type="submit">Get Shortlisted</button>
  <p class="form-status" role="status" aria-live="polite"></p>
  <p class="form-legal">By submitting, you agree to our <a href="/privacy-policy/">Privacy Policy</a> and <a href="/terms/">Terms</a>. No spam, ever.</p>
  <p class="form-alt">Prefer chatting? ${waButton({ from: "form", label: "WhatsApp us", cls: "wa-link" })}</p>
  <p class="form-alt"><a class="ref-tag" href="/refer/">Refer friends &amp; earn ${REFERRAL_PERCENT}%</a></p>
</form>`;
}

/** Pricing cards (home + /pricing/). Buttons pre-select the plan in the nearest form. */
export function pricingCards({ formPath = "", from = "pricing" } = {}) {
  return `<div class="plans">${PLANS.map((p) => `
  <article class="plan${p.featured ? " plan-featured" : ""}">
    <div class="plan-top">
      <span class="plan-tag">${esc(p.tag)}</span>
      <h3>${esc(p.name)}</h3>
      <p class="plan-price"><b>${inr(p.price)}</b>${p.term ? `<small>${esc(p.term)}</small>` : ""}</p>
      <p class="plan-pitch">${esc(p.pitch)}</p>
    </div>
    <ul class="plan-list">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
    <div class="plan-ctas">
      <a class="btn ${p.featured ? "btn-gold btn-shine" : "btn-dark"} btn-block" href="${formPath ? `${formPath}?plan=${p.id}#get-started` : "#get-started"}" data-plan="${p.id}">Choose ${esc(p.name)}</a>
      ${waButton({ from, plan: p.id, label: "Ask on WhatsApp", cls: "wa-link" })}
      <a class="plan-more" href="${p.url}">What’s in ${esc(p.name)}</a>
    </div>
  </article>`).join("")}
</div>
<p class="plans-note">Fill the form and we’ll confirm your plan on WhatsApp within 24 hours, before you pay. Results depend on your experience, skills and the job market, so no honest service can guarantee a job.</p>`;
}

export function ctaBand({ title = "Ready to get shortlisted?", text = "Upload your resume and pick a plan. We fix your Naukri profile — or run your whole job search for you." } = {}) {
  return `<section class="cta-band"><div class="wrap cta-inner">
  <div><h2>${esc(title)}</h2><p>${esc(text)}</p></div>
  <div class="cta-btns">
    <a class="btn btn-gold btn-lg btn-shine" href="/contact/">Get Shortlisted</a>
    ${waButton({ from: "cta-band", label: "WhatsApp us", cls: "btn btn-wa btn-lg" })}
  </div>
</div></section>`;
}

/* ---------------- Page shell ---------------- */


export function render(page) {
  const {
    path, title, description, body, schema = [], noindex = false, ogType = "website",
    published, modified, keywords,
  } = page;
  const canonical = abs(path);
  const graph = { "@context": "https://schema.org", "@graph": [orgSchema(), websiteSchema(), ...schema] };
  const suffixed = `${title} | ${SITE.name}`;
  const fullTitle = title.includes(SITE.name) || suffixed.length > 60 ? title : suffixed; // Google shows ~60 chars

  // On the home page the CTA scrolls to the form; elsewhere it opens /contact/.
  const ctaHref = path === "/" ? "#get-started" : "/contact/";
  const showStickyCta = !noindex && path !== "/contact/";

  const navLinks = NAV.map(
    (l) => `<li><a href="${l.href}"${l.href === path ? ' aria-current="page"' : ""}>${esc(l.label)}</a></li>`
  ).join("");

  const social = Object.entries(SITE.social).filter(([, v]) => v)
    .map(([k, v]) => `<a href="${esc(v)}" rel="me noopener" target="_blank">${k[0].toUpperCase() + k.slice(1)}</a>`).join(" · ");

  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>document.documentElement.classList.add("js")</script>
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ""}
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en-IN" href="${canonical}">
<link rel="alternate" hreflang="x-default" href="${canonical}">
<meta name="theme-color" content="#FFFFFF">
<meta name="author" content="${esc(SITE.name)}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(SITE.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="GetShortlisted — Naukri profile and resume optimization">
${published ? `<meta property="article:published_time" content="${published}">\n<meta property="article:modified_time" content="${modified || published}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(SITE.ogImage)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="apple-mobile-web-app-title" content="${esc(SITE.name)}">
<meta name="application-name" content="${esc(SITE.name)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"></noscript>
<link rel="stylesheet" href="/css/styles.css?v=${globalThis.ASSET_VER || SITE.updated}">
<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>
<script src="/js/main.js?v=${globalThis.ASSET_VER || SITE.updated}" defer></script>
${SITE.ga4Id ? `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${esc(SITE.ga4Id)}",{anonymize_ip:true});
addEventListener("load",function(){setTimeout(function(){var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id=${esc(SITE.ga4Id)}";document.head.appendChild(s)},1200)});</script>` : ""}
${SITE.turnstileSiteKey && /data-lead-form/.test(body) ? `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>` : ""}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${esc(SITE.name)} home">${logoMark()}${WORDMARK}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr">Menu</span><span class="bars" aria-hidden="true"></span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${navLinks}</ul>
      <a class="btn btn-gold btn-sm btn-shine" href="${ctaHref}">Get Shortlisted</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <a class="brand brand-light" href="/" aria-label="${esc(SITE.name)} home">${logoMark()}${WORDMARK}</a>
      <p>Naukri profile optimization, ATS resume writing and done-for-you job applications for job seekers across India — so recruiters find you, and call you.</p>
      <a class="btn btn-gold btn-sm" href="/contact/">Get my profile optimized</a>
    </div>
    <div>
      <h3>Services</h3>
      <ul>
        <li><a href="/pricing/">Plans & pricing</a></li>
        <li><a href="/naukri-profile-optimization/">Naukri Profile Optimization</a></li>
        <li><a href="/naukri-job-application-service/">We Apply to Jobs For You</a></li>
        <li><a href="/resume-optimization/">ATS Resume Writing</a></li>
        <li><a href="/faq/">FAQ</a></li>
      </ul>
    </div>
    <div>
      <h3>Free guides</h3>
      <ul>
        <li><a href="/blog/how-to-get-shortlisted-on-naukri/">How to get shortlisted on Naukri</a></li>
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
        <li><a href="/refer/">Refer &amp; Earn ${REFERRAL_PERCENT}%</a></li>
        <li><a href="/blog/">All guides</a></li>
        <li><a href="/privacy-policy/">Privacy Policy</a></li>
        <li><a href="/terms/">Terms of Service</a></li>
      </ul>
      <p class="footer-mail"><a href="mailto:${SITE.email}">${SITE.email}</a></p>
      ${social ? `<p class="footer-social">${social}</p>` : ""}
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${new Date().getFullYear()} ${esc(SITE.name)}. All rights reserved.</p>
    <p class="disclaimer">GetShortlisted is an independent career service. We are not affiliated with, endorsed by, or partnered with Naukri.com or Info Edge (India) Ltd. “Naukri” is a trademark of its respective owner.</p>
  </div>
</footer>
${showStickyCta ? `<div class="sticky-cta" data-sticky-cta>
  <a class="sticky-wa" href="${waHref("sticky")}" rel="nofollow noopener" target="_blank" aria-label="Chat with us on WhatsApp">${WA_ICON}</a>
  <a class="btn btn-gold btn-shine sticky-main" href="${ctaHref}">Get Shortlisted</a>
</div>` : ""}
${noindex ? "" : `<a class="wa-float" href="${waHref("float")}" rel="nofollow noopener" target="_blank" aria-label="Chat with us on WhatsApp">${WA_ICON}<span>WhatsApp us</span></a>`}
</body>
</html>
`;
}

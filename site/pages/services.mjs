import { leadForm, faqList, faqSchema, ctaBand, serviceSchema, breadcrumbSchema, breadcrumbs, esc, pricingCards, waButton } from "../layout.mjs";
import { PLANS, inr, SITE } from "../config.mjs";

const [MAKEOVER, DFY] = PLANS;

// One template for the service pages: hero (with price) → what's included + form → FAQ → CTA.
function servicePage({ path, name, title, description, keywords, h1, lead, serviceType, schemaDesc, included, formHeading, faqs, cta, plan }) {
  const crumbs = [{ name: "Home", path: "/" }, { name, path }];
  const body = `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1>${esc(h1)}</h1>
    <p class="lead">${esc(lead)}</p>
    <div class="price-chip"><span>${esc(plan.name)}</span><b>${inr(plan.price)}</b><small>Free profile check first</small></div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <span class="kicker">What you get</span>
      <h2 class="mt-0">Everything recruiters look for</h2>
      <div class="included">
        ${included.map(([t, d], i) => `<div class="inc inc-${i % 4}"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}
      </div>
      <p class="side-wa">Questions first? ${waButton({ from: path, plan: plan.id, label: "Ask on WhatsApp", cls: "wa-link" })} &nbsp;·&nbsp; <a href="/pricing/">Compare plans</a></p>
    </div>
    <div id="get-started">
      ${leadForm({ heading: formHeading, sub: "Free profile check · reply on WhatsApp within 24 hours.", compact: true, plan: plan.id })}
    </div>
  </div>
</section>

<section class="section section-sand">
  <div class="wrap">
    <div class="section-head center"><span class="kicker">FAQ</span><h2>Common questions</h2></div>
    ${faqList(faqs)}
  </div>
</section>

${ctaBand(cta)}`;

  return {
    path, title, description, keywords, priority: 0.9, body,
    schema: [
      serviceSchema({ name, path, serviceType, description: schemaDesc, plan }),
      breadcrumbSchema(crumbs),
      faqSchema(faqs),
    ],
  };
}

const LOGIN_FAQ = {
  q: "Do you need my Naukri login?",
  a: "<p>Yes, to update your profile for you — Naukri profiles have no shareable link, and recruiter-visible fields can only be edited from inside the account. The form asks only for your Naukri login email or mobile. <b>We never ask for your password on this website</b>; we ask for it privately on WhatsApp after you choose a plan. Change it once we’re done if you like.</p>",
};

const naukri = servicePage({
  path: "/naukri-profile-optimization/",
  name: "Naukri Profile Optimization",
  plan: MAKEOVER,
  title: "Naukri Profile Optimization Service – Get Recruiter Calls",
  description:
    `Naukri profile optimization by experts: keyword-rich resume headline, key skills, summary and ATS resume so recruiters find you and call. ${inr(MAKEOVER.price)}, free check first.`,
  keywords: "naukri profile optimization, naukri profile optimization service, naukri profile update, how to improve naukri profile, naukri profile writing service, naukri profile optimization price, resdex",
  h1: "Naukri Profile Optimization",
  lead: "Recruiters search Naukri with keywords. We rewrite your profile and resume with the right ones — and update your Naukri profile for you — so you show up in their searches and get the call.",
  serviceType: "Naukri profile optimization",
  schemaDesc: "Rewriting a Naukri profile (resume headline, key skills, profile summary, employment, projects, desired career profile) around recruiter search keywords, plus an ATS-friendly resume.",
  included: [
    ["Keyword research", "Words recruiters type for your role and city"],
    ["Resume headline", "The first line recruiters see in search"],
    ["Key skills", "The skills recruiters filter by"],
    ["Profile summary", "Short, clear, with your results"],
    ["Titles & preferences", "Role, city, salary and notice set right"],
    ["ATS-friendly resume", "PDF + Word, matching your profile"],
  ],
  formHeading: "Optimize my Naukri profile",
  faqs: [
    { q: "What do you change in my Naukri profile?", a: "<p>Resume headline, key skills, profile summary, employment details, projects, IT skills and desired career profile — plus a matching ATS-friendly resume.</p>" },
    LOGIN_FAQ,
    { q: `How much does it cost?`, a: `<p>${inr(MAKEOVER.price)} for the ${MAKEOVER.name}. Want us to apply to jobs for you as well? The <a href="${DFY.url}">${DFY.name}</a> is ${inr(DFY.price)}. You pay only after the free profile check.</p>` },
    { q: "Will this guarantee a job?", a: "<p>No honest service can. We remove the reasons recruiters aren’t finding you. Interviews and offers still depend on your skills and the market.</p>" },
  ],
  cta: { title: "Let recruiters find your profile", text: "Upload your resume — we’ll show you what to fix, free." },
});

const apply = servicePage({
  path: "/naukri-job-application-service/",
  name: "Naukri Job Application Service",
  plan: DFY,
  title: "Naukri Job Application Service – We Apply For You",
  description:
    `Done-for-you job search in India: we optimize your Naukri profile & resume, manage it and apply to matching jobs on your behalf. You just take recruiter calls. ${inr(DFY.price)}.`,
  keywords: "job application service india, apply jobs on my behalf, naukri profile management service, done for you job search, job search assistance service india, someone to apply for jobs for me, naukri job apply service",
  h1: "We apply to jobs for you",
  lead: "Busy, on notice, or tired of applying? We take over your Naukri job search — profile, resume and applications — so you only spend time on recruiter calls and interviews.",
  serviceType: "Job application service",
  schemaDesc: "Done-for-you Naukri job search: profile and ATS resume optimization, ongoing Naukri profile management and job applications on the candidate’s behalf.",
  included: [
    ["Full Profile Makeover", "Naukri profile + ATS resume, rewritten"],
    ["Profile management", "Kept active, fresh and visible to recruiters"],
    ["Applications for you", "Jobs that match your role, experience & city"],
    ["Role-tuned resume", "Adjusted for the jobs we apply to"],
    ["Your preferences first", "Role, city & salary agreed with you"],
    ["You take the calls", "Interviews and decisions stay with you"],
  ],
  formHeading: "Apply to jobs for me",
  faqs: [
    { q: "What exactly do you do on my behalf?", a: "<p>We optimize your Naukri profile and resume, keep the profile active and updated, and apply to jobs that match the role, experience, salary and city you agree with us. You attend the recruiter calls and interviews.</p>" },
    LOGIN_FAQ,
    { q: "Which jobs will you apply to?", a: "<p>Only jobs that match what we agree with you during the free profile check — target role, city, salary range and notice period. Nothing is applied that you wouldn’t want.</p>" },
    { q: "How much does it cost?", a: `<p>${inr(DFY.price)} for the ${DFY.name}. If you only want your profile and resume fixed, the <a href="${MAKEOVER.url}">${MAKEOVER.name}</a> is ${inr(MAKEOVER.price)}.</p>` },
    { q: "Do you guarantee a job?", a: "<p>No — and be careful of anyone who does. We maximise how often recruiters see and contact you. Offers depend on your interviews, skills and the market.</p>" },
  ],
  cta: { title: "Stop applying. Start getting calls.", text: "Upload your resume — free profile check, then we take it from there." },
});

const resume = servicePage({
  path: "/resume-optimization/",
  name: "Resume Optimization",
  plan: MAKEOVER,
  title: "ATS-Friendly Resume Writing Service in India",
  description:
    `ATS-friendly resume writing for Indian job seekers: role keywords, achievement-focused points and a clean format that gets you shortlisted. Included in ${MAKEOVER.name} (${inr(MAKEOVER.price)}).`,
  keywords: "resume writing service india, ATS friendly resume, resume optimization, ATS resume format, resume for naukri, professional resume writer india, cv writing service",
  h1: "ATS-Friendly Resume Writing",
  lead: "Software reads your resume before a recruiter does. We make it clean, ATS-friendly and full of the right keywords — and match it to your Naukri profile — so you get shortlisted.",
  serviceType: "ATS-friendly resume writing",
  schemaDesc: "ATS-friendly, keyword-optimized resume writing with achievement-focused bullet points for job seekers in India.",
  included: [
    ["ATS-friendly format", "Clean layout software can read"],
    ["Role keywords", "Taken from real job descriptions"],
    ["Strong summary", "Why you fit — in 3 lines"],
    ["Achievement points", "Results with numbers, not duties"],
    ["Gap & switch handling", "Honest, positive framing"],
    ["Matches your Naukri", "One consistent story everywhere"],
  ],
  formHeading: "Optimize my resume",
  faqs: [
    { q: "What is an ATS-friendly resume?", a: "<p>A resume that hiring software can read correctly: simple single-column layout, standard headings, no tables or images, and the right keywords for the role.</p>" },
    { q: "Do you write from scratch?", a: "<p>We rewrite as much as needed — usually the summary, experience points and format. Your facts stay 100% true.</p>" },
    { q: "How long should my resume be?", a: "<p>One page for freshers and up to about 5 years of experience; two pages for more experienced professionals.</p>" },
    { q: "How much does it cost?", a: `<p>Resume writing is part of the ${MAKEOVER.name} (${inr(MAKEOVER.price)}), together with your Naukri profile — because recruiters check both.</p>` },
  ],
  cta: { title: "Get a resume that gets shortlisted", text: "Upload your current resume — we’ll show you what to fix, free." },
});

/* ---------------- Pricing ---------------- */

const PRICING_FAQS = [
  { q: "Is the profile check really free?", a: "<p>Yes. We review your resume and Naukri profile, tell you what’s stopping recruiters from calling and recommend a plan. You pay only if you decide to go ahead.</p>" },
  { q: `What’s the difference between ${MAKEOVER.name} and ${DFY.name}?`, a: `<p>${MAKEOVER.name} (${inr(MAKEOVER.price)}) fixes your Naukri profile and resume, and you continue applying yourself. ${DFY.name} (${inr(DFY.price)}) includes all of that, and we also manage your Naukri profile and apply to matching jobs on your behalf.</p>` },
  { q: "How do I pay?", a: "<p>After the free profile check we share the payment details on WhatsApp. Work starts once payment is received.</p>" },
  LOGIN_FAQ,
  { q: "Do you guarantee a job or a number of calls?", a: "<p>No. Hiring depends on employers, the market and your interviews. We make sure your profile and resume are not the reason recruiters skip you — many candidates see more calls within about a week.</p>" },
];
const pricingCrumbs = [{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing/" }];
const pricing = {
  path: "/pricing/",
  title: "Naukri Profile Optimization Price & Plans in India",
  description: `Naukri profile + ATS resume optimization: ${inr(MAKEOVER.price)}. Done-for-you job search where we apply for you: ${inr(DFY.price)}. Free profile check before you pay.`,
  keywords: "naukri profile optimization price, naukri profile optimization cost, resume writing service price india, job application service price, naukri paid services",
  priority: 0.9,
  schema: [
    breadcrumbSchema(pricingCrumbs),
    { "@type": "WebPage", name: "Plans & pricing", url: `${SITE.url}/pricing/`, about: { "@id": `${SITE.url}/#organization` } },
    faqSchema(PRICING_FAQS),
  ],
  body: `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs(pricingCrumbs)}
    <span class="eyebrow">Plans & pricing</span>
    <h1>Simple pricing. Free profile check first.</h1>
    <p class="lead">Fix your Naukri profile and resume once — or hand over your whole job search to us.</p>
  </div>
</section>
<section class="section section-sand">
  <div class="wrap">${pricingCards({ formPath: "/contact/", from: "pricing-page" })}</div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head center"><span class="kicker">FAQ</span><h2>Pricing questions</h2></div>
    ${faqList(PRICING_FAQS)}
  </div>
</section>
${ctaBand({ title: "Not sure which plan fits you?", text: "Start with the free profile check — we’ll recommend the right plan honestly." })}`,
};

export default [naukri, apply, resume, pricing];

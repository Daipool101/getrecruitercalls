import { leadForm, faqList, faqSchema, ctaBand, serviceSchema, breadcrumbSchema, breadcrumbs, esc } from "../layout.mjs";

// One template for both service pages: hero → what's included + form → FAQ → CTA.
function servicePage({ path, name, title, description, keywords, h1, lead, serviceType, schemaDesc, included, formHeading, faqs, cta }) {
  const crumbs = [{ name: "Home", path: "/" }, { name, path }];
  const body = `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1>${esc(h1)}</h1>
    <p class="lead">${esc(lead)}</p>
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
    </div>
    <div id="get-started">
      ${leadForm({ heading: formHeading, sub: "We’ll reply on WhatsApp / email within 24 hours.", compact: true })}
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
      serviceSchema({ name, path, serviceType, description: schemaDesc }),
      breadcrumbSchema(crumbs),
      faqSchema(faqs),
    ],
  };
}

const naukri = servicePage({
  path: "/naukri-profile-optimization/",
  name: "Naukri Profile Optimization",
  title: "Naukri Profile Optimization Service – Get Recruiter Calls",
  description:
    "Naukri profile optimization: keyword-rich resume headline, key skills and profile summary written for recruiter search, so you show up more and get more calls.",
  keywords: "naukri profile optimization, naukri profile optimization service, naukri profile update, how to improve naukri profile, naukri profile writing, resdex",
  h1: "Naukri Profile Optimization",
  lead: "Recruiters search Naukri with keywords. We rewrite your profile with the right ones — so you show up in their searches and get the call.",
  serviceType: "Naukri profile optimization",
  schemaDesc: "Rewriting a Naukri profile (resume headline, key skills, profile summary, employment, projects, desired career profile) around recruiter search keywords to increase profile views and recruiter calls.",
  included: [
    ["Keyword research", "Words recruiters use for your role and city"],
    ["Resume headline", "The first line recruiters see in search"],
    ["Key skills", "The skills recruiters filter by"],
    ["Profile summary", "Short, clear, with your results"],
    ["Job titles & details", "Market titles recruiters actually type"],
    ["Career preferences", "Role, city, salary and notice set right"],
  ],
  formHeading: "Optimize my Naukri profile",
  faqs: [
    { q: "What do you change in my Naukri profile?", a: "<p>Resume headline, key skills, profile summary, employment details, projects, IT skills and desired career profile. You get ready-to-paste text for each part.</p>" },
    { q: "Do you need my Naukri login?", a: "<p>No. We work from your profile link and resume. You update the profile yourself in about 20–30 minutes with our guide.</p>" },
    { q: "Will this guarantee a job?", a: "<p>No honest service can. We remove the reasons recruiters aren’t finding you. Interviews and offers still depend on your skills and the market.</p>" },
  ],
  cta: { title: "Let recruiters find your profile", text: "Share your Naukri link — we’ll show you what to fix." },
});

const resume = servicePage({
  path: "/resume-optimization/",
  name: "Resume Optimization",
  title: "ATS-Friendly Resume Optimization Service in India",
  description:
    "ATS-friendly resume writing for Indian job seekers: role-specific keywords, achievement-focused bullets and a clean format that gets you shortlisted on Naukri.",
  keywords: "resume optimization, ATS friendly resume, resume writing service India, ATS resume, resume for naukri, professional resume writer",
  h1: "Resume Optimization",
  lead: "Software reads your resume before a recruiter does. We make it clean, ATS-friendly and full of the right keywords — so you get shortlisted.",
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
  ],
  cta: { title: "Get a resume that gets shortlisted", text: "Share your resume link — we’ll make it recruiter-ready." },
});

export default [naukri, resume];

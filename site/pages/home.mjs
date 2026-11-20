import { leadForm, faqList, faqSchema, serviceSchema } from "../layout.mjs";
import { ICON } from "../icons.mjs";
import { SITE } from "../config.mjs";

// Full list is reused on /faq/. Home shows only the first 4.
export const HOME_FAQS = [
  {
    q: "Why am I not getting calls from Naukri?",
    a: "<p>Usually it’s not your experience — recruiters just can’t find you. They search Naukri with keywords, job titles, location and notice period. If your headline, key skills and summary don’t use those words, or your profile isn’t updated, you don’t show up. We fix exactly that.</p>",
  },
  {
    q: "How soon will I start getting calls?",
    a: "<p>Many candidates see more profile views and recruiter calls within about a week. It depends on your role, experience, city and the job market, so we can’t guarantee a job — but we make sure your profile isn’t holding you back.</p>",
  },
  {
    q: "Do I need to share my Naukri password?",
    a: "<p>No. You only share your profile link or resume. We send you the new content and show you where to paste it.</p>",
  },
  {
    q: "Is this for freshers too?",
    a: "<p>Yes — freshers, experienced professionals, people on notice period, after a layoff or switching careers, in IT and non-IT roles across India.</p>",
  },
  {
    q: "What is Naukri profile optimization?",
    a: "<p>Rewriting your Naukri resume headline, key skills, profile summary, employment details and career preferences around the keywords recruiters search for, so your profile ranks higher and gets more calls.</p>",
  },
  {
    q: "Do you also make my resume ATS-friendly?",
    a: "<p>Yes. We rewrite your resume in a clean, ATS-friendly format with the right keywords and achievement-based points, matching your Naukri profile.</p>",
  },
  {
    q: "Is GetShortlisted connected to Naukri.com?",
    a: "<p>No. We are an independent career service, not affiliated with Naukri.com or Info Edge (India) Ltd. No fake experience, no tricks — just your real profile presented the right way.</p>",
  },
];
const SHOWN = HOME_FAQS.slice(0, 4);

const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">Naukri profile & resume optimization</span>
      <h1>Get shortlisted. Get recruiter calls — <span class="hl">in about a week.</span></h1>
      <p class="lead">We fix your Naukri profile and resume with the keywords recruiters search for. You get found. Your phone rings.</p>
      <div class="hero-ctas">
        <a class="btn btn-gold btn-lg btn-shine btn-pulse" href="#get-started">Get Shortlisted <span class="arrow" aria-hidden="true">→</span></a>
        <a class="btn btn-outline btn-lg" href="#how-it-works">How it works</a>
      </div>
      <ul class="pills">
        <li>No password needed</li><li>Freshers & experienced</li><li>All of India</li>
      </ul>
    </div>

    <div class="hero-visual" aria-hidden="true">
      <div class="pcard pc-forest">
        <span class="pc-icon ring">${ICON.phone}</span>
        <div><b>Incoming call</b><small>HR Recruiter · Hiring now</small></div>
      </div>
      <div class="pcard pc-gold">
        <div><b>Profile views</b><small>Going up this week</small></div>
        <span class="bars-mini"><i></i><i></i><i></i><i></i><i></i></span>
      </div>
      <div class="pcard pc-clay">
        <div><b>Resume headline</b><small>Optimized for recruiter search</small></div>
        <span class="pc-check">✓</span>
      </div>
      <div class="pcard pc-sand">
        <div><b>Key skills</b><small>Matched to your target role</small></div>
        <span class="pc-check dark">✓</span>
      </div>
    </div>
  </div>
</section>

<section class="section" id="how-it-works">
  <div class="wrap">
    <div class="section-head center">
      <span class="kicker">How it works</span>
      <h2>Three simple steps</h2>
    </div>
    <ol class="steps steps-3">
      <li><span class="step-icon">${ICON.doc}</span><h3>Share your profile</h3><p>Send your Naukri link or resume using the short form.</p></li>
      <li><span class="step-icon">${ICON.key}</span><h3>We optimize it</h3><p>New headline, keywords, summary and an ATS-friendly resume.</p></li>
      <li><span class="step-icon">${ICON.phone}</span><h3>Recruiters call you</h3><p>Your profile shows up in searches — and the calls start.</p></li>
    </ol>
  </div>
</section>

<section class="section section-sand" id="services">
  <div class="wrap">
    <div class="section-head center">
      <span class="kicker">Our services</span>
      <h2>Get found. Get shortlisted.</h2>
    </div>
    <div class="grid grid-2">
      <a class="svc svc-forest" href="/naukri-profile-optimization/">
        <h3>Naukri Profile Optimization</h3>
        <ul>
          <li>Search-ready resume headline</li>
          <li>Key skills recruiters filter by</li>
          <li>Strong profile summary</li>
        </ul>
        <span class="more">Learn more →</span>
      </a>
      <a class="svc svc-gold" href="/resume-optimization/">
        <h3>Resume Optimization</h3>
        <ul>
          <li>Clean ATS-friendly format</li>
          <li>Right keywords for your role</li>
          <li>Results, not just duties</li>
        </ul>
        <span class="more">Learn more →</span>
      </a>
    </div>
  </div>
</section>

<section class="section section-forest" id="get-started">
  <div class="wrap split split-center">
    <div class="form-intro">
      <span class="kicker kicker-gold">Get started</span>
      <h2>Share your profile. We’ll do the rest.</h2>
      <p>Fill the form in under a minute. We’ll reply on WhatsApp or email within 24 hours.</p>
      <ul class="ticks">
        <li>A real person reviews your profile</li>
        <li>Honest advice — no fake experience</li>
        <li>Explained in English or Hindi</li>
      </ul>
    </div>
    ${leadForm({ heading: "Get Shortlisted", sub: "Share your Naukri link or resume.", compact: true })}
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap">
    <div class="section-head center">
      <span class="kicker">FAQ</span>
      <h2>Common questions</h2>
    </div>
    ${faqList(SHOWN)}
    <p class="center" style="margin-top:24px"><a href="/faq/">More questions →</a></p>
  </div>
</section>
`;

export default {
  path: "/",
  title: "Naukri Profile Optimization & Resume Service | GetShortlisted",
  description:
    "Not getting calls from Naukri? We optimize your Naukri profile and resume with recruiter keywords, a strong headline and ATS-friendly format so recruiters call you.",
  keywords:
    "naukri profile optimization, naukri profile optimization service, resume optimization, not getting calls from naukri, how to get recruiter calls, naukri resume headline, ATS friendly resume, resume writing service India",
  priority: 1.0,
  changefreq: "weekly",
  schema: [
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/#webpage`,
      url: SITE.url + "/",
      name: "Naukri Profile Optimization & Resume Service",
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en-IN",
      dateModified: SITE.updated,
    },
    serviceSchema({
      name: "Naukri Profile Optimization",
      path: "/naukri-profile-optimization/",
      serviceType: "Naukri profile optimization",
      description: "Rewriting Naukri resume headline, key skills, profile summary and career details around recruiter search keywords to get more recruiter calls.",
    }),
    serviceSchema({
      name: "Resume Optimization",
      path: "/resume-optimization/",
      serviceType: "ATS-friendly resume writing",
      description: "ATS-friendly, keyword-optimized resume writing for job seekers in India.",
    }),
    faqSchema(SHOWN),
  ],
  body,
};

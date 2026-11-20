import { leadForm, faqList, faqSchema, serviceSchema, pricingCards, waButton } from "../layout.mjs";
import { ICON } from "../icons.mjs";
import { SITE, PLANS, inr } from "../config.mjs";

const [MAKEOVER, DFY] = PLANS;

// Full list is reused on /faq/. Home shows the first 6.
// Questions are written the way people type them into Google / ChatGPT (GEO): short question, direct first sentence.
export const HOME_FAQS = [
  {
    q: "Why am I not getting calls from Naukri?",
    a: "<p>Usually it’s not your experience — recruiters simply can’t find you. Recruiters search Naukri’s database (Resdex) by keywords, job title, location, notice period and how recently the profile was updated. If your resume headline, key skills and summary don’t contain the words they type, your profile never shows up. We fix exactly that.</p>",
  },
  {
    q: "How much does Naukri profile optimization cost?",
    a: `<p>Our <b>${MAKEOVER.name}</b> (Naukri profile + ATS resume) is <b>${inr(MAKEOVER.price)}</b>. Our <b>${DFY.name}</b>, where we also manage your profile and apply to jobs on your behalf, is <b>${inr(DFY.price)}</b>. Every plan starts with a free profile check — you pay only after you choose a plan.</p>`,
  },
  {
    q: "Why do you need my Naukri login?",
    a: "<p>Naukri profiles don’t have a shareable public link, and the fields recruiters see (headline, key skills, summary, preferences) can only be changed from inside your account. On the form we ask only for your Naukri login email or mobile. <b>We never ask for your password on this website</b> — we ask for it privately on WhatsApp after you choose a plan, and we recommend you change it once we’re done.</p>",
  },
  {
    q: "Can you apply to jobs on my behalf?",
    a: `<p>Yes — that’s our <a href="${DFY.url}">${DFY.name}</a>. We optimize your profile and resume, keep your Naukri profile active and apply to jobs that match your role, experience and city. You just attend the recruiter calls and interviews.</p>`,
  },
  {
    q: "How soon will I start getting calls?",
    a: "<p>Many candidates see more profile views and recruiter calls within about a week. It depends on your role, experience, city and the job market, so no one can honestly guarantee a job — but we make sure your profile isn’t what’s holding you back.</p>",
  },
  {
    q: "Is this for freshers too?",
    a: "<p>Yes — freshers, experienced professionals, people serving notice period, after a layoff or a career gap, and career switchers, in IT and non-IT roles across India.</p>",
  },
  {
    q: "What is Naukri profile optimization?",
    a: "<p>Rewriting your Naukri resume headline, key skills, profile summary, employment details, projects and career preferences around the exact keywords recruiters search for, so your profile ranks higher in recruiter searches and you get more calls.</p>",
  },
  {
    q: "Do you also make my resume ATS-friendly?",
    a: "<p>Yes. Both plans include an ATS-friendly resume (PDF + Word) with the right keywords and achievement-based points, matching your Naukri profile.</p>",
  },
  {
    q: "Is GetShortlisted connected to Naukri.com?",
    a: "<p>No. We are an independent career service, not affiliated with Naukri.com or Info Edge (India) Ltd. No fake experience, no tricks — just your real profile presented the way recruiters search.</p>",
  },
];
const SHOWN = HOME_FAQS.slice(0, 6);

const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">Naukri profile & resume experts · All India</span>
      <h1>Get shortlisted. Get recruiter calls — <span class="hl">in about a week.</span></h1>
      <p class="lead">Recruiters search Naukri by keywords. If your profile doesn’t match, they never see you. We rewrite your Naukri profile and resume around what recruiters search — or run your whole job search for you.</p>
      <div class="hero-ctas">
        <a class="btn btn-gold btn-lg btn-shine btn-pulse" href="#get-started">Get my free profile check</a>
        <a class="btn btn-outline btn-lg" href="#plans">See plans · from ${inr(MAKEOVER.price)}</a>
      </div>
      <ul class="pills">
        <li>Free profile check</li><li>Freshers to 15+ yrs</li><li>IT & non-IT</li>
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
        <div><b>Resume headline</b><small>Matches recruiter searches</small></div>
        <span class="pc-check">✓</span>
      </div>
      <div class="pcard pc-sand">
        <div><b>Jobs applied for you</b><small>On the Done-For-You plan</small></div>
        <span class="pc-check dark">✓</span>
      </div>
    </div>
  </div>
</section>

<section class="section section-forest" id="get-started">
  <div class="wrap split split-center">
    <div class="form-intro">
      <span class="kicker kicker-gold">Start here — it’s free</span>
      <h2>Upload your resume. We’ll tell you why recruiters are skipping you.</h2>
      <p>60 seconds to fill. A real person checks your profile the way a recruiter would and messages you on WhatsApp within 24 hours.</p>
      <ul class="ticks">
        <li>Free profile check before you pay anything</li>
        <li>Upload your resume straight from your phone</li>
        <li>Your Naukri password is never typed on this website</li>
        <li>Explained in English or Hindi</li>
      </ul>
    </div>
    ${leadForm({ heading: "Get your free profile check", sub: "Takes 60 seconds. We reply on WhatsApp within 24 hours.", compact: true })}
  </div>
</section>

<section class="section" id="how-it-works">
  <div class="wrap">
    <div class="section-head center">
      <span class="kicker">How it works</span>
      <h2>From ignored to shortlisted in 3 steps</h2>
    </div>
    <ol class="steps steps-3">
      <li><span class="step-icon">${ICON.doc}</span><h3>Share your profile</h3><p>Upload your resume and your Naukri login email. Free profile check in 24 hours.</p></li>
      <li><span class="step-icon">${ICON.key}</span><h3>We fix — or we run it</h3><p>New headline, keywords, summary and ATS resume. On ${DFY.name}, we apply to jobs for you too.</p></li>
      <li><span class="step-icon">${ICON.phone}</span><h3>Recruiters call you</h3><p>Your profile shows up in recruiter searches — you just pick up the phone.</p></li>
    </ol>
  </div>
</section>

<section class="section section-sand" id="plans">
  <div class="wrap">
    <div class="section-head center">
      <span class="kicker">Plans & pricing</span>
      <h2>Two ways to get shortlisted</h2>
      <p>Fix your profile once — or hand over your whole Naukri job search.</p>
    </div>
    ${pricingCards({ from: "home-plans" })}
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap">
    <div class="section-head center">
      <span class="kicker">FAQ</span>
      <h2>Questions job seekers ask us</h2>
    </div>
    ${faqList(SHOWN)}
    <p class="center faq-more"><a href="/faq/">More questions</a> &nbsp;·&nbsp; ${waButton({ from: "home-faq", label: "Ask us on WhatsApp", cls: "wa-link" })}</p>
  </div>
</section>
`;

export default {
  path: "/",
  title: "Naukri Profile Optimization & Resume Writing Service India | GetShortlisted",
  description:
    `Not getting calls from Naukri? We optimize your Naukri profile & ATS resume (${inr(MAKEOVER.price)}) or run your job search and apply for you (${inr(DFY.price)}). Free profile check.`,
  keywords:
    "naukri profile optimization, naukri profile optimization service, not getting calls from naukri, how to get calls from naukri, resume writing service india, ATS friendly resume, naukri resume headline, apply jobs on my behalf, job application service india, how to get shortlisted",
  priority: 1.0,
  changefreq: "weekly",
  schema: [
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/#webpage`,
      url: SITE.url + "/",
      name: "Naukri Profile Optimization & Resume Writing Service in India",
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en-IN",
      dateModified: SITE.updated,
    },
    serviceSchema({
      name: "Naukri Profile Optimization",
      path: "/naukri-profile-optimization/",
      serviceType: "Naukri profile optimization",
      description: "Rewriting Naukri resume headline, key skills, profile summary and career details around recruiter search keywords, plus an ATS-friendly resume.",
      plan: MAKEOVER,
    }),
    serviceSchema({
      name: "Naukri Job Application Service",
      path: "/naukri-job-application-service/",
      serviceType: "Job application service",
      description: "Done-for-you Naukri job search: profile and resume optimization, profile management and job applications on the candidate’s behalf.",
      plan: DFY,
    }),
    faqSchema(SHOWN),
  ],
  body,
};

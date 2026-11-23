import { leadForm, faqList, faqSchema, serviceSchema, pricingCards, waButton } from "../layout.mjs";
import { ICON } from "../icons.mjs";
import { SITE, PLANS, inr, REFERRAL_PERCENT } from "../config.mjs";

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
    a: `<p>Our <b>${MAKEOVER.name}</b> (Naukri profile + ATS resume) is <b>${inr(MAKEOVER.price)}</b>. Our <b>${DFY.name}</b>, where we also manage your profile and apply to relevant jobs for you for 1 month, is <b>${inr(DFY.price)}</b>. We confirm everything with you on WhatsApp before you pay.</p>`,
  },
  {
    q: "Why do you only work on Naukri and not LinkedIn or other job sites?",
    a: "<p>Because Naukri is where Indian recruiters come looking for you. They search Naukri’s candidate database by keywords and call the profiles that match — so a strong Naukri profile brings calls even on days you don’t apply. On most other sites you apply and wait, or build a network for months. We put our effort where the phone actually rings, and we still keep your headline and summary ready to reuse on LinkedIn.</p>",
  },
  {
    q: "Why do you need my Naukri login?",
    a: "<p>Naukri profiles don’t have a shareable public link. On the form we ask only for your Naukri login email or mobile. <b>We never ask for your password on this website</b> — we ask for it privately on WhatsApp after you choose a plan, and we recommend you change it once we’re done.</p>",
  },
  {
    q: "Can you apply to jobs on my behalf?",
    a: `<p>Yes — that’s our <a href="${DFY.url}">${DFY.name}</a>. We optimize your profile and resume, keep your Naukri profile active and, for 1 month, apply to relevant jobs that match your role, experience and city. You just attend the recruiter calls and interviews.</p>`,
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
      <h1>Get shortlisted on Naukri. Get recruiter calls — <span class="hl">in about a week.</span></h1>
      <p class="lead">Recruiters search Naukri by keywords. If your profile doesn’t match, they never see you. We rewrite your Naukri profile and resume around what recruiters search — or run your whole job search for you.</p>
      <div class="hero-ctas">
        <a class="btn btn-gold btn-lg btn-shine btn-pulse" href="#get-started">Get Shortlisted</a>
        <a class="btn btn-outline btn-lg" href="#plans">See plans · from ${inr(MAKEOVER.price)}</a>
      </div>
      <ul class="pills">
        <li>Reply in 24 hours</li><li>Freshers to 15+ yrs</li><li>IT & non-IT</li>
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
      <span class="kicker kicker-gold">Start here — takes 60 seconds</span>
      <h2>Upload your resume. We’ll get recruiters calling.</h2>
      <p>A real person messages you on WhatsApp within 24 hours to confirm your plan and get started.</p>
      <ul class="ticks">
        <li>Plan confirmed on WhatsApp before you pay</li>
        <li>Upload your resume straight from your phone</li>
        <li>Your Naukri password is never typed on this website</li>
        <li>Explained in English or Hindi</li>
      </ul>
    </div>
    ${leadForm({ heading: "Get shortlisted on Naukri", sub: "Takes 60 seconds. We reply on WhatsApp within 24 hours.", compact: true })}
  </div>
</section>

<section class="section" id="how-it-works">
  <div class="wrap">
    <div class="section-head center">
      <span class="kicker">How it works</span>
      <h2>From ignored to shortlisted in 3 steps</h2>
    </div>
    <ol class="steps steps-3">
      <li><span class="step-icon">${ICON.doc}</span><h3>Share your profile</h3><p>Upload your resume, add your Naukri login email and pick a plan.</p></li>
      <li><span class="step-icon">${ICON.key}</span><h3>We fix — or we run it</h3><p>New headline, keywords, summary and ATS resume. On ${DFY.name}, we apply to relevant jobs for you for 1 month.</p></li>
      <li><span class="step-icon">${ICON.phone}</span><h3>Recruiters call you</h3><p>Your profile shows up in recruiter searches — you just pick up the phone.</p></li>
    </ol>
  </div>
</section>

<section class="section why-naukri" id="why-naukri">
  <div class="wrap">
    <div class="section-head center">
      <span class="kicker">Why only Naukri?</span>
      <h2>Other sites can wait. Your Naukri profile can’t.</h2>
      <p>On Naukri, recruiters don’t wait for you to apply — they search the candidate database and call the profiles that match. That’s why we put 100% of our effort where Indian recruiters actually pick up the phone.</p>
    </div>
    <div class="why-grid">
      <div class="why-card"><span class="why-num">1</span><h3>Recruiters call you</h3><p>Recruiters search Naukri by keywords, title, city and notice period — then call. A sharp profile works for you 24×7, even when you’re not applying.</p></div>
      <div class="why-card"><span class="why-num">2</span><h3>Made for every Indian job seeker</h3><p>Freshers to 15+ years, IT and non-IT, metros and tier-2 cities. Most other platforms work best for a narrow slice of roles.</p></div>
      <div class="why-card"><span class="why-num">3</span><h3>Small fixes, fast calls</h3><p>Naukri ranks you on keywords, headline and how fresh your profile is — all fixable in days. Networking-led sites take months of posting.</p></div>
    </div>
    <div class="compare-cards" role="table" aria-label="Where recruiter calls come from">
      <div class="cc cc-win" role="rowgroup">
        <h3 role="row"><span role="columnheader">Naukri</span></h3>
        <p role="row"><b role="rowheader">How recruiters reach you</b><span role="cell">They search and call you directly</span></p>
        <p role="row"><b role="rowheader">Who it works for</b><span role="cell">All roles, freshers to senior, IT & non-IT</span></p>
        <p role="row"><b role="rowheader">What decides visibility</b><span role="cell">Keywords & profile freshness — fixable in days</span></p>
      </div>
      <div class="cc" role="rowgroup">
        <h3 role="row"><span role="columnheader">LinkedIn</span></h3>
        <p role="row"><b role="rowheader">How recruiters reach you</b><span role="cell">Mostly messages, after networking</span></p>
        <p role="row"><b role="rowheader">Who it works for</b><span role="cell">Strongest for corporate & senior roles</span></p>
        <p role="row"><b role="rowheader">What decides visibility</b><span role="cell">Connections, activity & posting — slow</span></p>
      </div>
      <div class="cc" role="rowgroup">
        <h3 role="row"><span role="columnheader">Other job sites</span></h3>
        <p role="row"><b role="rowheader">How recruiters reach you</b><span role="cell">You apply and wait</span></p>
        <p role="row"><b role="rowheader">Who it works for</b><span role="cell">Varies a lot by site and role</span></p>
        <p role="row"><b role="rowheader">What decides visibility</b><span role="cell">How many applications you send</span></p>
      </div>
    </div>
    <p class="why-note">We still make your headline and summary ready to reuse on LinkedIn — but our work goes where the calls come from.</p>
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

<section class="ref-band">
  <div class="wrap ref-band-inner">
    <div>
      <span class="ref-tag ref-tag-lg">Refer &amp; Earn ${REFERRAL_PERCENT}%</span>
      <h2>Know someone not getting calls? Earn ${PLANS.map((p) => inr(Math.round((p.price * REFERRAL_PERCENT) / 100))).join(" – ")} per referral.</h2>
      <p>Get your code in 30 seconds. When your friend buys a plan, you get ${REFERRAL_PERCENT}% on Google Pay.</p>
    </div>
    <a class="btn btn-gold btn-lg btn-shine" href="/refer/">Get my referral code</a>
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
    `Not getting calls from Naukri? We optimize your Naukri profile & ATS resume (${inr(MAKEOVER.price)}) or run your job search and apply for you (${inr(DFY.price)}). Reply on WhatsApp in 24h.`,
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

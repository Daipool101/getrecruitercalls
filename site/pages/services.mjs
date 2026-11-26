import { leadForm, faqList, faqSchema, ctaBand, serviceSchema, breadcrumbSchema, breadcrumbs, esc, pricingCards, waButton } from "../layout.mjs";
import { PLANS, inr, SITE } from "../config.mjs";
import { guideLinks } from "../guides.mjs";

const [MAKEOVER, DFY] = PLANS;

// One template for the service pages: hero (with price) → what's included + form → FAQ → CTA.
function servicePage({ path, name, title, description, keywords, h1, lead, serviceType, schemaDesc, included, formHeading, faqs, cta, plan, extra = "", guides = [] }) {
  const crumbs = [{ name: "Home", path: "/" }, { name, path }];
  const body = `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1>${esc(h1)}</h1>
    <p class="lead">${esc(lead)}</p>
    <div class="price-chip"><span>${esc(plan.name)}</span><b>${inr(plan.price)}</b>${plan.term ? `<span class="term">${esc(plan.term)}</span>` : ""}<small>Reply on WhatsApp in 24h</small></div>
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
      ${leadForm({ heading: formHeading, sub: "Takes 60 seconds · reply on WhatsApp within 24 hours.", compact: true, plan: plan.id })}
    </div>
  </div>
</section>

${extra}
${guides.length ? `<section class="section"><div class="wrap">${guideLinks(guides, { heading: "Helpful guides" })}</div></section>` : ""}
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
  a: "<p>Yes, to to update your profile for you. Naukri profiles have no shareable link. The form asks only for your Naukri login email or mobile. <b>We never ask for your password on this website</b>; we ask for it privately on WhatsApp after you choose a plan. Change it once we’re done if you like.</p>",
};

const naukri = servicePage({
  path: "/naukri-profile-optimization/",
  name: "Naukri Profile Optimization",
  plan: MAKEOVER,
  title: "Naukri Profile Optimization Service | Get Recruiter Calls",
  description:
    `Naukri profile optimization by experts: keyword-rich resume headline, key skills, summary and ATS resume so recruiters find you and call. ${inr(MAKEOVER.price)}.`,
  keywords: "naukri profile optimization, naukri profile optimization service, naukri profile update, how to improve naukri profile, naukri profile writing service, naukri profile optimization price, resdex",
  h1: "Naukri Profile Optimization",
  lead: "Recruiters search Naukri with keywords. We rewrite your profile and resume with the right ones and update your Naukri profile for you, so you show up in their searches and get the call.",
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
    { q: "What do you change in my Naukri profile?", a: "<p>Resume headline, key skills, profile summary, employment details, projects, IT skills and desired career profile, plus a matching ATS-friendly resume.</p>" },
    LOGIN_FAQ,
    { q: `How much does it cost?`, a: `<p>${inr(MAKEOVER.price)} for the ${MAKEOVER.name}. Want us to apply to jobs for you as well? The <a href="${DFY.url}">${DFY.name}</a> is ${inr(DFY.price)}. We confirm everything on WhatsApp before you pay.</p>` },
    { q: "Will this guarantee a job?", a: "<p>No honest service can. We remove the reasons recruiters aren’t finding you. Interviews and offers still depend on your skills and the market.</p>" },
  ],
  cta: { title: "Let recruiters find your profile", text: "Upload your resume and pick a plan. We’ll take it from there." },
  guides: ["/blog/not-getting-calls-from-naukri/", "/blog/naukri-resume-headline-examples/", "/blog/naukri-key-skills/"],
  extra: `
<section class="section">
  <div class="wrap prose-wide">
    <div class="section-head"><span class="kicker">Why profiles get ignored</span><h2>Recruiters can’t call you if they can’t find you</h2></div>
    <div class="two-col">
      <div>
        <p>Every day, recruiters search Naukri’s candidate database with a handful of words: a job title, two or three skills, a city and a notice period. Naukri then ranks thousands of matching profiles. Most recruiters only look at the first page or two.</p>
        <p>If your <b>resume headline, key skills and summary</b> don’t use the words recruiters actually type for your role, your profile drops below people with weaker experience but better wording. That’s why good candidates apply to 100+ jobs and still get no calls.</p>
      </div>
      <div class="mistakes">
        <h3>The 5 most common reasons we see</h3>
        <ol>
          <li>A headline that describes you, not the job recruiters are hiring for</li>
          <li>Key skills that don’t match the role’s search words</li>
          <li>A summary with duties, but no results or numbers</li>
          <li>Wrong or outdated preferences (city, salary, notice period), notice period</li>
          <li>A resume that says something different from the profile</li>
        </ol>
      </div>
    </div>

    <div class="section-head mt-44"><span class="kicker">The difference</span><h2>Same experience. Very different first impression.</h2></div>
    <div class="ba">
      <div class="ba-card ba-before"><span>Before</span><p>“Looking for a good opportunity in a reputed company where I can use my skills.”</p><small>Says nothing a recruiter searches for.</small></div>
      <div class="ba-card ba-after"><span>After</span><p>“Data Analyst | 3 yrs | SQL, Power BI, Python | Sales & Ops Dashboards | Pune | Immediate Joiner”</p><small>Role, experience, skills, city and availability, all in one line.</small></div>
    </div>
    <p class="note-small">An illustrative headline. Every profile we write is built for your real experience, role and city.</p>

    <div class="section-head mt-44"><span class="kicker">How it works</span><h2>You share. We fix. Recruiters call.</h2></div>
    <ol class="ref-steps">
      <li><b>Share your details</b><span>Upload your resume, add your Naukri login email and pick a plan. Takes 60 seconds.</span></li>
      <li><b>We confirm on WhatsApp</b><span>Within 24 hours we confirm your target role, cities and plan, and share payment details.</span></li>
      <li><b>We rewrite and update</b><span>Your headline, key skills, summary, employment details, preferences and resume. Written by a person, not a template.</span></li>
      <li><b>You start getting noticed</b><span>Many candidates see more profile views and recruiter calls within about a week.</span></li>
    </ol>
  </div>
</section>
`,
});

const apply = servicePage({
  path: "/naukri-job-application-service/",
  name: "Naukri Job Application Service",
  plan: DFY,
  title: "Naukri Job Application Service | We Apply For You",
  description:
    `Done-for-you Naukri job search: we fix your profile & resume and apply to relevant jobs for you for 1 month. You just take recruiter calls. ${inr(DFY.price)}.`,
  keywords: "job application service india, apply jobs on my behalf, naukri profile management service, done for you job search, job search assistance service india, someone to apply for jobs for me, naukri job apply service",
  h1: "We apply to jobs for you",
  lead: "Busy, on notice, or tired of applying? We take over your Naukri job search for 1 month (profile, resume and applications), so you only spend time on recruiter calls and interviews.",
  serviceType: "Job application service",
  schemaDesc: "Done-for-you Naukri job search: profile and ATS resume optimization, ongoing Naukri profile management and job applications on the candidate’s behalf.",
  included: [
    ["Full Profile Makeover", "Naukri profile + ATS resume, rewritten"],
    ["Profile management", "Kept active, fresh and visible to recruiters"],
    ["1 month of applications", "Relevant jobs matching your profile"],
    ["Role-tuned resume", "Adjusted for the jobs we apply to"],
    ["Your preferences first", "Role, city & salary agreed with you"],
    ["You take the calls", "Interviews and decisions stay with you"],
  ],
  formHeading: "Apply to jobs for me",
  faqs: [
    { q: "What exactly do you do on my behalf?", a: "<p>We optimize your Naukri profile and resume, keep the profile active and updated, and for 1 month apply to relevant jobs that match the role, experience, salary and city you agree with us. You attend the recruiter calls and interviews.</p>" },
    LOGIN_FAQ,
    { q: "How long do you apply to jobs for me?", a: "<p>For 1 month. During that month we apply to relevant jobs according to your profile, matching your role, experience, city and salary range, while keeping your Naukri profile active.</p>" },
    { q: "Which jobs will you apply to?", a: "<p>Only relevant jobs that match your profile and what we agree with you on WhatsApp before we start: target role, city, salary range and notice period. Nothing is applied that you wouldn’t want.</p>" },
    { q: "How much does it cost?", a: `<p>${inr(DFY.price)} for the ${DFY.name}. If you only want your profile and resume fixed, the <a href="${MAKEOVER.url}">${MAKEOVER.name}</a> is ${inr(MAKEOVER.price)}.</p>` },
    { q: "Do you guarantee a job?", a: "<p>No, and be careful of anyone who does. We maximise how often recruiters see and contact you. Offers depend on your interviews, skills and the market.</p>" },
  ],
  cta: { title: "Stop applying. Start getting calls.", text: "Upload your resume. We’ll take it from there." },
  guides: ["/blog/how-to-get-shortlisted-on-naukri/", "/blog/best-time-to-update-naukri-profile/", "/blog/naukri-paid-services-worth-it/"],
  extra: `
<section class="section">
  <div class="wrap">
    <div class="section-head"><span class="kicker">Who it’s for</span><h2>For people who don’t have hours to apply every day</h2></div>
    <div class="who-grid">
      <div class="who"><b>Working full-time</b><span>You want a switch but can’t spend evenings scrolling job posts.</span></div>
      <div class="who"><b>Serving notice period</b><span>The clock is ticking and you need interviews lined up fast.</span></div>
      <div class="who"><b>After a layoff</b><span>You need momentum and a steady flow of relevant applications.</span></div>
      <div class="who"><b>Tired of zero replies</b><span>You’ve applied to 100+ jobs and want someone to do it properly.</span></div>
    </div>

    <div class="section-head mt-44"><span class="kicker">Your month with us</span><h2>How the Done-For-You month works</h2></div>
    <ol class="ref-steps">
      <li><b>We agree your targets</b><span>On WhatsApp we confirm your target roles, cities, salary range and notice period. We only apply within these.</span></li>
      <li><b>We rebuild your profile first</b><span>Headline, key skills, summary, preferences and an ATS-friendly resume, so every application starts strong.</span></li>
      <li><b>We apply to relevant jobs for 1 month</b><span>A person checks each job against your profile and targets before applying. No mass spraying.</span></li>
      <li><b>You take the calls</b><span>Recruiters contact you directly. You attend the calls and interviews; the decisions stay with you.</span></li>
    </ol>

    <div class="section-head mt-44"><span class="kicker">Compare</span><h2>Done-For-You vs the alternatives</h2></div>
    <div class="table-scroll"><table class="compare">
      <thead><tr><th>Compare</th><th>Doing it yourself</th><th>Auto-apply tools</th><th>GetShortlisted Done-For-You</th></tr></thead>
      <tbody>
        <tr><td>Your time</td><td>Hours every day</td><td>Low</td><td>Low, you just take calls</td></tr>
        <tr><td>Profile & resume</td><td>As it is today</td><td>Usually as it is today</td><td>Rewritten first, by a person</td></tr>
        <tr><td>Which jobs</td><td>Whatever you find</td><td>Chosen by rules / AI</td><td>Checked by a person against your targets</td></tr>
        <tr><td>Best when</td><td>You have time and a strong profile</td><td>Your profile already gets calls</td><td>You’re busy or getting no calls</td></tr>
      </tbody>
    </table></div>

    <div class="mistakes mt-28">
      <h3>What we never do</h3>
      <ol>
        <li>Add fake experience, skills or certificates</li>
        <li>Apply to roles, cities or salaries you didn’t agree to</li>
        <li>Share your details with anyone except the employers you apply to</li>
        <li>Promise a job. Hiring decisions are the employer’s</li>
      </ol>
    </div>
  </div>
</section>
`,
});

const resume = servicePage({
  path: "/resume-optimization/",
  name: "Resume Optimization",
  plan: MAKEOVER,
  title: "ATS Resume Writing Service in India",
  description:
    `ATS-friendly resume writing for Indian job seekers: role keywords, results-focused points and a clean format that gets you shortlisted. From ${inr(MAKEOVER.price)}.`,
  keywords: "resume writing service india, ATS friendly resume, resume optimization, ATS resume format, resume for naukri, professional resume writer india, cv writing service",
  h1: "ATS-Friendly Resume Writing",
  lead: "Software reads your resume before a recruiter does. We make it clean, ATS-friendly and full of the right keywords, and match it to your Naukri profile, so you get shortlisted.",
  serviceType: "ATS-friendly resume writing",
  schemaDesc: "ATS-friendly, keyword-optimized resume writing with achievement-focused bullet points for job seekers in India.",
  included: [
    ["ATS-friendly format", "Clean layout software can read"],
    ["Role keywords", "Taken from real job descriptions"],
    ["Strong summary", "Why you fit, in 3 lines"],
    ["Achievement points", "Results with numbers, not duties"],
    ["Gap & switch handling", "Honest, positive framing"],
    ["Matches your Naukri", "One consistent story everywhere"],
  ],
  formHeading: "Optimize my resume",
  faqs: [
    { q: "What is an ATS-friendly resume?", a: "<p>A resume that hiring software can read correctly: simple single-column layout, standard headings, no tables or images, and the right keywords for the role.</p>" },
    { q: "Do you write from scratch?", a: "<p>We rewrite as much as needed, usually the summary, experience points and format. Your facts stay 100% true.</p>" },
    { q: "How long should my resume be?", a: "<p>One page for freshers and up to about 5 years of experience; two pages for more experienced professionals.</p>" },
    { q: "How much does it cost?", a: `<p>Resume writing is part of the ${MAKEOVER.name} (${inr(MAKEOVER.price)}), together with your Naukri profile, because recruiters check both.</p>` },
  ],
  cta: { title: "Get a resume that gets shortlisted", text: "Upload your current resume. We’ll make it recruiter-ready." },
  guides: ["/blog/ats-friendly-resume-format/", "/blog/naukri-profile-summary-examples/", "/blog/naukri-resume-headline-examples/"],
  extra: `
<section class="section">
  <div class="wrap">
    <div class="section-head"><span class="kicker">Why resumes get rejected</span><h2>Software reads your resume first</h2></div>
    <div class="two-col">
      <div>
        <p>Most companies use an Applicant Tracking System (ATS). It reads your resume, pulls out job titles, skills and dates, and ranks you against the job description, often before a recruiter opens it.</p>
        <p>Fancy two-column templates, tables, icons and text inside images confuse that software. Missing keywords push you down the list. A strong candidate with a hard-to-read resume can be filtered out in seconds.</p>
      </div>
      <div class="mistakes">
        <h3>What gets resumes skipped</h3>
        <ol>
          <li>Layouts software can’t read (tables, columns, graphics)</li>
          <li>Job titles that don’t match the role you’re applying for</li>
          <li>Duties instead of results, with no numbers anywhere</li>
          <li>Missing the skills listed in the job description</li>
          <li>Different story from your Naukri profile</li>
        </ol>
      </div>
    </div>

    <div class="section-head mt-44"><span class="kicker">The difference</span><h2>Duties vs results</h2></div>
    <div class="ba">
      <div class="ba-card ba-before"><span>Before</span><p>“Responsible for handling customer queries and preparing reports.”</p><small>Says what the job was, not what you achieved.</small></div>
      <div class="ba-card ba-after"><span>After</span><p>“Resolved 80+ customer queries a day at 94% CSAT; built 6 weekly reports used by 3 teams.”</p><small>Specific, measurable and easy to scan.</small></div>
    </div>
    <p class="note-small">An illustrative example. Your resume is written from your real experience. Nothing invented.</p>

    <div class="section-head mt-44"><span class="kicker">What you get</span><h2>A resume you can send anywhere</h2></div>
    <ul class="checklist">
      <li><strong>ATS-friendly format</strong>: clean, single-column, standard headings</li>
      <li><strong>PDF + editable Word file</strong>, so you can tailor it for specific jobs</li>
      <li><strong>Role keywords</strong>, taken from real job descriptions for your target role</li>
      <li><strong>Matches your Naukri profile</strong>: one consistent story recruiters trust</li>
      <li><strong>Part of the ${MAKEOVER.name} (${inr(MAKEOVER.price)})</strong>, together with your Naukri profile, because recruiters check both</li>
    </ul>
  </div>
</section>
`,
});

/* ---------------- Pricing ---------------- */

const PRICING_FAQS = [
  { q: "What happens after I fill the form?", a: "<p>We message you on WhatsApp within 24 hours to confirm your plan, target role and city, and share the payment details. Work starts once payment is received.</p>" },
  { q: `What’s the difference between ${MAKEOVER.name} and ${DFY.name}?`, a: `<p>${MAKEOVER.name} (${inr(MAKEOVER.price)}) fixes your Naukri profile and resume, and you continue applying yourself. ${DFY.name} (${inr(DFY.price)}) includes all of that, and we also manage your Naukri profile and apply to relevant jobs for you for 1 month.</p>` },
  { q: "How do I pay?", a: "<p>We share the payment details on WhatsApp after confirming your plan. Work starts once payment is received.</p>" },
  LOGIN_FAQ,
  { q: "Do you guarantee a job or a number of calls?", a: "<p>No. Hiring depends on employers, the market and your interviews. We make sure your profile and resume are not the reason recruiters skip you. Many candidates see more calls within about a week.</p>" },
];
const pricingCrumbs = [{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing/" }];
const pricing = {
  path: "/pricing/",
  title: "Naukri Profile Optimization Price & Plans in India",
  description: `Naukri profile + ATS resume optimization: ${inr(MAKEOVER.price)}. Done-for-you job search where we apply for you: ${inr(DFY.price)}. Reply on WhatsApp within 24 hours.`,
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
    <h1>Naukri Profile Optimization Price & Plans</h1>
    <p class="lead">Fix your Naukri profile and resume once, or hand over your whole job search to us.</p>
  </div>
</section>
<section class="section section-sand">
  <div class="wrap"><div class="section-head center"><span class="kicker">Two plans</span><h2>Choose how much you want us to do</h2></div>${pricingCards({ formPath: "/contact/", from: "pricing-page" })}<p class="note-small price-note">Prices include everything listed. All plans are non-refundable once paid. See our <a href="/refund-policy/">Refund &amp; Cancellation Policy</a>.</p></div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head center"><span class="kicker">Compare your options</span><h2>What you’re really paying for</h2></div>
    <div class="table-scroll"><table class="compare">
      <thead><tr><th>Option</th><th>What changes</th><th>Who does the work</th><th>Best for</th></tr></thead>
      <tbody>
        <tr><td>Do it yourself</td><td>Whatever you fix</td><td>You</td><td>People with time and a clear target role</td></tr>
        <tr><td>Short consultation / review</td><td>Advice and tips</td><td>You make the changes</td><td>A quick second opinion</td></tr>
        <tr><td>Paid visibility boosts</td><td>How often you’re shown</td><td>No change</td><td>Profiles that already get calls</td></tr>
        <tr><td>${MAKEOVER.name} · ${inr(MAKEOVER.price)}</td><td>What recruiters see: headline, skills, summary, preferences + ATS resume</td><td>Us, updated in your account</td><td>Profiles getting few views or calls</td></tr>
        <tr><td>${DFY.name} · ${inr(DFY.price)}</td><td>Everything above + applications to relevant jobs for 1 month</td><td>Us</td><td>Busy professionals, people on notice</td></tr>
      </tbody>
    </table></div>

    <div class="section-head center mt-44"><span class="kicker">After you fill the form</span><h2>What happens next</h2></div>
    <ol class="ref-steps">
      <li><b>We message you on WhatsApp within 24 hours</b><span>We confirm your plan, target role and cities, and answer your questions.</span></li>
      <li><b>You pay</b><span>We share the payment details on WhatsApp. Work starts once payment is received.</span></li>
      <li><b>We do the work</b><span>We rewrite your Naukri profile and resume. On Done-For-You, we also apply to relevant jobs for 1 month.</span></li>
      <li><b>You get noticed</b><span>Many candidates see more profile views and recruiter calls within about a week.</span></li>
    </ol>
    ${guideLinks(["/blog/naukri-paid-services-worth-it/", "/blog/not-getting-calls-from-naukri/", "/blog/how-to-get-shortlisted-on-naukri/"], { heading: "Before you decide" })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head center"><span class="kicker">FAQ</span><h2>Pricing questions</h2></div>
    ${faqList(PRICING_FAQS)}
  </div>
</section>
${ctaBand({ title: "Not sure which plan fits you?", text: "Ask us on WhatsApp. We’ll recommend the right plan honestly." })}`,
};

export default [naukri, apply, resume, pricing];

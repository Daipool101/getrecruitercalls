import { leadForm, faqList, faqSchema, ctaBand, breadcrumbSchema, breadcrumbs, esc, waButton } from "../layout.mjs";
import { HOME_FAQS } from "./home.mjs";
import { SITE, PLANS, inr } from "../config.mjs";

const hero = (crumbs, eyebrow, h1, lead) => `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ""}
    <h1>${esc(h1)}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
  </div>
</section>`;

/* ---------------- About ---------------- */

const aboutCrumbs = [{ name: "Home", path: "/" }, { name: "About", path: "/about/" }];
const about = {
  path: "/about/",
  title: "About GetShortlisted — Naukri Profile & Resume Experts",
  description: `GetShortlisted helps job seekers across India get more recruiter calls by optimizing their Naukri profiles and resumes. Founded by ${SITE.founder}.`,
  priority: 0.6,
  schema: [
    breadcrumbSchema(aboutCrumbs),
    { "@type": "AboutPage", name: "About GetShortlisted", url: `${SITE.url}/about/`, about: { "@id": `${SITE.url}/#organization` } },
  ],
  body: `
${hero(aboutCrumbs, "About us", "We help good candidates get found by recruiters", "GetShortlisted exists for one simple reason: too many capable people in India apply to job after job on Naukri and never get a call — not because they aren’t good enough, but because recruiters can’t find them.")}
<section class="section">
  <div class="wrap split">
    <div class="prose">
      <h2 class="mt-0">Our story</h2>
      <p>${esc(SITE.founder)} started GetShortlisted after seeing the same pattern again and again: skilled professionals and freshers with strong backgrounds, sitting with zero recruiter calls for weeks. The fix was almost never “more experience”. It was a better resume headline, the right key skills, a sharper summary, realistic preferences and a resume that software could actually read.</p>
      <p>After a few focused changes, those same profiles started showing up in recruiter searches — and the calls followed, often within a week. GetShortlisted turns that experience into a simple, personal service for every job seeker.</p>
      <h2>What we believe</h2>
      <ul class="checklist">
        <li><strong>Honesty first.</strong> We never add fake experience, fake skills or anything you can’t defend in an interview.</li>
        <li><strong>Recruiter-search thinking.</strong> We write for how recruiters actually search, filter and shortlist.</li>
        <li><strong>Simple language.</strong> We explain every change clearly — in English or Hindi.</li>
        <li><strong>Your account, your control.</strong> We never ask for passwords on our website — only privately on WhatsApp, and only after you choose a plan.</li>
      </ul>
    </div>
    <div class="card">
      <h3>At a glance</h3>
      <ul class="checklist">
        <li><strong>What:</strong> Naukri profile optimization, ATS resume writing & job applications on your behalf</li>
        <li><strong>Plans:</strong> ${PLANS.map((p) => `${esc(p.name)} ${inr(p.price)}`).join(" · ")}</li>
        <li><strong>Who:</strong> Freshers to senior professionals, IT and non-IT</li>
        <li><strong>Where:</strong> Online, across India</li>
        <li><strong>Founder:</strong> ${esc(SITE.founder)}</li>
        <li><strong>Contact:</strong> <a href="mailto:${SITE.email}">${SITE.email}</a> or WhatsApp</li>
      </ul>
      <a class="btn btn-gold btn-block" href="/contact/">Get my free profile check</a>
    </div>
  </div>
</section>
${ctaBand()}`,
};

/* ---------------- Contact ---------------- */

const contactCrumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }];
const contact = {
  path: "/contact/",
  title: "Contact Us — Get Your Naukri Profile & Resume Optimized",
  description: "Upload your resume and get a free Naukri profile check from GetShortlisted. We reply on WhatsApp within 24 hours. Or chat with us on WhatsApp.",
  priority: 0.8,
  schema: [
    breadcrumbSchema(contactCrumbs),
    { "@type": "ContactPage", name: "Contact GetShortlisted", url: `${SITE.url}/contact/`, about: { "@id": `${SITE.url}/#organization` } },
  ],
  body: `
${hero(contactCrumbs, "Free profile check", "Get your Naukri profile & resume optimized", "Upload your resume in the short form. We’ll review your profile and message you on WhatsApp within 24 hours.")}
<section class="section">
  <div class="wrap contact-grid">
    <div class="prose">
      <h2 class="mt-0">What happens next?</h2>
      <ol>
        <li><strong>Free profile check</strong> — we review your resume and Naukri profile the way a recruiter would.</li>
        <li><strong>We message you on WhatsApp</strong> with what’s holding you back and the plan that fits: ${PLANS.map((p) => `${esc(p.name)} (${inr(p.price)})`).join(" or ")}.</li>
        <li><strong>We optimize</strong> your Naukri profile and resume — and on Done-For-You, apply to jobs for you.</li>
        <li><strong>You start getting recruiter calls</strong> — and we help you stay visible.</li>
      </ol>
      <h2>Prefer WhatsApp or email?</h2>
      <p>${waButton({ from: "contact", label: "Chat with us on WhatsApp" })}</p>
      <p>Or write to <a href="mailto:${SITE.email}">${SITE.email}</a> with your resume attached.</p>
      <h2>Your data is safe</h2>
      <p>We use your details only to provide our service. Your Naukri password is <b>never</b> typed on this website — we ask for it privately on WhatsApp after you choose a plan. We never sell your data. Read our <a href="/privacy-policy/">Privacy Policy</a>.</p>
    </div>
    <div id="get-started">
      ${leadForm({ heading: "Get your free profile check", sub: "Takes 60 seconds. We reply on WhatsApp within 24 hours." })}
    </div>
  </div>
</section>`,
};

/* ---------------- FAQ ---------------- */

const EXTRA_FAQS = [
  {
    q: "What details do I need to share?",
    a: "<p>Your name, WhatsApp number, email, your resume (PDF or Word upload) and/or your Naukri login email or mobile, your experience and the role you are targeting. That’s it — no password on the website.</p>",
  },
  {
    q: "Why can’t I just send my Naukri profile link?",
    a: "<p>Naukri doesn’t give job seekers a public, shareable profile link — recruiters see your profile inside their own Resdex tool. That’s why we work from your resume and, for the update itself, from inside your account.</p>",
  },
  {
    q: "Is it safe to share my Naukri login?",
    a: "<p>We only ask for your password privately on WhatsApp after you choose a plan, use it only to update your profile and apply to jobs you agreed to, and never store it on this website. We recommend changing your password once the work is done.</p>",
  },
  {
    q: "Do you help with LinkedIn too?",
    a: "<p>Our focus is Naukri profiles and resumes. We do make sure your headline and summary can be reused on LinkedIn so your story stays consistent across platforms.</p>",
  },
  {
    q: "Can you help freshers with no experience?",
    a: "<p>Yes. For freshers we build the profile around education, projects, internships, certifications and skills — the things recruiters hiring freshers actually search for.</p>",
  },
  {
    q: "Can you help if I have a career gap?",
    a: "<p>Yes. We present gaps honestly and positively, highlight upskilling or freelance work done during the gap, and focus your profile on what you can do now.</p>",
  },
  {
    q: "Do you write in Hindi?",
    a: "<p>Your profile and resume are written in English (which recruiters search in), but we’re happy to explain everything and talk to you in Hindi.</p>",
  },
];
const ALL_FAQS = [...HOME_FAQS, ...EXTRA_FAQS];
const faqCrumbs = [{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq/" }];
const faq = {
  path: "/faq/",
  title: "FAQ — Naukri Profile Optimization & Resume Writing",
  description: "Answers to common questions about Naukri profile optimization, recruiter calls, ATS-friendly resumes, timelines and how GetShortlisted works.",
  priority: 0.7,
  schema: [breadcrumbSchema(faqCrumbs), faqSchema(ALL_FAQS)],
  body: `
${hero(faqCrumbs, "FAQ", "Frequently asked questions", "Everything you need to know about getting more recruiter calls from Naukri.")}
<section class="section">
  <div class="wrap">${faqList(ALL_FAQS)}</div>
</section>
${ctaBand({ title: "Still have a question?", text: "Send us your details and ask anything — we’ll get back to you within 24 hours." })}`,
};

/* ---------------- Privacy Policy ---------------- */

const privacyCrumbs = [{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy/" }];
const privacy = {
  path: "/privacy-policy/",
  title: "Privacy Policy",
  description: "How GetShortlisted collects, uses, stores and protects your personal information.",
  priority: 0.3,
  changefreq: "yearly",
  schema: [breadcrumbSchema(privacyCrumbs)],
  body: `
${hero(privacyCrumbs, "", "Privacy Policy", `Last updated: 21 November 2026`)}
<section class="section"><div class="wrap prose">
<p>This Privacy Policy explains how ${esc(SITE.name)} (“we”, “us”, “our”), operating the website <a href="${SITE.url}">${SITE.domain}</a>, collects, uses and protects your personal information. We follow the principles of India’s Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000. By using our website or submitting your details, you agree to this policy.</p>

<h2>1. Information we collect</h2>
<p><strong>Information you give us</strong> through our form or by email:</p>
<ul>
  <li>Name, mobile number, email address</li>
  <li>Your resume file (PDF or Word) and the information contained in it</li>
  <li>The email address or mobile number you use to log in to Naukri</li>
  <li>The plan you are interested in</li>
  <li>Experience level, target job role and any message you choose to share</li>
</ul>
<p><strong>Information collected automatically:</strong></p>
<ul>
  <li>The page you submitted the form from and campaign tags (UTM parameters) in the URL</li>
  <li>Your browser user-agent and a one-way hashed (non-reversible) version of your IP address, used only to prevent spam and abuse</li>
  <li>Basic, aggregated technical logs from our hosting provider (Cloudflare) for security and performance</li>
</ul>
<p>Our website does <strong>not</strong> ask for or store your Naukri password, bank details or government ID numbers. If you choose a plan where we update your profile or apply to jobs for you, we ask for your Naukri password privately on WhatsApp, use it only for the work you agreed to, and do not keep it after the work ends. You can change your password at any time.</p>

<h2>2. How we use your information</h2>
<ul>
  <li>To contact you about your request (by phone, WhatsApp or email)</li>
  <li>To review and optimize your Naukri profile and resume</li>
  <li>To provide, improve and secure our service and website</li>
  <li>To comply with legal obligations</li>
</ul>
<p>We will not send you unrelated marketing messages without your consent, and you can ask us to stop contacting you at any time.</p>

<h2>3. Legal basis and consent</h2>
<p>We process your personal data based on the consent you give when you submit the form or contact us, and for legitimate purposes connected with providing the service you asked for. You may withdraw consent at any time by emailing us; this will not affect processing already carried out.</p>

<h2>4. Sharing your information</h2>
<p>We do <strong>not</strong> sell or rent your personal data. We share it only with:</p>
<ul>
  <li><strong>Service providers</strong> who help us run the website and communicate with you (for example, Cloudflare for hosting, database and email delivery, and Google for email), under appropriate confidentiality and security obligations</li>
  <li><strong>Authorities</strong> where required by law</li>
</ul>
<p>We do not share your details with employers or recruiters on your behalf without your explicit permission.</p>

<h2>5. Data storage and security</h2>
<p>Your form submissions and resume files are stored in a secured database hosted by Cloudflare and delivered to our business email. We use HTTPS encryption, access controls and spam protection to keep your data safe. No method of transmission or storage is 100% secure, but we take reasonable steps to protect your information.</p>

<h2>6. Data retention</h2>
<p>We keep your information only as long as needed to provide our service and for a reasonable period afterwards (generally up to 24 months), unless a longer period is required by law. You can ask us to delete your data earlier.</p>

<h2>7. Your rights</h2>
<p>Subject to applicable law, you have the right to:</p>
<ul>
  <li>Access a summary of the personal data we hold about you</li>
  <li>Correct or update inaccurate data</li>
  <li>Request deletion of your data</li>
  <li>Withdraw your consent</li>
  <li>Raise a grievance with us, and with the Data Protection Board of India if unresolved</li>
</ul>
<p>To exercise any right, email <a href="mailto:${SITE.email}">${SITE.email}</a>. We aim to respond within 30 days.</p>

<h2>8. Cookies and analytics</h2>
<p>Our website does not use advertising cookies. We may use privacy-friendly, cookie-less analytics (such as Cloudflare Web Analytics) to understand overall traffic. Your browser’s session storage is used only to remember campaign tags (UTM) during your visit.</p>

<h2>9. Third-party links</h2>
<p>Our website links to third-party websites such as Naukri.com. We are not responsible for their privacy practices; please read their policies.</p>

<h2>10. Children</h2>
<p>Our service is meant for job seekers aged 18 and above. We do not knowingly collect data from children.</p>

<h2>11. Changes to this policy</h2>
<p>We may update this policy from time to time. The “Last updated” date at the top shows when it last changed.</p>

<h2>12. Contact & grievance officer</h2>
<p>For any privacy question or grievance, contact our Grievance Officer:<br>
<strong>${esc(SITE.founder)}</strong>, ${esc(SITE.name)}<br>
Email: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
</div></section>`,
};

/* ---------------- Terms ---------------- */

const termsCrumbs = [{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms/" }];
const terms = {
  path: "/terms/",
  title: "Terms of Service",
  description: "Terms and conditions for using the GetShortlisted website and Naukri profile and resume optimization services.",
  priority: 0.3,
  changefreq: "yearly",
  schema: [breadcrumbSchema(termsCrumbs)],
  body: `
${hero(termsCrumbs, "", "Terms of Service", "Last updated: 21 November 2026")}
<section class="section"><div class="wrap prose">
<p>These Terms of Service (“Terms”) govern your use of <a href="${SITE.url}">${SITE.domain}</a> and the services offered by ${esc(SITE.name)} (“we”, “us”). By using the website or our services, you agree to these Terms.</p>

<h2>1. Our services</h2>
<p>We provide career services including Naukri profile optimization, resume writing and optimization, Naukri profile management and job applications on your behalf, and related guidance (“Services”). Current plans: ${PLANS.map((p) => `<strong>${esc(p.name)}</strong> (${inr(p.price)})`).join(" and ")}. The exact scope, deliverables and timeline for your order will be confirmed with you before work begins.</p>

<h2>2. No guarantee of jobs or calls</h2>
<p>We work to improve how your profile and resume are presented and found by recruiters. However, hiring decisions are made by employers and recruiters, and depend on factors outside our control — including the job market, your experience, skills, location, notice period, salary expectations and interview performance. <strong>We do not guarantee any specific number of recruiter calls, interviews, job offers or salary.</strong> Any timelines mentioned (such as “within a week”) describe typical experience, not a promise.</p>

<h2>3. Independence from Naukri.com</h2>
<p>${esc(SITE.name)} is an independent service. We are not affiliated with, endorsed by, or partnered with Naukri.com or Info Edge (India) Ltd. “Naukri” is a trademark of its respective owner and is used only to describe the platform our Services relate to. You remain the owner of your Naukri account and are responsible for following Naukri’s own terms of use.</p>

<h2>3A. Account access you authorise</h2>
<p>For plans where we update your profile or apply to jobs for you, you authorise us to log in to your Naukri account for that purpose only. You share your password privately (never through our website form), we act only within the role, location and salary preferences agreed with you, and you can withdraw this permission at any time by changing your password. We recommend changing your password once the Services end.</p>

<h2>4. Your responsibilities</h2>
<ul>
  <li>Provide true, accurate and complete information about your education, experience and skills.</li>
  <li>Review all content we provide before using it, and only publish what is true.</li>
  <li>Never enter passwords in our website form. Share account access only in the way described in section 3A.</li>
  <li>Use the website lawfully and do not submit spam, false information or someone else’s details without permission.</li>
</ul>

<h2>5. Honest content only</h2>
<p>We do not create fake experience, fake certificates or misleading claims. We may decline or stop work on any request that requires misrepresentation.</p>

<h2>6. Fees and payments</h2>
<p>Fees are as listed on our <a href="/pricing/">pricing page</a> and confirmed before work starts. The profile check is free. Unless otherwise agreed in writing, work begins after payment is received. Any refund or revision terms will be shared with you at the time of order and form part of these Terms.</p>

<h2>7. Intellectual property</h2>
<p>The website content, design, logo and guides are owned by ${esc(SITE.name)}. Once fully paid, the profile text and resume we create for you are yours to use for your personal job search.</p>

<h2>8. Limitation of liability</h2>
<p>To the maximum extent permitted by law, ${esc(SITE.name)} is not liable for any indirect, incidental or consequential losses, including loss of job opportunities or income. Our total liability for any claim relating to the Services is limited to the amount you paid for those Services.</p>

<h2>9. Privacy</h2>
<p>Your use of our website and Services is also governed by our <a href="/privacy-policy/">Privacy Policy</a>.</p>

<h2>10. Changes</h2>
<p>We may update these Terms from time to time. Continued use of the website after changes means you accept the updated Terms.</p>

<h2>11. Governing law</h2>
<p>These Terms are governed by the laws of India. Any disputes are subject to the jurisdiction of the courts in India.</p>

<h2>12. Contact</h2>
<p>Questions about these Terms? Email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
</div></section>`,
};

/* ---------------- Thank you + 404 ---------------- */

const thankYou = {
  path: "/thank-you/",
  title: "Thank You — We Received Your Details",
  description: "Thank you for contacting GetShortlisted. We will get back to you within 24 hours.",
  noindex: true,
  body: `
<section class="page-hero"><div class="wrap">
  <span class="eyebrow">Request received</span>
  <h1>Thank you! We’ve got your details.</h1>
  <p class="lead">Your free profile check has started. We’ll message you on WhatsApp within 24 hours — keep your phone handy.</p>
  <p>${waButton({ from: "thank-you", label: "Chat on WhatsApp now" })}</p>
</div></section>
<section class="section"><div class="wrap">
  <h2>While you wait</h2>
  <div class="grid grid-2">
    <a class="card post-card" href="/blog/not-getting-calls-from-naukri/"><span class="tag">Naukri guide</span><h3>9 reasons you’re not getting calls from Naukri</h3><span class="more">Read →</span></a>
    <a class="card post-card" href="/blog/naukri-resume-headline-examples/"><span class="tag">Examples</span><h3>30+ Naukri resume headline examples</h3><span class="more">Read →</span></a>
  </div>
</div></section>`,
};

const notFound = {
  path: "/404",
  file: "404.html",
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  noindex: true,
  body: `
<section class="page-hero"><div class="wrap">
  <span class="eyebrow">404</span>
  <h1>This page took a different job.</h1>
  <p class="lead">The page you’re looking for doesn’t exist or has moved.</p>
</div></section>
<section class="section"><div class="wrap">
  <p><a class="btn btn-gold" href="/">Go to homepage</a> &nbsp; <a class="btn btn-dark" href="/contact/">Get my free profile check</a></p>
</div></section>`,
};

export default [about, contact, faq, privacy, terms, thankYou, notFound];

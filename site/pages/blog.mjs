import { leadForm, faqList, faqSchema, ctaBand, articleSchema, breadcrumbSchema, breadcrumbs, esc } from "../layout.mjs";
import { SITE } from "../config.mjs";
import { RELATED, guideLinks } from "../guides.mjs";

const PUBLISHED = "2026-11-19";

function article({ path, title, h1, description, keywords, tag, readMins, intro, tldr, content, faqs = [], published = PUBLISHED, shown = "19 Nov 2026" }) {
  const PUBLISHED_AT = published;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Guides", path: "/blog/" }, { name: h1, path }];
  const body = `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">${esc(tag)}</span>
    <h1>${esc(h1)}</h1>
    <p class="lead">${intro}</p>
    <p class="article-meta">By <a href="/about/" style="color:inherit">the ${esc(SITE.name)} team</a> · Updated <time datetime="${PUBLISHED_AT}">${shown}</time> · ${readMins} min read</p>
  </div>
</section>
<section class="section">
  <div class="wrap article-layout">
    <article class="prose">
      <div class="tldr"><strong>Quick answer</strong>${tldr}</div>
      ${content}
      ${faqs.length ? `<h2>Frequently asked questions</h2>${faqList(faqs)}` : ""}
      ${RELATED[path] ? guideLinks(RELATED[path], { heading: "Related guides", cls: "related" }) : ""}
    </article>
    <aside>
      ${leadForm({ heading: "Want us to do it for you?", sub: "Share your Naukri profile or resume. We’ll reply within 24 hours.", compact: true })}
    </aside>
  </div>
</section>
${ctaBand()}`;
  return {
    path, title, description, keywords, body, ogType: "article", published: PUBLISHED_AT, modified: PUBLISHED_AT, priority: 0.8,
    _card: { tag, h1, description, readMins },
    schema: [
      articleSchema({ title: h1, description, path, published: PUBLISHED_AT, modified: PUBLISHED_AT }),
      breadcrumbSchema(crumbs),
      ...(faqs.length ? [faqSchema(faqs)] : []),
    ],
  };
}

/* ------------------------------------------------------------------ */

const notGettingCalls = article({
  path: "/blog/not-getting-calls-from-naukri/",
  title: "Not Getting Calls from Naukri? 9 Reasons & Fixes (2026)",
  h1: "Not Getting Calls from Naukri? 9 Reasons and How to Fix Each One",
  description:
    "Applied to 100+ jobs on Naukri but no recruiter calls? The 9 most common reasons — wrong keywords, weak headline, inactive profile, bad resume — and how to fix each.",
  keywords: "not getting calls from naukri, no calls from naukri, naukri profile not getting views, how to get calls from recruiters, naukri tips",
  tag: "Naukri guide",
  readMins: 8,
  intro: "If you’ve applied to dozens of jobs and your phone is still silent, the problem usually isn’t your experience. It’s how your profile shows up when recruiters search. Here’s what goes wrong — and how to fix it.",
  tldr: `<p>You’re probably not getting calls because recruiters can’t <em>find</em> you. Recruiters search Naukri’s database (Resdex) with keywords and filters. Fix your <strong>resume headline, key skills, profile summary and job titles</strong> to match your target role, keep your profile <strong>complete and recently updated</strong>, set <strong>realistic salary, location and notice period</strong>, and upload an <strong>ATS-friendly resume</strong>.</p>`,
  content: `
<h2>How recruiters actually find candidates on Naukri</h2>
<p>Applying to jobs is only half of Naukri. The other half — often the bigger half — is recruiters searching for candidates themselves. A recruiter opens Naukri’s recruiter tool (Resdex), types keywords like <code>“react developer” AND “redux”</code>, sets filters for experience, current location, salary and notice period, and sorts the results. They then open the first few profiles and call the ones that look right.</p>
<p>So the real question isn’t “Why don’t companies reply to my applications?” but “Why doesn’t my profile appear — and stand out — in recruiter searches?” These are the nine usual reasons.</p>

<h2>1. Your resume headline is generic</h2>
<p>The resume headline is the first line recruiters see in search results. Headlines like “Looking for a challenging role” or “Fresher seeking job” contain zero searchable keywords.</p>
<p><strong>Fix:</strong> Use the formula <em>Target role | Years | 4–6 core skills | Domain or achievement | Availability | City</em>. See <a href="/blog/naukri-resume-headline-examples/">30+ Naukri resume headline examples</a>.</p>

<h2>2. Your key skills don’t match recruiter searches</h2>
<p>Recruiters filter by skills. If you write “MS Office” but they search for “Advanced Excel”, or you list “Coding” instead of “Java, Spring Boot, Microservices”, you won’t appear.</p>
<p><strong>Fix:</strong> Open 10–15 job descriptions for your target role on Naukri, note the skills that repeat, and add the ones you genuinely have — in the same wording.</p>

<h2>3. Your job titles are internal, not market titles</h2>
<p>Companies use internal titles like “Associate – II” or “Process Specialist”. Recruiters search for market titles like “Customer Support Executive” or “Business Analyst”.</p>
<p><strong>Fix:</strong> Keep your official title honest, but make sure the market title for what you actually do appears in your headline, summary and job description.</p>

<h2>4. Your profile summary is empty or vague</h2>
<p>A summary of “I am a hardworking and dedicated person” tells a recruiter nothing and adds no keywords.</p>
<p><strong>Fix:</strong> Write 4–6 lines covering your role, years of experience, domain, top tools, 2–3 achievements with numbers, and what role you want next.</p>

<h2>5. Your profile isn’t updated or active</h2>
<p>Recruiters frequently filter or sort by recently active profiles, because active candidates are more likely to respond. A profile last touched months ago tends to slip down the results.</p>
<p><strong>Fix:</strong> Make a small genuine update to your profile regularly (for example, refine a project or a skill), log in often, and respond to recruiter messages quickly.</p>

<h2>6. Your profile is incomplete</h2>
<p>Missing sections — employment details, education, projects, IT skills, desired career profile — mean fewer places for keywords and a weaker impression.</p>
<p><strong>Fix:</strong> Fill every relevant section completely and consistently with your resume.</p>

<h2>7. Your salary, location or notice period filters you out</h2>
<p>Recruiters filter by expected salary, preferred location and notice period. An unrealistic expected CTC, a single preferred city, or an outdated notice period can silently remove you from results.</p>
<p><strong>Fix:</strong> Keep expected salary realistic for the market, add all cities you would genuinely work in, and keep your notice period/last working day accurate.</p>

<h2>8. Your resume isn’t ATS-friendly</h2>
<p>Fancy two-column templates, tables, photos and text inside images often break when parsed. Recruiters may see your details scrambled — or not at all.</p>
<p><strong>Fix:</strong> Use a clean, single-column resume with standard headings. Read our <a href="/blog/ats-friendly-resume-format/">ATS-friendly resume format guide</a>.</p>

<h2>9. Your profile and resume tell different stories</h2>
<p>Different titles, dates or skills on your profile and your resume make recruiters hesitate.</p>
<p><strong>Fix:</strong> Align titles, dates, skills and achievements across your Naukri profile, resume and LinkedIn.</p>

<h2>A quick self-check</h2>
<table>
  <thead><tr><th>Check</th><th>Yes / No</th></tr></thead>
  <tbody>
    <tr><td>Headline has my target role, years and 4+ skills?</td><td></td></tr>
    <tr><td>Key skills copied in the same words as real job descriptions?</td><td></td></tr>
    <tr><td>Summary has numbers and achievements?</td><td></td></tr>
    <tr><td>Updated my profile in the last 7 days?</td><td></td></tr>
    <tr><td>Expected salary and locations realistic?</td><td></td></tr>
    <tr><td>Resume is single-column and ATS-friendly?</td><td></td></tr>
  </tbody>
</table>
<p>If you answered “No” to two or more, that is very likely why you aren’t getting calls. You can fix these yourself with this guide — or <a href="/contact/">let us optimize your profile for you</a>.</p>
`,
  faqs: [
    { q: "How many days does it take to get calls after updating a Naukri profile?", a: "<p>Once your profile matches recruiter searches, many candidates notice more profile views and recruiter actions within about a week. It depends on your role, experience, location and current hiring demand.</p>" },
    { q: "Does updating my Naukri profile daily help?", a: "<p>Keeping your profile recently updated and active helps you appear in searches filtered by recent activity. Make small, genuine updates — there’s no need to change things just for the sake of it.</p>" },
    { q: "Should I buy a Naukri paid plan to get calls?", a: "<p>Fix your headline, skills and summary first. Paid visibility multiplies what your profile already has; if your keywords are wrong, more visibility still won’t bring the right calls.</p>" },
  ],
});

/* ------------------------------------------------------------------ */

const profileTips = article({
  path: "/blog/naukri-profile-optimization-tips/",
  title: "Naukri Profile Optimization Tips: 2026 Checklist",
  h1: "Naukri Profile Optimization: A Step-by-Step Checklist (2026)",
  description:
    "A section-by-section checklist to optimize your Naukri profile — headline, key skills, summary, employment, projects and preferences — to get more recruiter calls.",
  keywords: "naukri profile optimization tips, how to optimize naukri profile, naukri profile tips, naukri profile summary, naukri key skills, how to improve naukri profile",
  tag: "Checklist",
  readMins: 9,
  intro: "Use this checklist to go through your Naukri profile one section at a time. Each step makes your profile easier for recruiters to find, and easier to say “yes” to.",
  tldr: `<ol><li>Pick one target role and collect keywords from 10–15 job descriptions.</li><li>Rewrite your resume headline with role, years, skills and city.</li><li>Add matching key skills and IT skills.</li><li>Write a 4–6 line summary with numbers.</li><li>Align job titles and descriptions to market titles.</li><li>Set realistic career preferences.</li><li>Upload an ATS-friendly resume and keep the profile active.</li></ol>`,
  content: `
<h2>Step 1: Choose one target role</h2>
<p>A profile that tries to fit “Developer / Tester / Support / Analyst” fits none of them well. Choose the single role you most want next — for example “Business Analyst” — and build everything around it.</p>

<h2>Step 2: Collect your keywords</h2>
<p>Search your target role on Naukri, open 10–15 relevant job descriptions for your experience level and city, and list the skills, tools and titles that repeat. These are the words recruiters will also type into search.</p>
<blockquote>Tip: Separate them into three groups — <strong>role titles</strong> (e.g. Business Analyst, Product Analyst), <strong>hard skills</strong> (SQL, JIRA, BRD, Power BI) and <strong>domain words</strong> (BFSI, e-commerce, SaaS).</blockquote>

<h2>Step 3: Rewrite your resume headline</h2>
<p>Use this formula and stay within the character limit Naukri shows:</p>
<div class="example"><b>Formula:</b> Target role | X Yrs | Skill 1, Skill 2, Skill 3, Skill 4 | Domain / achievement | Notice period | City</div>
<div class="example"><b>Example:</b> Business Analyst | 4 Yrs | SQL, Power BI, JIRA, BRD/FRD | BFSI Domain | 30 Days Notice | Pune</div>
<p>More examples for 25+ roles: <a href="/blog/naukri-resume-headline-examples/">Naukri resume headline examples</a>.</p>

<h2>Step 4: Fix your key skills and IT skills</h2>
<ul>
  <li>Add the skills from Step 2 that you genuinely have, using the exact same wording.</li>
  <li>Put your most important, role-defining skills first.</li>
  <li>Remove outdated or irrelevant skills that dilute your profile.</li>
  <li>In IT skills, add versions and years of experience where relevant.</li>
</ul>

<h2>Step 5: Write a profile summary that sells</h2>
<p>Recruiters read this when deciding whether to call. Keep it to 4–6 lines:</p>
<ol>
  <li>Who you are: role + years + domain.</li>
  <li>What you’re great at: 3–5 core skills/tools.</li>
  <li>Proof: 2–3 achievements with numbers.</li>
  <li>What you want next: target role and type of company.</li>
</ol>
<div class="example"><b>Example:</b> Business Analyst with 4 years in BFSI, translating business needs into clear BRDs and data-driven insights. Skilled in SQL, Power BI, JIRA and stakeholder management. Built 20+ dashboards that cut monthly reporting time by 60%; led requirement gathering for a loan-origination revamp used by 300+ branch users. Looking for a Business Analyst / Product Analyst role in a fintech or product company.</div>

<h2>Step 6: Align employment details</h2>
<ul>
  <li>Use your official designation, but describe the work using market terms recruiters search for.</li>
  <li>Write 3–5 bullet-style lines per job: responsibility → action → result.</li>
  <li>Make sure dates match your resume and LinkedIn exactly.</li>
</ul>

<h2>Step 7: Add projects and accomplishments</h2>
<p>Projects are another place recruiters see your keywords in context. For each: project name, your role, tools used, and the outcome. Freshers should add academic projects, internships and certifications here.</p>

<h2>Step 8: Set your desired career profile correctly</h2>
<ul>
  <li><strong>Role & industry:</strong> match your target role.</li>
  <li><strong>Preferred locations:</strong> add every city you would genuinely relocate to.</li>
  <li><strong>Expected salary:</strong> realistic for your experience and market.</li>
  <li><strong>Notice period:</strong> accurate — recruiters filter heavily on this.</li>
</ul>

<h2>Step 9: Upload an ATS-friendly resume</h2>
<p>Your attached resume is also searchable and is what recruiters download. Use a simple, single-column format with the same keywords. See the <a href="/blog/ats-friendly-resume-format/">ATS-friendly resume guide</a>.</p>

<h2>Step 10: Stay active</h2>
<ul>
  <li>Log in regularly and make small genuine updates to keep your profile fresh.</li>
  <li>Reply to recruiter messages and calls quickly.</li>
  <li>Apply to relevant jobs consistently instead of mass-applying to everything.</li>
</ul>
<p>Following these ten steps puts you ahead of most profiles on Naukri. If you’d rather have an expert do it — with keyword research for your exact role — <a href="/naukri-profile-optimization/">see our Naukri profile optimization service</a>.</p>
`,
  faqs: [
    { q: "How many key skills should I add on Naukri?", a: "<p>Add all the relevant skills you genuinely have that appear in job descriptions for your target role — typically 10–20 strong, specific skills work better than a long list of generic ones.</p>" },
    { q: "Should I write my profile summary in first person?", a: "<p>Either works; most professionals use a crisp, implied first person (“Business Analyst with 4 years…”). Focus on role, skills and results rather than adjectives.</p>" },
  ],
});

/* ------------------------------------------------------------------ */

const H = (role, text) => `<tr><td>${role}</td><td>${text}</td></tr>`;

const headlineExamples = article({
  path: "/blog/naukri-resume-headline-examples/",
  title: "30+ Naukri Resume Headline Examples (Freshers & Experienced)",
  h1: "30+ Naukri Resume Headline Examples (Freshers & Experienced)",
  description:
    "31 copy-ready Naukri resume headline examples for freshers and experienced professionals in IT, sales, finance, HR and more — plus the formula recruiters respond to.",
  keywords: "naukri resume headline, resume headline for naukri, naukri resume headline examples, resume headline for fresher, resume headline for experienced, best resume headline",
  tag: "Examples",
  readMins: 7,
  intro: "Your resume headline is the first thing recruiters see in Naukri search results. Here’s a simple formula and 30+ examples you can adapt for your own profile.",
  tldr: `<p>A strong Naukri resume headline follows this formula: <strong>Target role | Years of experience | 4–6 core skills | Domain or achievement | Notice period | City</strong>. Avoid generic lines like “Seeking a challenging role” — they contain no keywords recruiters search for.</p>`,
  content: `
<h2>The headline formula</h2>
<div class="example"><b>Formula:</b> Target role | X Yrs | Skill 1, Skill 2, Skill 3, Skill 4 | Domain / key achievement | Availability | City</div>
<p>Only use skills you genuinely have, keep it within the character limit Naukri shows, and update it when your target role changes.</p>

<h2>Headlines to avoid</h2>
<ul>
  <li>“Seeking a challenging position in a reputed organization”</li>
  <li>“Hardworking, dedicated and honest professional”</li>
  <li>“Fresher looking for job” / “Any job”</li>
</ul>
<p>They say nothing about what you do — and match zero recruiter searches.</p>

<h2>Resume headline examples for freshers</h2>
<table>
<thead><tr><th>Role</th><th>Headline</th></tr></thead>
<tbody>
${H("Software Developer", "B.Tech CSE 2026 Fresher | Java, Spring Boot, SQL, DSA | 2 Full-Stack Projects | Immediate Joiner | Bangalore / Pune")}
${H("Data Analyst", "Data Analyst Fresher | SQL, Excel, Power BI, Python | Internship in Sales Analytics | Immediate Joiner | Hyderabad")}
${H("Web Developer", "Frontend Developer Fresher | HTML, CSS, JavaScript, React | 3 Live Projects | Immediate Joiner | Open to Relocate")}
${H("Accountant", "B.Com Fresher | Tally Prime, GST, Advanced Excel, Bank Reconciliation | Articleship Experience | Mumbai")}
${H("HR Executive", "MBA HR Fresher | Recruitment, Sourcing, Onboarding, MS Excel | Internship at Staffing Firm | Immediate Joiner | Delhi NCR")}
${H("Digital Marketing", "Digital Marketing Fresher | SEO, Google Ads, Meta Ads, GA4 | Certified | Managed ₹50K Ad Budget in Internship | Remote / Pune")}
${H("Customer Support", "Customer Support Fresher | English & Hindi, Voice & Chat Process, CRM | Immediate Joiner | Rotational Shifts | Noida")}
${H("Mechanical Engineer", "Mechanical Engineer Fresher | AutoCAD, SolidWorks, GD&T, Production Planning | Plant Internship | Chennai / Pune")}
${H("Sales Executive", "BBA Fresher | Field Sales, Lead Generation, Cold Calling, CRM | Immediate Joiner | Two-Wheeler | Ahmedabad")}
${H("Graphic Designer", "Graphic Designer Fresher | Photoshop, Illustrator, Figma, Canva | Portfolio of 30+ Designs | Immediate Joiner | Kolkata")}
</tbody></table>

<h2>Resume headline examples for experienced professionals</h2>
<table>
<thead><tr><th>Role</th><th>Headline</th></tr></thead>
<tbody>
${H("Java Developer", "Java Developer | 4 Yrs | Java 17, Spring Boot, Microservices, Kafka, AWS | Fintech | 30 Days Notice | Pune")}
${H("Full Stack Developer", "Full Stack Developer | 5 Yrs | React, Node.js, TypeScript, MongoDB, AWS | SaaS Products | Serving Notice | Bangalore")}
${H("QA / Testing", "QA Automation Engineer | 4 Yrs | Selenium, Java, TestNG, API Testing, CI/CD | BFSI | Immediate Joiner | Chennai")}
${H("Data Analyst", "Data Analyst | 3 Yrs | SQL, Power BI, Python, Advanced Excel | Dashboards & Business Reporting | Bangalore")}
${H("Data Scientist", "Data Scientist | 5 Yrs | Python, ML, NLP, SQL, AWS SageMaker | Built Churn Model Saving ₹2 Cr | Hyderabad")}
${H("DevOps Engineer", "DevOps Engineer | 6 Yrs | AWS, Kubernetes, Terraform, Jenkins, Docker | 99.9% Uptime Infra | 30 Days | Remote / Pune")}
${H("Business Analyst", "Business Analyst | 4 Yrs | Requirement Gathering, BRD/FRD, SQL, JIRA, Agile | BFSI | 30 Days Notice | Mumbai")}
${H("Product Manager", "Product Manager | 7 Yrs | B2C Apps, Roadmapping, A/B Testing, SQL | Scaled Product to 2M Users | Bangalore")}
${H("Sales Manager", "Sales Manager | 8 Yrs | B2B Sales, Key Accounts, Channel Sales, CRM | ₹10 Cr Annual Target Achieved | Mumbai")}
${H("Inside Sales", "Inside Sales Executive | 3 Yrs | EdTech/SaaS, Lead Conversion, CRM, Cold Calling | 120% Target Achievement | Bangalore")}
${H("Digital Marketing", "Digital Marketing Manager | 6 Yrs | SEO, Google Ads, Meta Ads, Marketing Automation | ₹1 Cr+ Annual Ad Spend | Gurgaon")}
${H("HR / Recruiter", "Talent Acquisition Specialist | 5 Yrs | IT Recruitment, Naukri Resdex, LinkedIn Recruiter, Stakeholder Mgmt | Hyderabad")}
${H("HR Generalist", "HR Generalist | 6 Yrs | Payroll, Employee Relations, Compliance, HRMS | Manufacturing | 30 Days Notice | Pune")}
${H("Accountant", "Senior Accountant | 6 Yrs | GST, TDS, Tally, SAP FICO, Month-End Closing | Audit Ready | Delhi NCR")}
${H("Financial Analyst", "Financial Analyst | 4 Yrs | FP&A, Financial Modelling, Budgeting, Power BI | MNC | 60 Days Notice | Bangalore")}
${H("Operations", "Operations Manager | 9 Yrs | Process Improvement, Team Handling 50+, SLA, Six Sigma Green Belt | Logistics | Chennai")}
${H("Customer Support", "Customer Support Team Lead | 5 Yrs | Voice & Chat, CSAT 92%, Escalations, Zendesk | Immediate Joiner | Noida")}
${H("Project Manager", "IT Project Manager | 10 Yrs | Agile, Scrum, PMP, Stakeholder Mgmt | Delivered 15+ Projects | Pune / Remote")}
${H("Civil Engineer", "Civil Site Engineer | 5 Yrs | Site Execution, AutoCAD, BOQ, Quality Control | High-Rise Residential | Mumbai")}
${H("Supply Chain", "Supply Chain Executive | 4 Yrs | Procurement, Vendor Mgmt, SAP MM, Inventory Control | FMCG | Ahmedabad")}
${H("Teacher / Trainer", "Corporate Trainer | 7 Yrs | Soft Skills, Sales Training, LMS, Content Design | Trained 2,000+ Employees | Remote")}
</tbody></table>

<h2>Tips to make your headline work harder</h2>
<ul>
  <li><strong>Match search terms:</strong> use the role title recruiters use, not just your internal designation.</li>
  <li><strong>Lead with your strongest skill:</strong> recruiters skim left to right.</li>
  <li><strong>Add a number:</strong> a result (₹ revenue, % growth, users, team size) makes you stand out in a list.</li>
  <li><strong>Mention availability:</strong> “Immediate Joiner” or your notice period helps recruiters with urgent hiring.</li>
  <li><strong>Keep it consistent:</strong> the same role and keywords should appear in your summary and resume.</li>
</ul>
<p>Want a headline — and full profile — written for your exact role? <a href="/naukri-profile-optimization/">See Naukri profile optimization</a>, which includes an <a href="/resume-optimization/">ATS-friendly resume</a> that matches it.</p>
`,
  faqs: [
    { q: "What is the character limit for a Naukri resume headline?", a: "<p>Naukri shows the limit in the headline editor (it has been around 250 characters). Use it fully with keywords, but keep it readable.</p>" },
    { q: "Should I add my notice period in the resume headline?", a: "<p>Yes, if it is short (immediate, 15 or 30 days) or you are serving notice — many recruiters hiring urgently look for exactly that.</p>" },
  ],
});

/* ------------------------------------------------------------------ */

const atsResume = article({
  path: "/blog/ats-friendly-resume-format/",
  title: "ATS-Friendly Resume Format for India (2026 Guide)",
  h1: "ATS-Friendly Resume Format: The Complete Guide for Indian Job Seekers",
  description:
    "What an ATS-friendly resume is, the best format, sections, fonts and file type, and the mistakes that get Indian job seekers rejected — with a simple structure.",
  keywords: "ats friendly resume, ats friendly resume format, ats resume india, resume format for naukri, best resume format 2026, resume for freshers",
  tag: "Resume guide",
  readMins: 8,
  intro: "Before a recruiter reads your resume, software often does. Here’s how to format your resume so applicant tracking systems read it correctly — and recruiters want to call you.",
  tldr: `<p>An ATS-friendly resume uses a <strong>single-column layout</strong>, <strong>standard section headings</strong> (Summary, Skills, Experience, Education), <strong>simple fonts</strong>, <strong>no tables, images, icons or text boxes</strong>, <strong>keywords from the job description</strong>, and is saved as <strong>DOCX or text-based PDF</strong>. Keep it to 1 page (freshers) or 2 pages (experienced).</p>`,
  content: `
<h2>What is an ATS?</h2>
<p>An Applicant Tracking System (ATS) is software that companies and job portals use to collect, store, parse and search resumes. When you upload a resume, the ATS extracts your name, contact details, titles, skills and experience into a database. Recruiters then search that database with keywords — very similar to how they search Naukri.</p>
<p>If the ATS can’t read your resume properly, your details may be scrambled or missing, and you won’t show up in searches even if you’re a perfect fit.</p>

<h2>The best ATS-friendly resume structure</h2>
<ol>
  <li><strong>Header:</strong> Name, phone, email, city, LinkedIn URL. (No photo, date of birth or full address needed.)</li>
  <li><strong>Professional Summary:</strong> 3–4 lines — role, years, top skills, 1–2 achievements.</li>
  <li><strong>Skills:</strong> grouped keywords (e.g. Languages, Tools, Domain).</li>
  <li><strong>Work Experience:</strong> reverse chronological; title, company, city, dates; 3–6 achievement bullets each.</li>
  <li><strong>Projects:</strong> especially for freshers and tech roles.</li>
  <li><strong>Education:</strong> degree, institute, year (and score if strong).</li>
  <li><strong>Certifications:</strong> relevant ones only.</li>
</ol>

<h2>Formatting rules that keep ATS happy</h2>
<table>
  <thead><tr><th>Do</th><th>Avoid</th></tr></thead>
  <tbody>
    <tr><td>Single-column layout</td><td>Two-column designs and sidebars</td></tr>
    <tr><td>Standard headings: Summary, Skills, Experience, Education</td><td>Creative headings like “My Journey” or “What I Bring”</td></tr>
    <tr><td>Common fonts (Calibri, Arial, Georgia), 10–12 pt</td><td>Decorative fonts, very small text</td></tr>
    <tr><td>Simple round or dash bullets</td><td>Icons, skill bars, star ratings, charts</td></tr>
    <tr><td>Text in the body of the document</td><td>Important text in headers/footers, tables or text boxes</td></tr>
    <tr><td>DOCX or text-based PDF</td><td>Scanned PDF or image files (JPG/PNG)</td></tr>
    <tr><td>Consistent date format (Jan 2023 – Present)</td><td>Mixed or missing dates</td></tr>
  </tbody>
</table>

<h2>How to add the right keywords</h2>
<ol>
  <li>Collect 5–10 job descriptions for your target role.</li>
  <li>Highlight skills, tools and phrases that repeat.</li>
  <li>Add the ones you genuinely have to your Summary, Skills and Experience bullets — naturally, not as a stuffed list.</li>
  <li>Use both the full form and the short form once where common (e.g. “Search Engine Optimization (SEO)”).</li>
</ol>

<h2>Write achievements, not duties</h2>
<p>Recruiters shortlist on impact. Use the pattern <em>Action verb + what you did + result with a number</em>:</p>
<div class="example"><b>Before:</b> Responsible for handling customer complaints.</div>
<div class="example"><b>After:</b> Resolved 60+ customer escalations per week, improving CSAT from 81% to 92% in 6 months.</div>

<h2>Resume length</h2>
<ul>
  <li><strong>Freshers – 5 years:</strong> 1 page.</li>
  <li><strong>5+ years:</strong> up to 2 pages.</li>
  <li><strong>Senior leaders:</strong> 2 pages, focused on the last 10–12 years.</li>
</ul>

<h2>Final checklist before you upload</h2>
<ul>
  <li>File name: <code>Firstname-Lastname-Target-Role-Resume.pdf</code></li>
  <li>Contact details correct and clickable</li>
  <li>Keywords match your target role and your Naukri profile</li>
  <li>No spelling mistakes; dates consistent</li>
  <li>Opens correctly when you copy-paste the text into a plain notepad (a quick ATS test)</li>
</ul>
<p>Need a recruiter-ready resume written for you? <a href="/resume-optimization/">See our resume optimization service</a>.</p>
`,
  faqs: [
    { q: "Is PDF or Word better for ATS?", a: "<p>Both work with most modern systems, as long as the PDF is text-based (not scanned). If a portal specifically asks for Word, upload DOCX.</p>" },
    { q: "Should I put a photo on my resume in India?", a: "<p>It’s not required for most private-sector roles, and photos can cause parsing issues. Leave it out unless the employer specifically asks for one.</p>" },
  ],
});


/* ---------------- New guides (23 Nov 2026) ---------------- */
const NEW_DATE = { published: "2026-11-23", shown: "23 Nov 2026" };

const getShortlisted = article({
  ...NEW_DATE,
  path: "/blog/how-to-get-shortlisted-on-naukri/",
  title: "How to Get Shortlisted on Naukri: 9 Steps That Work (2026)",
  h1: "How to Get Shortlisted on Naukri (2026): 9 Steps That Actually Work",
  description:
    "How to get shortlisted on Naukri: match your headline to the role, mirror job keywords, apply early and stay active so recruiters call you first.",
  keywords: "how to get shortlisted in naukri, how to get shortlisted on naukri, how to get shortlisted for interview, how to get shortlisted for a job, naukri shortlisting tips",
  tag: "Naukri guide",
  readMins: 7,
  intro: "Getting shortlisted on Naukri happens in two ways — a recruiter picks your application, or a recruiter finds you in a search and calls. Most job seekers only work on the first. Here’s how to win both.",
  tldr: `<p>To get shortlisted on Naukri: make your <strong>resume headline match the exact job title</strong> recruiters hire for, use the <strong>same key skills the job descriptions use</strong>, apply in the <strong>first few days</strong> of a posting, keep your profile <strong>active and complete</strong>, set <strong>realistic salary and notice period</strong>, and keep your resume and profile saying the same thing.</p>`,
  content: `
<h2>The two ways you get shortlisted</h2>
<p><b>1. Through your applications.</b> You apply, the recruiter (or their software) compares your profile and resume with the job, and the closest matches are shortlisted.</p>
<p><b>2. Through recruiter search.</b> Recruiters also search Naukri’s candidate database themselves — by job title, skills, experience, city and notice period — and call the profiles that rank at the top. These candidates get calls <em>without applying at all</em>.</p>
<p>Every step below helps with both.</p>

<h2>1. Make your headline the job title you want</h2>
<p>Your resume headline is the first line a recruiter sees in search results. A headline like “Seeking a challenging role in a reputed organisation” tells them nothing. Lead with your <b>target role, years of experience and two or three core skills</b>. See our <a href="/blog/naukri-resume-headline-examples/">30+ headline examples</a>.</p>

<h2>2. Use the words recruiters use</h2>
<p>Open five job posts for the role you want and note the skills that keep repeating. If your key skills and summary don’t contain those words, you’re invisible to the searches that use them — even if you have the experience.</p>

<h2>3. Apply early</h2>
<p>Recruiters often shortlist from the first wave of applicants. Applying in the first two or three days of a posting gives you far better odds than applying after it has hundreds of applications.</p>

<h2>4. Keep your profile active</h2>
<p>Recruiters can filter candidates by how recently they were active. A profile untouched for months slips down. Log in regularly and keep details current.</p>

<h2>5. Fill every section</h2>
<p>Incomplete profiles rank lower and look less serious. Employment details, education, projects, IT skills and career preferences should all be filled in properly.</p>

<h2>6. Set realistic salary, location and notice period</h2>
<p>Recruiters filter by these. An unrealistic expected salary, a single narrow city or a long notice period with no “negotiable” option quietly removes you from many searches.</p>

<h2>7. Make your resume match your profile</h2>
<p>When the resume says one title and the profile another, recruiters hesitate. Use one consistent story, and an <a href="/blog/ats-friendly-resume-format/">ATS-friendly resume format</a> that software can read — or let us handle it with our <a href="/resume-optimization/">resume writing service</a>.</p>

<h2>8. Show results, not duties</h2>
<p>“Handled client accounts” is a duty. “Managed 40 client accounts and grew renewals by 18%” is a result. Numbers make recruiters stop scrolling.</p>

<h2>9. Respond fast</h2>
<p>When a recruiter calls or messages, reply the same day. Shortlists move quickly — the candidate who answers first often gets the interview.</p>

<h2>Why most people still don’t get shortlisted</h2>
<p>None of these steps is secret — but doing all of them well, for your exact role and city, takes hours of research and rewriting, and most people stop at step one. That’s the part we do for you: our <a href="/naukri-profile-optimization/">Naukri profile makeover</a> rewrites your headline, skills, summary and resume around what recruiters search for, and our <a href="/naukri-job-application-service/">Done-For-You plan</a> also applies to relevant jobs for you for a month.</p>
`,
  faqs: [
    { q: "How do I know if I’ve been shortlisted on Naukri?", a: "<p>Usually a recruiter calls, emails or messages you to schedule a conversation or interview. Keep your phone reachable and check your Naukri inbox and email daily.</p>" },
    { q: "How long does Naukri shortlisting take?", a: "<p>It varies by company. Many recruiters shortlist within the first week of a posting, which is why applying early matters.</p>" },
    { q: "Can I get shortlisted without applying?", a: "<p>Yes. Recruiters search Naukri’s database and call matching profiles directly. A well-optimised profile can bring calls even on days you don’t apply.</p>" },
  ],
});

const aiPrompts = article({
  ...NEW_DATE,
  path: "/blog/chatgpt-prompts-for-naukri-profile/",
  title: "ChatGPT & Claude Prompts for Naukri Profile Optimization",
  h1: "ChatGPT & Claude Prompts for Naukri Profile Optimization (Copy-Paste, 2026)",
  description:
    "Free ChatGPT & Claude prompts for your Naukri headline, summary and key skills — plus what AI can’t do for your profile and how to avoid generic results.",
  keywords: "naukri profile optimization prompt, chatgpt prompt for naukri profile optimization, claude prompt for naukri profile, chatgpt naukri resume headline, ai for naukri profile",
  tag: "AI & Naukri",
  readMins: 6,
  intro: "AI tools can help you get a first draft of your Naukri profile in minutes. Here are prompts that give better results than “improve my profile” — and the important limits you should know before you paste anything into Naukri.",
  tldr: `<p>Give the AI <strong>your real role, experience, skills, city and target job</strong>, ask for <strong>one section at a time</strong> (headline, summary, key skills), and always <strong>check every line is true</strong>. AI drafts are a starting point — they don’t know what recruiters in your city search this week, they often sound the same for everyone, and they can add skills you don’t have.</p>`,
  content: `
<h2>Before you start: give the AI the right facts</h2>
<p>Most bad AI output comes from vague input. Keep this ready: your current title, total years of experience, top 6–8 skills, two or three achievements with numbers, your target role and preferred cities.</p>

<h2>Prompt 1 — Resume headline</h2>
<div class="example">I’m a <b>[current role]</b> with <b>[X] years</b> of experience in <b>[industry]</b>. My strongest skills are <b>[skill 1, skill 2, skill 3]</b>. I want roles as <b>[target role]</b> in <b>[city]</b>. Write 5 Naukri resume headlines under 250 characters that start with the target job title and include experience and core skills. No buzzwords like “dynamic” or “passionate”.</div>

<h2>Prompt 2 — Profile summary</h2>
<div class="example">Using these facts only — <b>[paste your experience, skills and 2–3 achievements]</b> — write a Naukri profile summary of 4–5 short sentences for a <b>[target role]</b>. Start with role and years of experience, mention measurable results, and end with the kind of role I want next. Do not invent anything.</div>

<h2>Prompt 3 — Key skills</h2>
<div class="example">Here are 5 job descriptions for <b>[target role]</b>: <b>[paste them]</b>. List the skills and tools that appear most often, then compare them with my skills: <b>[your skills]</b>. Show which ones I genuinely have but haven’t listed.</div>

<h2>Prompt 4 — Experience bullet points</h2>
<div class="example">Rewrite these job duties as achievement-based bullet points for my resume. Use action verbs and keep any numbers I give. If a point has no result, ask me a question instead of making one up: <b>[paste duties]</b></div>

<h2>Prompt 5 — Resume check</h2>
<div class="example">Act as a recruiter hiring a <b>[target role]</b> in India. Read my resume <b>[paste text]</b> and list the 5 biggest reasons you might not shortlist it, in order of importance.</div>

<h2>What AI can’t do for your Naukri profile</h2>
<table>
<thead><tr><th>Limit</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td>It doesn’t know what recruiters search today</td><td>AI guesses keywords from general text, not from how recruiters for your role and city actually search right now.</td></tr>
<tr><td>Everyone gets similar wording</td><td>Thousands of profiles now use the same AI phrases. Recruiters notice, and they blend together in search results.</td></tr>
<tr><td>It can invent things</td><td>AI sometimes adds skills or results you don’t have. A recruiter will ask about them in the interview.</td></tr>
<tr><td>It can’t update your profile</td><td>Headline, skills, summary, employment, projects and preferences all need to be entered correctly and kept consistent with your resume.</td></tr>
<tr><td>It can’t apply for you</td><td>Finding and applying to relevant jobs every day still takes hours.</td></tr>
</tbody>
</table>

<h2>When to let a person do it</h2>
<p>If you’ve tried AI drafts and calls still aren’t coming, the issue is usually the parts AI can’t see — how your profile ranks against others for your role and city. Our <a href="/naukri-profile-optimization/">Naukri profile makeover</a> is written by a person, built for your real experience, and updated in your Naukri account for you — together with an <a href="/resume-optimization/">ATS-friendly resume</a>. Want applications handled too? See <a href="/naukri-job-application-service/">Done-For-You Job Search</a>.</p>
`,
  faqs: [
    { q: "Is it okay to use ChatGPT for my Naukri profile?", a: "<p>Yes, as a first draft — as long as every line is true and you edit it into your own words. Never paste skills or results you don’t have.</p>" },
    { q: "Which is better for Naukri profiles, ChatGPT or Claude?", a: "<p>Both write good drafts when you give them clear facts. The quality depends far more on the information you provide than on the tool.</p>" },
    { q: "Will recruiters know my profile was written by AI?", a: "<p>Often, yes — generic AI phrases are now very common. Specific numbers, real projects and your own wording make a profile stand out.</p>" },
  ],
});

const paidServices = article({
  ...NEW_DATE,
  path: "/blog/naukri-paid-services-worth-it/",
  title: "Are Naukri Paid Services Worth It? Honest Guide (2026)",
  h1: "Are Naukri Paid Services Worth It? An Honest Guide (2026)",
  description:
    "Thinking of buying Naukri paid services or FastForward? What visibility boosts can and can’t do, when they’re worth it, and why to fix your profile first.",
  keywords: "naukri paid services, naukri paid services worth it, is naukri fastforward worth it, naukri premium worth it, naukri paid services review, naukri paid services cost",
  tag: "Buying guide",
  readMins: 6,
  intro: "Naukri sells paid plans that promise more recruiter attention. They can help — but only in one situation. Here’s how to decide before you spend money.",
  tldr: `<p>Naukri’s paid plans mainly <strong>increase how often recruiters see your profile or applications</strong>. That helps when your profile is already strong. If your headline, skills and summary don’t match what recruiters search, a visibility boost shows a weak profile to more people. <strong>Fix the profile first; then decide if you need a boost.</strong></p>`,
  content: `
<h2>What Naukri’s paid plans generally offer</h2>
<p>Naukri sells paid plans for job seekers (sold under names such as FastForward and other premium plans). Features and prices change over time, so always check <a href="https://www.naukri.com" rel="nofollow noopener" target="_blank">Naukri’s official website</a> for current details. In general, these plans focus on <b>visibility</b> — for example highlighting your profile or applications to recruiters — and some include resume-writing add-ons.</p>

<h2>The question to ask first</h2>
<p>A visibility boost puts your profile in front of more recruiters. So ask: <b>when a recruiter sees my profile today, does it make them want to call?</b> If your headline is generic, your skills don’t match the role, or your summary lists duties instead of results, more visibility mostly means more recruiters skipping you.</p>

<h2>When a paid boost can be worth it</h2>
<ul>
  <li>Your profile already matches your target role and you get some calls — you just want more.</li>
  <li>You’re in a competitive role or city and need to stand out among many similar profiles.</li>
  <li>You’re actively looking right now and can respond to calls quickly.</li>
</ul>

<h2>When it usually isn’t</h2>
<ul>
  <li>You get almost no profile views or calls today — the profile itself is the problem.</li>
  <li>Your resume and Naukri profile tell different stories.</li>
  <li>You’re targeting a different role than your current job title suggests.</li>
</ul>

<h2>What you’re actually paying for — compared</h2>
<table>
<thead><tr><th>Option</th><th>What it changes</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>Naukri paid visibility plans</td><td>How often your profile/applications are shown</td><td>Profiles that are already strong</td></tr>
<tr><td><a href="/naukri-profile-optimization/">GetShortlisted Profile Makeover</a> (₹5,999)</td><td>What recruiters see: headline, key skills, summary, preferences + ATS resume, updated for you</td><td>Profiles getting few views or calls</td></tr>
<tr><td><a href="/naukri-job-application-service/">GetShortlisted Done-For-You</a> (₹8,999)</td><td>Everything in the makeover + we apply to relevant jobs for you for 1 month</td><td>Busy professionals, people on notice period</td></tr>
</tbody>
</table>
<p>You can also combine them: fix the profile first, then add a visibility boost once you know the profile converts.</p>

<h2>A quick self-check before you buy anything</h2>
<ol>
  <li>Does your headline start with the job title you want?</li>
  <li>Do your key skills match the words in job posts for that role?</li>
  <li>Does your summary include at least two results with numbers?</li>
  <li>Are salary, city and notice period realistic?</li>
  <li>Does your resume say the same thing as your profile?</li>
</ol>
<p>If you answered “no” to two or more, start with the profile — see <a href="/blog/not-getting-calls-from-naukri/">why you’re not getting calls from Naukri</a>.</p>
<p class="note-small">GetShortlisted is an independent service and is not affiliated with Naukri.com or Info Edge (India) Ltd. Product names belong to their owners. This guide is general information, not a review of any specific plan.</p>
`,
  faqs: [
    { q: "Is Naukri FastForward worth it?", a: "<p>It can be if your profile already matches your target role and you want more visibility. If you’re getting very few views or calls, fix your headline, skills and summary first — otherwise the boost shows a weak profile to more recruiters.</p>" },
    { q: "How much do Naukri paid services cost?", a: "<p>Prices depend on the plan and duration and change over time. Check Naukri’s official website for current pricing.</p>" },
    { q: "What’s the difference between GetShortlisted and Naukri paid services?", a: "<p>Naukri’s plans mainly increase visibility. We change what recruiters see — your headline, key skills, summary, preferences and resume — and on Done-For-You we also apply to relevant jobs for you for a month.</p>" },
  ],
});

/* ---------------- Guides batch 2 (24 Nov 2026) ---------------- */
const DATE2 = { published: "2026-11-24", shown: "24 Nov 2026" };
const S = (role, text) => `<div class="example"><b>${role}</b><br>${text}</div>`;

const summaryExamples = article({
  ...DATE2,
  path: "/blog/naukri-profile-summary-examples/",
  title: "Naukri Profile Summary Examples for Freshers & Experienced",
  h1: "Naukri Profile Summary Examples (2026): Freshers, Experienced & 10 Roles",
  description:
    "Naukri profile summary examples for freshers and experienced — software developer, data engineer, sales, HR, accounts and more — plus a simple formula.",
  keywords: "naukri profile summary, naukri profile summary for freshers, naukri profile summary examples for experienced, naukri profile summary for software developer, naukri profile summary for data engineer, profile summary for naukri",
  tag: "Examples",
  readMins: 8,
  intro: "Your profile summary is where a recruiter decides whether to call or keep scrolling. Most summaries say “hardworking and passionate” and nothing else. Here’s a simple formula and examples for freshers and experienced professionals.",
  tldr: `<p>A strong Naukri profile summary is <strong>3–5 short sentences</strong>: your <strong>target role and years of experience</strong>, your <strong>core skills</strong>, <strong>1–2 results with numbers</strong>, and <strong>the role you want next</strong>. Skip “hardworking, dynamic, passionate” — recruiters ignore them.</p>`,
  content: `
<h2>The 4-part formula</h2>
<ol>
  <li><b>Who you are:</b> role + years of experience (or degree, for freshers).</li>
  <li><b>What you’re good at:</b> 3–5 core skills or tools for the role you want.</li>
  <li><b>Proof:</b> one or two results with numbers — time saved, revenue, accuracy, team size, projects.</li>
  <li><b>What’s next:</b> the role you’re targeting, and city or notice period if it helps.</li>
</ol>
<p>Keep it short. Recruiters skim; four tight sentences beat a long paragraph.</p>

<h2>Profile summary examples for freshers</h2>
${S("B.Tech (Computer Science) fresher", "Computer Science graduate (2026) with hands-on projects in Java, Spring Boot and MySQL. Built a college placement portal used by 300+ students and completed a 3-month backend internship. Looking for a Software Engineer / Java Developer role in Pune or Bengaluru; available to join immediately.")}
${S("B.Com fresher", "B.Com graduate (2026) with working knowledge of Tally, GST basics and advanced Excel (VLOOKUP, pivot tables). Completed a 2-month internship handling invoices and reconciliations for 40+ vendors. Seeking an Accounts Executive or Finance Associate role in Mumbai.")}
${S("MBA (Marketing) fresher", "MBA in Marketing with internships in digital campaigns and market research. Ran Instagram and Google Ads campaigns for a D2C brand that improved click-through rate by 22%. Looking for a Marketing Executive or Brand Associate role.")}
${S("Fresher with no internship", "BCA graduate (2026) skilled in HTML, CSS, JavaScript and React through self-built projects, including a responsive e-commerce demo site. Certified in Google Analytics. Seeking a Junior Front-End Developer role; open to relocation.")}

<h2>Profile summary examples for experienced professionals</h2>
${S("Software Developer (4 years)", "Software Developer with 4 years of experience building REST APIs and microservices in Java, Spring Boot and AWS. Reduced API response time by 35% and led the migration of 3 services to Kubernetes. Looking for a Senior Software Engineer role; 30-day notice period.")}
${S("Data Engineer (5 years)", "Data Engineer with 5 years of experience in Python, SQL, Spark and Azure Data Factory. Built pipelines processing 2 TB of data daily and cut reporting delays from 24 hours to 2. Targeting Senior Data Engineer roles in Bengaluru or Hyderabad.")}
${S("Production Engineer (6 years)", "Production Engineer with 6 years in automotive manufacturing, skilled in lean manufacturing, Kaizen, 5S and SAP PP. Improved line efficiency by 18% and reduced rejection rate from 3.2% to 1.1%. Seeking a Production Manager role in Pune or Chennai.")}
${S("Sales Executive / Manager (7 years)", "B2B Sales professional with 7 years of experience in SaaS and industrial products. Consistently achieved 110–130% of annual targets and built a ₹4 Cr client portfolio. Looking for an Area Sales Manager or Key Account Manager role.")}
${S("HR Executive (3 years)", "HR Executive with 3 years of experience in end-to-end recruitment, onboarding and HR operations. Closed 150+ positions across IT and non-IT roles and reduced average time-to-hire by 20%. Seeking an HR Generalist or Talent Acquisition role.")}
${S("Accountant (5 years)", "Accountant with 5 years of experience in GST, TDS, reconciliations and month-end closing using Tally and SAP FICO. Managed books for 3 entities and cleared 2 statutory audits with zero major observations. Looking for a Senior Accountant role.")}
${S("Customer Support (3 years)", "Customer Support Executive with 3 years of experience in voice and chat support for fintech customers. Maintained a 94% CSAT score and handled 80+ queries a day. Seeking a Team Lead or Senior Support role.")}
${S("Digital Marketing (4 years)", "Digital Marketing Specialist with 4 years in performance marketing — Google Ads, Meta Ads, SEO and GA4. Managed ₹15 lakh monthly ad spend at a 4.2x ROAS. Looking for a Performance Marketing Manager role.")}
${S("Business Analyst (5 years)", "Business Analyst with 5 years in BFSI projects, skilled in requirement gathering, SQL, Power BI and JIRA. Delivered 12 releases with stakeholders across 3 countries. Seeking a Senior Business Analyst or Product Analyst role.")}
${S("QA / Software Tester (4 years)", "QA Engineer with 4 years of manual and automation testing using Selenium, Java, TestNG and Postman. Automated 600+ regression cases and cut release testing time by 40%. Looking for a Senior QA Automation role.")}

<h2>Mistakes that make recruiters skip your summary</h2>
<ul>
  <li><b>Buzzwords only:</b> “hardworking, dynamic, passionate” — every profile says it.</li>
  <li><b>No target role:</b> recruiters don’t know which job you want.</li>
  <li><b>Duties, not results:</b> “responsible for reports” tells them nothing; “built 20 weekly reports used by 4 teams” does.</li>
  <li><b>Different from your headline and resume:</b> one consistent story builds trust.</li>
  <li><b>Too long:</b> anything over 5–6 sentences rarely gets read.</li>
</ul>

<h2>Examples are the easy part</h2>
<p>A good summary still has to match your headline, key skills, employment details and resume — and use the words recruiters search for <em>your</em> role and city. That’s what our <a href="/naukri-profile-optimization/">Naukri profile makeover</a> does, written by a person for your real experience. See also <a href="/blog/naukri-resume-headline-examples/">resume headline examples</a> and <a href="/blog/naukri-key-skills/">how to choose key skills</a>.</p>
`,
  faqs: [
    { q: "How long should a Naukri profile summary be?", a: "<p>3–5 short sentences is ideal. Naukri allows more, but recruiters skim — the first two lines matter most.</p>" },
    { q: "What should a fresher write in the Naukri profile summary?", a: "<p>Your degree and year, 3–5 skills you can prove, your best project or internship with a result, and the role you want. Skip generic words like “hardworking”.</p>" },
    { q: "Can I copy these examples?", a: "<p>Use them as a pattern, not word-for-word. Copied summaries look identical to thousands of others — use your own facts and numbers.</p>" },
  ],
});

const keySkills = article({
  ...DATE2,
  path: "/blog/naukri-key-skills/",
  title: "Naukri Key Skills: Examples, Limits & Why They Don’t Match",
  h1: "Naukri Key Skills: Examples, How Many to Add & Why They Don’t Match (2026)",
  description:
    "How to choose Naukri key skills recruiters search for: examples by role, how many to add, key skills vs IT skills, and what to do when your skills don’t match.",
  keywords: "naukri key skills, naukri key skills examples, naukri key skills limit, naukri key skills not matching, difference between key skills and it skills in naukri, key skills for naukri profile",
  tag: "Naukri guide",
  readMins: 7,
  intro: "Key skills are one of the main ways recruiters filter candidates on Naukri. Add the wrong ones — or too many — and you quietly disappear from searches. Here’s how to get them right.",
  tldr: `<p>Add <strong>10–15 focused key skills</strong> that match the <strong>job title you want</strong>, using the <strong>same words job posts use</strong> (and Naukri’s suggested spellings). Put your strongest, most-searched skills first. <strong>Key skills</strong> are search tags; <strong>IT skills</strong> are a separate section for software and tools with version and years of use.</p>`,
  content: `
<h2>Why key skills matter so much</h2>
<p>When recruiters search Naukri’s database, they type a job title and a few skills. Profiles whose key skills match those words rank higher. If your key skills say “MS Office, communication, teamwork” while recruiters search “Power BI, SQL, DAX”, you won’t appear — even if you use Power BI every day.</p>

<h2>How to choose the right key skills</h2>
<ol>
  <li>Open 5–10 job posts for the exact role you want, in your city.</li>
  <li>Note the skills and tools that repeat across most of them.</li>
  <li>Keep only the ones you genuinely have — you’ll be asked about them.</li>
  <li>Use the standard spelling job posts use (for example “Power BI”, not “PowerBI dashboards”).</li>
  <li>Order them by importance: the role’s core skills first, soft skills last (or not at all).</li>
</ol>

<h2>How many key skills should you add?</h2>
<p>Naukri limits how many key skills you can add (the counter in the Key Skills section shows how many are left). More isn’t better: <b>10–15 focused skills</b> that match one target role work far better than 40 unrelated ones, which blur what you actually do.</p>

<h2>Key skills vs IT skills — what’s the difference?</h2>
<table>
<thead><tr><th></th><th>Key skills</th><th>IT skills</th></tr></thead>
<tbody>
<tr><td>What it is</td><td>Short search tags for your profile</td><td>Software and tools you’ve used</td></tr>
<tr><td>Details</td><td>Just the skill name</td><td>Version, last used year, years of experience</td></tr>
<tr><td>Used for</td><td>Matching recruiter searches</td><td>Showing depth with specific tools</td></tr>
<tr><td>Example</td><td>Data Analysis, SQL, Power BI</td><td>SQL Server 2019 — 4 years; Power BI — 3 years</td></tr>
</tbody>
</table>
<p>Fill both. Keep the tools consistent between them and your resume.</p>

<h2>“My key skills are not matching” — why it happens</h2>
<ul>
  <li><b>Different wording:</b> you wrote “Customer handling”, recruiters search “Customer Service”. Prefer Naukri’s suggested terms as you type.</li>
  <li><b>Wrong role focus:</b> your skills describe your current job, not the job you want next.</li>
  <li><b>Too many unrelated skills:</b> your profile matches nothing strongly.</li>
  <li><b>Profile and resume disagree:</b> the resume parsed into your profile may add or overwrite skills — check after every resume upload.</li>
</ul>

<h2>Key skills examples by role</h2>
<table>
<thead><tr><th>Role</th><th>Example key skills</th></tr></thead>
<tbody>
<tr><td>Software Developer (Java)</td><td>Java, Spring Boot, Microservices, REST API, Hibernate, MySQL, AWS, Git</td></tr>
<tr><td>Data Analyst</td><td>SQL, Power BI, Excel, Python, Data Visualization, DAX, Tableau</td></tr>
<tr><td>Data Engineer</td><td>Python, SQL, Apache Spark, Azure Data Factory, Databricks, ETL, Airflow</td></tr>
<tr><td>QA Engineer</td><td>Selenium, Java, TestNG, API Testing, Postman, Manual Testing, JIRA</td></tr>
<tr><td>Sales Executive</td><td>B2B Sales, Lead Generation, Client Acquisition, Negotiation, CRM, Key Account Management</td></tr>
<tr><td>HR Executive</td><td>Recruitment, Talent Acquisition, Onboarding, HR Operations, Payroll, Employee Engagement</td></tr>
<tr><td>Accountant</td><td>Tally, GST, TDS, Accounts Payable, Bank Reconciliation, SAP FICO, MIS Reporting</td></tr>
<tr><td>Customer Support</td><td>Customer Service, Voice Process, Chat Support, CRM, Escalation Handling, CSAT</td></tr>
<tr><td>Digital Marketing</td><td>Google Ads, Meta Ads, SEO, GA4, Performance Marketing, Content Marketing</td></tr>
<tr><td>Production Engineer</td><td>Lean Manufacturing, Kaizen, 5S, SAP PP, Root Cause Analysis, Quality Control</td></tr>
</tbody>
</table>
<p class="note-small">Examples only — your list should come from real job posts for your role and city, and only include skills you can talk about in an interview.</p>

<h2>Skills are one piece of the puzzle</h2>
<p>Key skills work together with your <a href="/blog/naukri-resume-headline-examples/">resume headline</a>, <a href="/blog/naukri-profile-summary-examples/">profile summary</a> and resume. If you’d rather have it all done for your role and city — and updated in your account — see our <a href="/naukri-profile-optimization/">Naukri profile makeover</a>.</p>
`,
  faqs: [
    { q: "How many key skills should I add on Naukri?", a: "<p>Around 10–15 focused skills for one target role. Naukri shows a counter of how many you can add; using all of them with unrelated skills usually hurts more than it helps.</p>" },
    { q: "What is the difference between key skills and IT skills in Naukri?", a: "<p>Key skills are short search tags that help recruiters find you. IT skills list software and tools with version, last used year and years of experience. Fill both and keep them consistent.</p>" },
    { q: "Should I add soft skills like communication?", a: "<p>Only a few, at the end. Recruiters mostly search for role-specific skills and tools, so those should take the top spots.</p>" },
  ],
});

const updateTime = article({
  ...DATE2,
  path: "/blog/best-time-to-update-naukri-profile/",
  title: "Best Time to Update Your Naukri Profile (Daily Routine)",
  h1: "Best Time to Update Your Naukri Profile — and a 10-Minute Daily Routine (2026)",
  description:
    "When to update your Naukri profile, how often, what to change, whether auto-updater extensions are safe, and a simple 10-minute daily routine to stay visible.",
  keywords: "best time to update naukri profile, naukri profile update time, naukri profile refresh, naukri profile auto updater, how often to update naukri profile, naukri daily routine",
  tag: "Naukri guide",
  readMins: 6,
  intro: "Recruiters prefer candidates who are actively looking. Keeping your Naukri profile fresh is simple — if you know when to update it, what to change, and what to avoid.",
  tldr: `<p>Log in and make a <strong>small, genuine update on weekday mornings (around 9–11 am)</strong>, ideally <strong>daily while you’re actively looking</strong>. Recruiters can filter by how recently candidates were active. <strong>Avoid auto-updater extensions</strong> — they use your login, can break Naukri’s terms and put your account at risk.</p>`,
  content: `
<h2>Why updating your profile matters</h2>
<p>Recruiters searching Naukri’s database can filter candidates by how recently they were active, and recently active candidates are seen as serious about a move. A profile that hasn’t changed in months quietly slips below people who are active this week.</p>

<h2>What’s the best time to update?</h2>
<p><b>Weekday mornings, roughly 9–11 am</b>, when many recruiters start their day and run new searches. Updating just before that window keeps you near the top of “recently active” candidates when they look.</p>

<h2>How often should you update?</h2>
<ul>
  <li><b>Actively looking:</b> a small update every working day.</li>
  <li><b>Casually looking:</b> two or three times a week.</li>
  <li><b>Not looking:</b> once a month, so your details stay accurate.</li>
</ul>

<h2>What counts as a useful update?</h2>
<p>Make small, real changes — not random edits:</p>
<ul>
  <li>Re-upload your latest resume after a genuine improvement.</li>
  <li>Refine one line of your summary or a project description.</li>
  <li>Add a new skill, certification or tool you’ve actually learned.</li>
  <li>Update notice period, salary or preferred cities when they change.</li>
</ul>
<p>Never change your headline or key skills away from your target role just to “refresh” — that can push you out of the searches that matter.</p>

<h2>Are Naukri auto-updater extensions safe?</h2>
<p>Browser extensions and scripts that “auto-refresh” your profile usually need your Naukri login and act on your account automatically. That can go against Naukri’s terms of use, may get your account restricted, and gives a third party access to your login. Recruiters also care about real activity — replying to messages and applying to relevant jobs — not just a timestamp. A two-minute manual update is safer.</p>

<h2>A 10-minute daily routine</h2>
<ol>
  <li><b>2 min:</b> log in and make one small, genuine profile update.</li>
  <li><b>3 min:</b> reply to every recruiter message and missed call.</li>
  <li><b>4 min:</b> apply to 2–3 newly posted jobs that truly match your role.</li>
  <li><b>1 min:</b> note interview calls and follow-ups in one place.</li>
</ol>
<p>Done consistently for two weeks, this routine alone often brings more profile views — provided the profile itself matches what recruiters search.</p>

<h2>If updating isn’t bringing calls</h2>
<p>Freshness only helps a profile that already matches your target role. If you update daily and still get no calls, the headline, key skills or summary are usually the problem — see <a href="/blog/not-getting-calls-from-naukri/">why you’re not getting calls from Naukri</a>, or let us handle it with a <a href="/naukri-profile-optimization/">profile makeover</a>. Our <a href="/naukri-job-application-service/">Done-For-You plan</a> also keeps your profile active and applies to relevant jobs for you for a month.</p>
`,
  faqs: [
    { q: "What is the best time to update a Naukri profile?", a: "<p>Weekday mornings, around 9–11 am, when many recruiters start new searches. While you’re actively looking, a small genuine update every working day works best.</p>" },
    { q: "Does updating my Naukri profile daily really help?", a: "<p>It helps recruiters see you as actively looking, as long as your headline, key skills and summary already match the roles you want. It won’t fix a profile that doesn’t match.</p>" },
    { q: "Should I use a Naukri profile auto updater?", a: "<p>We don’t recommend it. Auto-updaters use your login, may break Naukri’s terms and risk your account. A short manual update is safer and counts as real activity.</p>" },
  ],
});

const posts = [getShortlisted, notGettingCalls, summaryExamples, keySkills, updateTime, paidServices, profileTips, aiPrompts, headlineExamples, atsResume];

/* ------------------------------------------------------------------ */
/* Blog index                                                          */
/* ------------------------------------------------------------------ */

const indexBody = `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog/" }])}
    <span class="eyebrow">Free guides</span>
    <h1>Naukri & Resume Guides to Get More Recruiter Calls</h1>
    <p class="lead">Practical, no-fluff guides on Naukri profile optimization, resume headlines and ATS-friendly resumes — written for job seekers in India.</p>
  </div>
</section>
<section class="section">
  <div class="wrap grid grid-2">
    ${posts.map((p) => `<a class="card post-card" href="${p.path}"><span class="tag">${esc(p._card.tag)}</span><h3>${esc(p._card.h1)}</h3><p>${esc(p._card.description)}</p><span class="more">Read guide (${p._card.readMins} min)</span></a>`).join("")}
  </div>
</section>
${ctaBand()}`;

const index = {
  path: "/blog/",
  title: "Naukri Profile & Resume Guides — Free Job Search Tips",
  description: "Free guides on Naukri profile optimization, resume headline examples, ATS-friendly resume format and why you’re not getting recruiter calls.",
  priority: 0.7,
  changefreq: "weekly",
  schema: [
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog/" }]),
    {
      "@type": "CollectionPage",
      name: "GetShortlisted Guides",
      url: `${SITE.url}/blog/`,
      hasPart: posts.map((p) => ({ "@type": "Article", headline: p._card.h1, url: SITE.url + p.path })),
    },
  ],
  body: indexBody,
};

export default [index, ...posts];

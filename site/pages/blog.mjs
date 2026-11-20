import { leadForm, faqList, faqSchema, ctaBand, articleSchema, breadcrumbSchema, breadcrumbs, esc } from "../layout.mjs";
import { SITE } from "../config.mjs";

const PUBLISHED = "2026-11-19";

function article({ path, title, h1, description, keywords, tag, readMins, intro, tldr, content, faqs = [] }) {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Guides", path: "/blog/" }, { name: h1, path }];
  const body = `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">${esc(tag)}</span>
    <h1>${esc(h1)}</h1>
    <p class="lead">${intro}</p>
    <p class="article-meta">By <a href="/about/" style="color:inherit">${esc(SITE.founder)}</a> · Updated <time datetime="${PUBLISHED}">19 Nov 2026</time> · ${readMins} min read</p>
  </div>
</section>
<section class="section">
  <div class="wrap article-layout">
    <article class="prose">
      <div class="tldr"><strong>Quick answer</strong>${tldr}</div>
      ${content}
      ${faqs.length ? `<h2>Frequently asked questions</h2>${faqList(faqs)}` : ""}
    </article>
    <aside>
      ${leadForm({ heading: "Want us to do it for you?", sub: "Share your Naukri profile or resume. We’ll reply within 24 hours.", compact: true })}
    </aside>
  </div>
</section>
${ctaBand()}`;
  return {
    path, title, description, keywords, body, ogType: "article", published: PUBLISHED, modified: PUBLISHED, priority: 0.8,
    _card: { tag, h1, description, readMins },
    schema: [
      articleSchema({ title: h1, description, path, published: PUBLISHED, modified: PUBLISHED }),
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
<p>Want a headline — and full profile — written for your exact role? <a href="/naukri-profile-optimization/">See Naukri profile optimization</a>.</p>
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

const posts = [notGettingCalls, profileTips, headlineExamples, atsResume];

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
    ${posts.map((p) => `<a class="card post-card" href="${p.path}"><span class="tag">${esc(p._card.tag)}</span><h3>${esc(p._card.h1)}</h3><p>${esc(p._card.description)}</p><span class="more">Read guide (${p._card.readMins} min) →</span></a>`).join("")}
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

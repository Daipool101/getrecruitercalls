# GetShortlisted — SEO & GEO Lead Strategy

**Goal:** 100–200 leads per month from getshortlisted.in, then grow.
**Written:** 21 Nov 2026 · **Review:** every month (see "Monthly routine" at the end).

> **SEO** = ranking on Google/Bing. **GEO** (Generative Engine Optimization) = being the answer ChatGPT, Gemini, Perplexity, Copilot and Google AI Overviews quote and link to.
> Both reward the same thing: the clearest, most useful, most trusted answer to the question a job seeker is typing.

---

## 1. The lead maths (what we're aiming for)

| | Month 1–2 | Month 3–4 | Month 6+ |
|---|---|---|---|
| Visitors / month | 1,500–3,000 | 4,000–6,000 | 8,000+ |
| Form + WhatsApp conversion | 4–6% | 4–6% | 4–6% |
| **Leads / month** | **60–150** | **150–300** | **300+** |
| Main source | Social + WhatsApp groups + (optional) ads | Google guides start ranking | Google + AI answers |

**Honest timeline:** a brand-new domain usually needs **3–6 months** before Google sends steady traffic. To hit 100+ leads in the first 1–2 months, the **Section 6 (social / community)** work is essential, and **Section 7 (small paid boost)** is optional but the fastest lever.

---

## 2. What job seekers actually search — and where we answer it

People don't search "Naukri profile optimization service" first. They search their **problem**, then **how to fix it**, then **who can fix it for me**. We must own all three stages.

| Stage | What they type (examples) | Our page |
|---|---|---|
| **Problem** (biggest volume) | not getting calls from naukri · naukri profile not getting views · recruiters not calling me · applied 100 jobs no response · no interview calls | `/blog/not-getting-calls-from-naukri/` (live) + new guides below |
| **How-to** | how to update naukri profile · naukri resume headline for freshers / experienced · key skills for data analyst · naukri profile summary examples · ats friendly resume format · how to get shortlisted | Guides (4 live, ~20 to add — Section 3) |
| **Hire someone** (highest intent) | naukri profile optimization service · naukri profile writing service · resume writing service india · resume writer near me · naukri profile optimization price | `/naukri-profile-optimization/`, `/resume-optimization/`, `/pricing/` (live) |
| **Done-for-you** | apply jobs on my behalf · job application service india · someone to apply for jobs for me · job search assistance | `/naukri-job-application-service/` (live) |
| **Life situation** | job after layoff · job switch with 90 days notice period · career gap job search · fresher job not getting · job change after 2 years | New guides (Section 3) |
| **Role-specific** | resume headline for java developer · key skills for HR executive naukri · sales executive resume | Role guides (Section 3) |
| **Comparison** | is naukri fastforward worth it · naukri paid services review · resume writing service review | One honest comparison guide (Section 3) |

**Rule:** every guide links to the matching service page and ends with the lead form + WhatsApp. Every service page links to 2–3 guides.

---

## 3. Content plan — 24 pages in 12 weeks (2 per week)

Write in this order (highest lead value first). Each guide: **Quick answer box at the top → question-style headings → real examples → FAQ → form**. 1,200–2,000 words. Hinglish-friendly simple English.

**Weeks 1–4 (problem + money pages)**
1. Why recruiters are not calling you (7 reasons) — and what to change today
2. How to update your Naukri profile to appear in recruiter search (step-by-step, 2026)
3. Naukri profile summary examples (30+ by role and experience)
4. Key skills for Naukri: how to choose them + lists for 15 roles
5. How to get a job after a layoff in India (30-day plan)
6. Job switch with 60/90 days notice period — how to still get calls
7. Is Naukri FastForward worth it? Honest comparison with doing it yourself and with a service *(facts only, no attacks; mention it's a Naukri product)*
8. How much does resume writing cost in India? (price ranges, what you get — link /pricing/)

**Weeks 5–8 (role pages — 1 role = 1 page "Resume headline + key skills + summary for ___")**
9. Data Analyst · 10. Software Engineer / Java Developer · 11. Sales Executive · 12. HR Executive / Recruiter · 13. Accountant / CA fresher · 14. Customer Support / BPO · 15. Digital Marketing · 16. QA / Software Testing

**Weeks 9–12 (situations + freshers)**
17. Fresher not getting calls on Naukri — fix in 7 days
18. Career gap: how to explain it on Naukri and your resume
19. Resume for freshers (format + 5 examples, ATS-friendly)
20. How recruiters search Naukri Resdex (what keywords, filters and "last active" mean)
21. Naukri vs LinkedIn vs Indeed — where Indian recruiters actually call from
22. How to get shortlisted for MNC jobs
23. Best time to update your Naukri profile (and how often)
24. 50 action verbs for Indian resumes (with examples)

**Optional city pages (month 4+, only if they can be genuinely useful):** "Resume writing service in Mumbai / Pune / Bengaluru / Hyderabad / Delhi NCR / Chennai" — include local hiring sectors, common roles, salary-range notes. No copy-paste between cities (thin duplicate pages hurt rankings).

> Claude can draft any of these pages straight into `site/pages/blog.mjs` — ask for 2 at a time.

---

## 4. On-page rules (already built in — keep following them)

- One clear H1 with the main keyword; title ≤ 60 characters; meta description with a benefit + price where relevant.
- **Answer in the first 2 sentences** (that's what Google snippets and AI engines quote).
- Question-style H2s ("How do I…?", "Why is…?") + an FAQ block with FAQ schema.
- Real numbers and examples (headline before/after, keyword lists) — AI engines prefer specific, checkable facts.
- Internal links: guide → service page → pricing → form. Keep the footer links.
- Every page has: form, WhatsApp button, price visibility, "no password on website" trust line.
- Update `site/static/llms.txt` and `SITE.updated` in `site/config.mjs` whenever you add pages.
- Never: fake reviews, fake numbers of clients, job guarantees. (Google penalises this, and it's a legal risk.)

---

## 5. GEO — getting quoted by ChatGPT, Gemini, Perplexity & Google AI Overviews

AI engines answer from pages they **can read**, **trust**, and that **state facts plainly**.

1. **Be crawlable** — done: static HTML, `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended; `llms.txt` summarises the business with prices.
2. **Bing Webmaster Tools** — ChatGPT search and Microsoft Copilot use Bing's index. Submit the sitemap there (Section 8).
3. **Consistent facts everywhere** — same name (GetShortlisted), same description, same prices on the site, Google Business Profile, LinkedIn, Instagram, YouTube. Add those profile URLs to `site/config.mjs → social` (they become `sameAs` in schema).
4. **Be mentioned on sites AI engines read a lot** — Reddit, Quora, LinkedIn articles, YouTube descriptions, Medium. Helpful answers that mention getshortlisted.in naturally (Section 6).
5. **Original data** — once you have 30+ clients, publish an anonymised mini-study: "We analysed 50 Naukri profiles: 7 mistakes that stop recruiter calls." Unique data is the #1 thing AI answers cite.
6. **Test monthly** — ask ChatGPT, Gemini and Perplexity: "best Naukri profile optimization service in India", "how to get calls from Naukri", "someone to apply jobs on my behalf India". Note if we appear; improve the page that should have answered.

---

## 6. Fast lead channels (weeks 1–8, while Google catches up)

These bring leads in days, not months. Always link to the site with UTM tags so we know what works, e.g.
`https://getshortlisted.in/?utm_source=instagram&utm_medium=reel&utm_campaign=naukri_tips`

| Channel | What to do | Effort |
|---|---|---|
| **Instagram Reels + YouTube Shorts** | 3 per week. 30-sec "Naukri mistake → fix" (screen recording of a blurred profile). Hook: "Applied to 100 jobs and no calls? It's probably this." CTA: "Get shortlisted — link in bio". | High impact |
| **LinkedIn (founder profile)** | 3 posts/week: before/after headlines, recruiter-search tips, client wins (with permission). Comment on job-seeker posts. | Medium |
| **Telegram & WhatsApp job groups** | Share one free tip per day + the website link. Don't spam; follow group rules. | Medium |
| **Reddit** (r/developersIndia, r/IndianWorkplace, r/india_jobs, r/Btechtards) | Answer "not getting calls" posts genuinely. Mention the site only when relevant and allowed by the subreddit's rules. | Low cost, high trust |
| **Quora** | Answer 5 questions/week on Naukri, resume, job switch. Link the matching guide. | Low |
| **College placement cells / alumni groups** | Offer a free "Naukri profile session" for final-year students → leads + backlinks from college sites. | Medium |
| **Refer & Earn 20%** | Live at /refer/. Ask every happy client to join and share their link — they earn ₹1,200–₹1,800 per referral. Track and pay with docs/REFERRALS.md. | Low |

---

## 7. Optional paid boost (fastest way to 100+ leads in month 1)

- **Google Ads (Search)** — only high-intent keywords: "naukri profile optimization", "naukri profile writing service", "resume writing service", "apply jobs on my behalf". Exact/phrase match. Send to `/pricing/` or the service page. Start ₹300–500/day; stop keywords that don't produce leads in 2 weeks.
- **Meta (Instagram/Facebook) click-to-WhatsApp ads** — 25–40 age, India metros, interests: Naukri, job search, LinkedIn. Creative: your best Reel. Start ₹300/day.
- Track cost per lead weekly. If a lead costs less than ~10% of the plan price you sell, keep scaling.

---

## 8. Tracking setup (pending — do these first)

1. **Google Search Console** → Add property → *Domain* → `getshortlisted.in` → verify with the DNS TXT record in Cloudflare → **Sitemaps** → submit `https://getshortlisted.in/sitemap.xml` → **URL Inspection** → Request indexing for `/`, `/pricing/`, `/naukri-profile-optimization/`, `/naukri-job-application-service/`.
2. **Bing Webmaster Tools** → *Import from Google Search Console* (1 click).
3. **Analytics** — pick one:
   - **Cloudflare Web Analytics** (free, no cookies, no banner needed): Cloudflare → Analytics & Logs → Web Analytics → Add site → automatic setup. *Recommended to start.*
   - **Google Analytics 4**: needs a small code change (Claude can add it + update the Content-Security-Policy) and a line in the Privacy Policy. Mark `generate_lead` as a key event (the form already fires it).
4. **Google Business Profile** — create as a *service-area business* (no public address), category "Career counselor" / "Resume service", add the website, WhatsApp and prices. Ask happy clients for Google reviews (real only).
5. **Lead source report** — in Cloudflare D1 console:
   `SELECT utm_source, plan, COUNT(*) AS leads FROM leads WHERE created_at > date('now','-30 day') GROUP BY 1,2 ORDER BY leads DESC;`

---

## 9. Conversion boosters (more leads from the same traffic)

- **Real testimonials** (WhatsApp screenshots with names blurred, written permission) — add a section on the home page as soon as you have 5. Biggest conversion lift available.
- **Before/after examples** — one Naukri headline + summary transformation per role (anonymised).
- **Reply to every lead within 1 hour** on WhatsApp during working hours — speed doubles conversion.
- **Response template**: greet → 3 specific problems you saw in their resume → recommend a plan → payment link.
- Show the price upfront and answer questions fast on WhatsApp — clear pricing + quick replies are what turn a form into a sale.

---

## 10. Monthly routine (1–2 hours)

1. Search Console → *Performance*: which queries get impressions but few clicks → improve that page's title/description.
2. Queries at position 8–20 → expand that guide (more examples, FAQ) to push it to page 1.
3. Lead report by `utm_source` and plan → double down on the best channel.
4. Ask ChatGPT / Gemini / Perplexity the 3 test questions (Section 5) → note results.
5. Publish 8 new pages (Section 3) and update `llms.txt`.
6. Check site health: `BASE=https://getshortlisted.in READONLY=1 npm test`.

---

## 11. Owner checklist

- [x] Email Routing on + verify the lead Gmail (lead emails)
- [ ] Google Search Console + sitemap
- [ ] Bing Webmaster Tools
- [ ] Cloudflare Web Analytics (or GA4)
- [ ] Google Business Profile
- [ ] Instagram, LinkedIn page, YouTube channel → send links to Claude for `config.mjs → social`
- [ ] First 5 testimonials (with permission)
- [ ] Optional: Turnstile bot check (send the site key to Claude)
- [ ] Make the GitHub repo private (this strategy is visible to competitors while the repo is public)

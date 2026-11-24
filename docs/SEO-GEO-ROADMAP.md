# GetShortlisted — SEO, GEO & AI-Search Roadmap

**Goal:** page 1 on Google and Bing, and be the answer ChatGPT / Gemini / Perplexity / Copilot give, for Naukri-profile and "not getting calls" searches in India.
**Written:** 24 Nov 2026, from a live audit of all 22 pages, Google India autocomplete (≈450 real searches incl. Hinglish) and a check of who ranks today.

---

## 1. Scorecard — what's already done

| Area | Status |
|---|---|
| Google Search Console — verified, sitemap **Success (22 pages)**, 5 pages requested | ✅ |
| Bing Webmaster + sitemap + **IndexNow** (instant Bing indexing; Bing also feeds ChatGPT search & Copilot) | ✅ |
| Google Analytics 4 (leads tracked with plan value) + Cloudflare Web Analytics | ✅ |
| Every page: unique title + description, canonical, single H1, breadcrumbs | ✅ |
| Structured data: Organization, Service + **Offer prices**, FAQPage, Article, Breadcrumb | ✅ |
| AI crawlers allowed (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended) + `llms.txt` | ✅ |
| Speed: 450 ms page load, **97% "Good" Core Web Vitals** for real visitors | ✅ |
| Content: 4 service/price pages + **10 guides** (≈800–1,200 words each, answer-first, FAQ) | ✅ |

## 2. Live audit — problems found

| # | Problem | Impact | Fix | Who |
|---|---|---|---|---|
| A1 | `www.getshortlisted.in` serves a full **duplicate** of the site (HTTP 200, no redirect) | Splits ranking strength between two hosts | Cloudflare → Rules → Redirect Rules → template **"Redirect from WWW to root"** | Owner (2 min) |
| A2 | `http://getshortlisted.in` does **not** redirect to `https://` | Duplicate + "Not secure" | Cloudflare → SSL/TLS → Edge Certificates → **Always Use HTTPS: On** | Owner (1 min) |
| A3 | New guides have only **1–2 internal links** pointing to them; `/resume-optimization/` and `/faq/` only 1 | Google treats them as unimportant; slow to rank | Home "Popular guides" block, "Related guides" on every guide, guide links from service pages | Claude |
| A4 | Home `<title>` is 79 characters (cut off at ~60 in results) | Weaker click-through | Shorten to ~58 | Claude |
| A5 | Money pages are thin: `/naukri-job-application-service/` ~540 words, `/resume-optimization/` ~370, `/pricing/` ~450 | Hard to rank against long guides | Expand to 1,000+ with real substance | Claude |
| A6 | **No social profiles** linked (`sameAs` empty) | AI engines and Google can't confirm we're a real brand (entity trust) | Create LinkedIn page, Instagram, YouTube → add links | Owner creates, Claude links |
| A7 | **About page is thin** (~280 words), no proof of expertise | Weak E-E-A-T (trust) — matters a lot for "paid service" searches | Rewrite with how we work (high level), who we help, guarantees we don't make, real numbers once available | Claude + owner facts |
| A8 | **Zero backlinks / reviews / mentions** | The #1 thing missing for page 1 | Section 5 | Owner + Claude |

## 2b. Speed / accessibility / on-page audit (25 Nov 2026)
Input: marketing manager's Seobility (on-page 84%, 74 problems — crawled 24 Nov 22:07 IST, before the www/http fix) and PageSpeed mobile 91 / a11y 97 / best 100 / SEO 100.
Measured with Lighthouse 12.8 (mobile, simulated slow 4G) on a slower laptop than Google's — compare before/after, not absolute numbers.

| Fix | Result |
|---|---|
| Google Fonts no longer render-blocking; stylesheet minified and inlined into each page (~22 KB gzipped HTML) | No render-blocking requests left |
| No fade-in on the hero headline (it's the LCP element); Analytics loads 1.2 s after page load | Home LCP 4.5 s → 2.9 s, guide 4.2 s → 2.7–2.9 s (lab, slow laptop) |
| WhatsApp green #0F7B40, link green #0E7A3F, no empty table headers, invalid ARIA removed | **Accessibility 100** on all pages tested (was 95–97) |
| Titles ≤ 60 chars, descriptions ≤ 158, heading order fixed (/blog/, /pricing/), no inline styles, unique link texts, Contact FAQ | Our Seobility-style checker: 0 issues left (Contact 421 words is fine) |
| Button shine via transform, colour shimmers stop after 2 loops | Less style/layout work on phones |

Lab performance on this laptop: 76 → 85–91 (6 pages). Re-check on https://pagespeed.web.dev (Google's machines) — expected mid/high 90s.
Real-user speed (Cloudflare Web Analytics): page load ~450 ms, 97% "Good" LCP — this field data is what Google ranks on.

## 3. Competition — who ranks today
- **Freelancers on Topmate** (₹149–₹599 per session), small career blogs (resumevera, stylingcv, unboxcareer, jobrise, goodspace), **Naukri's own blog and paid services**.
- Naukri's paid services have **many negative reviews** ("paid, still no calls") on Trustpilot and consumer-complaint sites → people actively search for alternatives.
- **Naukri Neo / Naukri360 Pro** — Naukri's AI auto-apply agent — directly competes with our Done-For-You plan; searches: *naukri neo review / price / reddit*, *naukri 360 pro review / vs naukri pro*.
- Forums (Reddit, Fishbowl, Blind, Quora) appear for almost every query → AI answers lean on them.
- **No strong, trusted "done-for-you" brand owns this space yet** — that's our opening.

## 4. New keyword opportunities found today
| Theme | Real searches | Plan |
|---|---|---|
| **Hinglish** 🔥 | naukri profile kaise banaye, naukri com par job kaise paye, resume kaise banaye mobile se / job ke liye, naukri kaise milegi | 3–4 Hindi/Hinglish guides (`/hi/...`) — almost no quality competition |
| **Naukri's AI tools** 🔥 | naukri neo review/price/reddit, naukri 360 pro review/price, naukri 360 vs naukri pro | Honest guide: "Naukri Neo / 360 Pro vs a human service" |
| **Reviews** | naukri paid profile review, naukri power profile review, naukri profile highlighter review | Extend the paid-services guide with these terms |
| **Service** | naukri profile optimization service, how to improve naukri profile | Strengthen service page + internal links |
| Still open from earlier | how to get interview calls from naukri (freshers / experienced), linkedin vs naukri, resume writing services in {city} | Content batch 3 |

## 5. The roadmap (priority order)

### P0 — Technical fixes (this week, ~1 hour total)
- ☑ A1 www → root redirect (301, query kept) · ☑ A2 Always Use HTTPS — done & tested 24 Nov
- ☑ Old workers.dev URL + preview URLs turned off in wrangler.jsonc (24 Nov) — no duplicate copies left
- ☑ A4 home title (61 chars, 25 Nov)
- ☐ Submit new/changed URLs to IndexNow + "Request indexing" in Search Console after each batch

### P1 — Internal linking & money pages (Claude, ~1 day)
- ☑ Home: "Popular guides" section (6 guides) — 25 Nov
- ☑ Every guide: "Related guides" (3 links) — 25 Nov (guides went from 1 internal link to 2–10)
- ☑ Service pages: "Helpful guides" (3 each) + resume page linked from 4 guides — 25 Nov
- ☑ Expanded DFY (537→845 words of main content: who it's for, how the month works, comparison, what we never do), Resume (367→632: ATS explainer, before/after, deliverables), Pricing (447→665: options comparison, what happens next) — 25 Nov
- ☑ About rewritten for trust (283→565 words: what we do, how we work, promises, who we help, why Naukri) — 25 Nov

### P2 — Content batch 3 (Claude, 2–3 pages per session, owner approves)
1. ☐ Naukri Neo & Naukri360 Pro vs a human service — honest comparison
2. ☐ Hinglish: *Naukri profile kaise banaye (2026)*
3. ☐ Hinglish: *Naukri par call nahi aa rahe? 9 kaaran aur solution*
4. ☐ How to get interview calls from Naukri — freshers & experienced
5. ☐ LinkedIn vs Naukri — which gets more calls in India
6. ☐ Resume writing services in Mumbai / Pune / Bengaluru / Delhi NCR (only if genuinely local)

Rule (owner): publish the *what* and *why*, never our *how* (process, templates, keyword method).

### P3 — Authority: backlinks, reviews, brand (owner-led, Claude drafts)
This is what moves a new site from page 3 to page 1.
- ☐ **Google Business Profile** (service-area business, India) + ask every happy client for a Google review
- ☐ **Social profiles**: LinkedIn company page, Instagram, YouTube — same name, logo, description, link → Claude adds them to the site schema
- ☐ **Influencer videos**: every video description links to `getshortlisted.in` (or a referral link) — real backlinks + brand searches
- ☐ Listings: JustDial, Sulekha, Crunchbase, Topmate (as a funnel), Clutch/GoodFirms-style directories
- ☐ **Reddit / Quora / LinkedIn**: answer "not getting calls from Naukri" threads helpfully (no spam), link the matching guide — AI engines quote these heavily
- ☐ Guest posts / PR: college placement cells, career blogs, a "Naukri calls" data story for news sites

### P4 — GEO / AI answers (Claude + owner, ongoing)
- ☐ Add `sameAs` + consistent business facts everywhere (after P3 profiles exist)
- ☐ Each guide: 2-sentence direct answer at the top (done) + a short "Key facts" list AI can quote
- ☐ **Original data**: after ~50 clients, publish "We analysed 500 Naukri profiles: the 7 mistakes behind zero calls" (anonymised) — the single most-cited type of content in AI answers
- ☐ Monthly AI check: ask ChatGPT, Gemini, Perplexity, Copilot our 6 test questions; track if we're named (Bing Webmaster → *AI Performance* shows Copilot citations)

**Test questions:** "best naukri profile optimization service in india" · "why am i not getting calls from naukri" · "how to get shortlisted on naukri" · "is naukri fastforward worth it" · "someone to apply jobs on my behalf india" · "naukri profile kaise banaye"

## 6. How we'll measure (monthly)
| Metric | Where | Target by month 3 |
|---|---|---|
| Pages indexed | Search Console → Pages | All (22+) |
| Search impressions / clicks | Search Console → Performance | Growing month on month |
| Average position for top 10 keywords | Search Console | Top 20 → top 10 |
| Brand searches ("getshortlisted") | Search Console | Appear after influencer videos |
| Leads by source | Google Analytics → generate_lead | Organic share growing |
| AI citations | Bing → AI Performance + manual check | First mentions |

## 7. Honest expectations
- Technical fixes and internal links help within **days to weeks**.
- New pages usually take **4–12 weeks** to settle in Google; Hinglish and Naukri-Neo topics may be faster (less competition).
- **Page 1 for competitive terms needs backlinks, reviews and brand searches (P3)** — content alone won't do it. The influencer campaign is the biggest accelerator we have.

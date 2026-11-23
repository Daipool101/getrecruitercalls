# GetShortlisted — Influencer Launch Plan

**Goal:** be ready for influencer videos (1–2M views each on Instagram, Facebook, YouTube), capture every lead, take payments with Razorpay, and rank on Google + Bing + AI answers.
**Written:** 23 Nov 2026 · Keep this file updated as items are done (☐ → ☑).

---

## 0. What a 1–2M-view video actually means

| | Estimate per video |
|---|---|
| Views | 1–2 million |
| Clicks to the site (0.5–2%) | **5,000 – 40,000 visitors**, mostly within 48 hours, ~90% on phones |
| Form fills (3–6%) | **150 – 2,400 leads** |
| WhatsApp chats | Several hundred to a few thousand |

The website pages are pre-built files on Cloudflare's global network — they handle this easily. The **backend (forms, uploads, emails, payments)** and **the team's WhatsApp replies** are where things break. Phase 1 fixes the backend.

---

## Phase 1 — Make it unbreakable (before any video goes live) 🔴

| # | Item | Why | Who |
|---|---|---|---|
| 1.1 | ☐ **Upgrade to Cloudflare Workers Paid ($5/month)** | Free plan = 100k backend requests/day and a tiny CPU budget per request. Resume uploads + email building can exceed it under load → failed form submits. Paid = 10M requests/month, 30s CPU. | Owner (Cloudflare → Workers & Pages → Plans) |
| 1.2 | ☑ **Fix the per-IP limit** (done 23 Nov — ceiling now 300/hour per network; 292 people on one shared IP accepted in tests) | Jio/Airtel put thousands of phones behind one IP. 20/hour per IP would block real people during a spike. Replace with: Turnstile bot check + per-phone duplicate check + a high IP ceiling (~300/hour). | Claude |
| 1.3 | ☐ **Turn on Turnstile** (free, invisible) | Stops bots and spam floods once the site is famous. | Owner creates the widget (2 min), Claude wires it |
| 1.4 | ☑ **Faster database start-up** (done — 1 quick check instead of ~15) | Today every new server instance runs ~15 schema checks before its first lead. Move to proper migrations + a one-line version check. | Claude |
| 1.5 | ☑ **Duplicate-lead guard** (done — same mobile within 10 min = one lead, one email) | Same phone submitting twice in 10 min → one lead, one email (people double-tap on slow networks). | Claude |
| 1.6 | ☑ **Load test** (done — see results below) | Simulate ~200 form submits/minute on a preview copy; confirm no errors and emails keep flowing. | Claude |
| 1.7 | ☐ **Per-influencer tracking links** | Give each influencer their own link, e.g. `getshortlisted.in/?utm_source=instagram&utm_campaign=riya` — or make each influencer a **referral partner** so their leads and payouts are tracked automatically. | Owner + Claude |
| 1.8 | ☐ **WhatsApp readiness** — *later (owner)* | Use the WhatsApp **Business** app with quick replies (price, process, payment link) and labels (New / Paid / In progress). Hundreds of chats/day need templates. | Owner |
| 1.9 | ☐ **Uptime alert** | Free monitor (e.g. UptimeRobot) on `/api/health` → SMS/email if the form backend fails. | Owner (Claude gives steps) |

### Phase 1 results (23 Nov 2026)
| Test | Result |
|---|---|
| Local full system: 3,000 visitors, 150 at once, 11,200 requests, 750 form fills (375 with 300 KB resumes) | **0 failures** — every lead, resume and notification email saved |
| Live site pages (Cloudflare network): 1,500 visitors, 150 at once, 5,000 requests | **0 failures**, ~200 req/s (limited by the tester's internet, not Cloudflare) |
| Shared mobile network (one IP, many people) | 292 accepted (old rule allowed only 20) |
| Resume email encoding | 6× faster (300 KB resume: 17 ms → 3 ms CPU), attachments byte-identical |
| 1M visitors in 12 hours ≈ 23 visitors/s average, ~200–400/s at peaks | Pages: no limit on Cloudflare. Backend: ~1–10 form submits/s at peak — well within tested capacity |

**Still recommended before the first video:** Workers Paid ($5/month) — removes the 100k/day backend cap and the 10 ms CPU limit per request (largest resumes need ~17 ms even after the speed-up). Owner decides when.
Re-run any time: `node tests/load.mjs --base http://127.0.0.1:8787 --visitors 3000 --concurrency 150` (local) or `--base https://getshortlisted.in --pages-only` (live, safe).

---

## Phase 2 — Google, Bing & analytics (this week) 🟠

| # | Item | Notes |
|---|---|---|
| 2.1 | ☐ **Google Search Console** — Domain property `getshortlisted.in`, verify via Cloudflare, submit `sitemap.xml`, request indexing for 5 main pages | Steps already shared; sitemap is live with 16 URLs |
| 2.2 | ☐ **Bing Webmaster Tools** — *Import from Google Search Console* | Bing also powers ChatGPT search and Copilot |
| 2.3 | ☑ **IndexNow** — key file live; run `npm run indexnow` after each deploy (done 24 Nov) | Claude |
| 2.4 | ◐ **Analytics**: code + privacy policy ready (24 Nov). Owner: enable Cloudflare Web Analytics (1 click) and create a GA4 property → send the `G-…` ID; Claude pastes it into `site/config.mjs → ga4Id` | Owner → Claude |
| 2.5 | ☐ **Google Business Profile** (service-area business) | Owner |

---

## Phase 3 — Razorpay payments + customer emails 🟠

### The flow
```
Form (name, phone, email, resume, plan, referral)
   → lead saved + Nishit emailed  (works even if they never pay)
   → "Pay ₹6,000 / ₹9,000" → Razorpay Checkout (UPI, cards, netbanking, wallets)
   → payment verified on our server (signature check) + Razorpay webhook as backup
   → /welcome/ page (secure one-time link): Naukri login email + password, target cities, notice period, preferences
   → Emails to the customer:
        1. Payment confirmed (Razorpay also sends its own receipt)
        2. "We've got your details" — summary of what they shared, what we're doing now,
           when we'll finish, and the DAILY STEPS they must follow (below)
   → Nishit emailed: "PAID ₹9,000 — Name — credentials received"  + referral commission auto-marked payable
```

### Daily steps email for customers (draft)
1. Open Naukri once a day (morning 9–11 am is best) — recruiters see recently active profiles first.
2. Answer recruiter calls and reply to messages within a few hours.
3. Don't change the headline, key skills or summary we wrote without telling us.
4. Keep notice period, salary and preferred cities up to date.
5. Don't apply to unrelated roles from your account (Done-For-You: we handle applications).
6. Tell us on WhatsApp about every interview — we'll prepare you.

### Security for the Naukri password page (important)
- Page is **not linked anywhere**, `noindex`, opens only from a one-time link given after verified payment.
- Password is **encrypted before it's stored** (AES-GCM, key kept as a Cloudflare secret) and **never sent by email**.
- Nishit views it in a private **Admin page** protected by Cloudflare Access (free, login with his Gmail + one-time code).
- Auto-delete credentials 30 days after the work ends; the customer is told to change the password afterwards.
- Why so careful: a public page asking for another brand's password can be flagged by Google as phishing — that would show a red warning on the whole domain.

### What's needed
| Item | Who |
|---|---|
| ☐ Razorpay account + KYC (PAN, bank account; GST if registered) | Owner |
| ☐ Razorpay **Test** keys first, then **Live** keys + webhook secret → added as Cloudflare secrets | Owner |
| ☐ Customer email service: **Resend** (recommended, simple, ~$20/month for 50k emails; free tier is only 100/day) or **Brevo** (free 300/day) — verify `getshortlisted.in` with DNS records | Owner + Claude |
| ☐ Build: checkout, verification, webhook, /welcome/ page, encryption, emails, Admin page | Claude |
| ☐ Refund & cancellation policy page (Razorpay requires it) | Claude drafts, owner approves |
| ☐ End-to-end test in Razorpay Test mode, then one real ₹1 test | Both |

---

## Phase 4 — Content to reach page 1 (ongoing) 🟢

### What people actually search (Google India autocomplete, 23 Nov 2026)
Real suggestions Google shows — this is how our audience types:

| Theme | Real searches | Our page today |
|---|---|---|
| **No calls** | not getting calls from naukri (+ *reddit*, *quora*, *2026*, *and linkedin*), not getting a single call from naukri, why recruiters not calling me | ✅ Guide exists — needs freshers/experienced sections + 2026 refresh |
| **Get calls** | how to get calls from naukri for experienced / for freshers, how to get interview calls from naukri, how to get recruiter calls from naukri | ⚠️ Covered only inside other pages → new guide |
| **Brand match** | **how to get shortlisted in naukri com**, how to get shortlisted for interview | ❌ Missing — must own this (it's our name) |
| **AI prompts** 🔥 | naukri profile optimization prompt, chatgpt prompt for naukri profile optimization, claude prompt for naukri profile | ❌ Missing — new, fast-growing; free prompts page → "or let experts do it" |
| **Score / checker** | naukri resume score, naukri resume checker, naukri resume analyzer, ats resume score checker | ⏸ Owner decision: no AI scoring. A simple resume checker may come later — not now |
| **Paid services** | naukri paid services cost / review / for 3 months, is naukri fastforward worth it, naukri premium worth it | ❌ Missing — honest comparison guide; we're the alternative |
| **Hire someone** | hire / pay someone to apply for jobs (+reddit), job application services india | ⚠️ Service page exists — add these phrases + trust FAQ |
| **Summary** | naukri profile summary for freshers / experienced / software developer / data engineer / production engineer | ❌ Missing — examples guide |
| **Key skills** | naukri key skills examples, key skills limit, key skills not matching, key skills vs IT skills | ❌ Missing |
| **Headline** | resume headline for fresher (12th pass), for naukri, for experienced, teaching, accountant, sales executive | ✅ Guide exists — add these roles |
| **Keep fresh** | naukri profile update time, naukri profile refresh, naukri profile auto updater | ❌ Missing — "best time to update + daily routine" (warn against auto-updater extensions) |
| **Naukri vs** | linkedin vs naukri which is better / for recruiters / for job seekers, naukri vs indeed | ⚠️ Home section exists — needs its own guide |
| **City** | resume writing services in mumbai / pune / delhi / bangalore / near me | ❌ Missing — 4–6 genuinely local pages |
| **Formats** | best resume format for freshers / experienced, ats friendly resume template | ✅ ATS guide exists — add free template download |

### Fixes to existing pages (quick wins)
1. ☐ Home H1 has no "Naukri": change to **"Get shortlisted on Naukri. Get recruiter calls — in about a week."**
2. ☐ `/naukri-profile-optimization/` is only ~900 words for our #1 money keyword → expand to 1,500+ (process, before/after example, what changes, price, safety, FAQs incl. "service price", "is it safe to share Naukri login").
3. ☐ `/resume-optimization/` (~770 words) → expand; add "resume writing service price in India".
4. ☐ `/pricing/` H1 → "Naukri Profile Optimization Price & Plans".
5. ☐ Refresh `/blog/not-getting-calls-from-naukri/` with "for freshers" / "for experienced" / "not a single call" sections and a short Reddit-style real answer.
6. ☐ Add HowTo schema to step-by-step guides; keep "Updated" dates current.

### New pages — priority order
| P | Page | Main searches |
|---|---|---|
| 1 | How to get shortlisted on Naukri (2026) | how to get shortlisted in naukri com |
| 1 | ChatGPT & Claude prompts for Naukri profile optimization | naukri profile optimization prompt |
| 1 | Naukri paid services: FastForward vs Premium vs GetShortlisted — worth it? | naukri paid services cost, is fastforward worth it |
| 2 | How to get interview calls from Naukri (freshers & experienced) | how to get calls from naukri for experienced/freshers |
| 2 | ☑ Naukri profile summary examples (freshers, experienced, 10 roles) — live 24 Nov | naukri profile summary for … |
| 2 | ☑ Naukri key skills: examples, limit, not matching, key vs IT skills — live 24 Nov | naukri key skills … |
| 2 | ☑ Best time to update Naukri profile + daily routine — live 24 Nov | naukri profile update time / refresh / auto updater |
| 3 | LinkedIn vs Naukri: which gets you more calls? | linkedin vs naukri which is better |
| 3 | Resume writing services in Mumbai / Pune / Bengaluru / Delhi NCR | resume writing services in {city} |

### GEO (AI answers) — how to get quoted by ChatGPT / Gemini / Perplexity
- Google's suggestions show people append **"reddit"** and **"quora"** → AI engines lean on those. Answer real threads helpfully (founder/team account), link the matching guide.
- Every guide: direct answer in the first 2 sentences, numbered steps, a table, FAQ — easy for AI to quote.
- Publish original data once we have 50+ clients ("We analysed 500 Naukri profiles: 7 mistakes…").
- Keep `llms.txt`, schema and prices consistent everywhere.
- Monthly: ask ChatGPT/Gemini/Perplexity our 5 test questions and note if we're cited.

**Honest expectation:** page 1 for high-volume terms takes 3–6 months for a new domain. Influencer traffic + brand searches ("getshortlisted") + reviews will speed this up a lot — Google notices when people search for you by name.

---

## Done 24 Nov 2026
- ☑ Prices → **₹5,999** (Profile Makeover) and **₹8,999** (Done-For-You). Referral commission stays ₹1,200 / ₹1,800.
- ☑ Partner dashboard on /refer/ ("Check my referrals", mobile + email): friends referred, paying clients, earned, paid out, recent list. Statuses: pending → earned (client paid) → paid (partner paid). See docs/REFERRALS.md.
- ☑ Copy: home H1 now says "on Naukri"; pricing H1 = "Naukri Profile Optimization Price & Plans"; /naukri-profile-optimization/ expanded (why profiles get ignored, before/after, how it works).
- ☑ New guides: /blog/how-to-get-shortlisted-on-naukri/, /blog/chatgpt-prompts-for-naukri-profile/, /blog/naukri-paid-services-worth-it/ (share the *what* and *why*, never our *how*).

## Later / to-do (owner decisions, 23–24 Nov 2026)
- ⏸ **Uptime alert (1.9)** — free UptimeRobot email/app alert; owner sets up when ready (no SMS, no cost).
- ⏸ **WhatsApp Business** — owner is buying a separate business SIM.
- ⏸ **Razorpay + customer emails (Phase 3)** — review later, then build.
- ⏸ **WhatsApp Business app + quick-reply templates** — later.
- ⏸ **Resume checker** — maybe later, **no AI scoring**.
- ⏸ **Cloudflare Workers Paid ($5/month)** — owner upgrades when ready (recommended before the first video).
- ☐ **Copywriting upgrade across the site + 2–3 new pages** — Claude proposes each page with *why* and *expected impact* first; owner approves before building.

## Suggested order
1. **Phase 1** (1.1, 1.2, 1.3, 1.5 first) — before any influencer video is published.
2. **Phase 2** in parallel (owner clicks; ~1 hour total).
3. **Phase 3** Razorpay — as soon as test keys are available (≈ 2–3 days of build + testing).
4. **Phase 4** content — quick wins immediately, then 2–3 new pages per week; the Score tool before the first video if possible.

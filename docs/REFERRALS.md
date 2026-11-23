# Refer & Earn — how it works and how to pay partners

**Partners earn 20%** of the plan their friend buys: **₹1,200** on Profile Makeover (₹5,999), **₹1,800** on Done-For-You Job Search (₹8,999). Pay only **after the referred client has paid you**.

## The flow

1. **Partner signs up** at <https://getshortlisted.in/refer/> — name, WhatsApp number, Google Pay / UPI number, email.
   - Their **code = first name in capitals** (AKASH). If taken → AKASH2, AKASH3 …
   - Same mobile number again → they get their **existing code** back (this is also "forgot my code").
   - Nishit gets an email: **"New referral partner: Akash Sharma (AKASH)"** with their GPay number.
2. **Partner shares** their link `https://getshortlisted.in/?ref=AKASH` (WhatsApp share button on the page).
   - Anyone who opens the link has the code **remembered for 30 days** and pre-filled in every form ("✓ Referred by Akash").
3. **Client fills any form** — the "Referred by someone?" box takes a **code or the partner's full name**.
4. **Lead email** to Nishit shows the source in the subject and at the top:

| Subject starts with | Meaning | Commission |
|---|---|---|
| `[Organic]` | Nobody referred them | — |
| `[Referral: AKASH]` | Matched to a partner (by code, link or exact full name) | 20%, shown in the email, status **pending** |
| `[Referral — not verified]` | Typed a name/code we couldn't match (or 2 partners have that exact name) | None yet — ask the client who referred them, then fix it (query below) |
| `[Self-referral (no commission)]` | Partner used their own code (same mobile) | None |

If a client types just "Akash" and there are both AKASH and AKASH2, it's credited to AKASH and the email says *"2 partners share this first name — confirm with the client."*

## Track and pay commissions (Cloudflare → D1 → getrecruitercalls-db → Console)

### Status of each referral (`leads.commission_status`)
| Status | Meaning | Partner sees |
|---|---|---|
| `pending` | Friend filled the form, hasn't paid yet | "Form filled" |
| `earned` | **Friend paid us** → we owe the partner | "Paid — you've earned ₹…" |
| `paid` | We sent the partner their money | "Paid to you" |
| `cancelled` | Friend didn't buy | "Didn't join" |

Until Razorpay is connected, mark it yourself when a referred client pays:
```sql
UPDATE leads SET commission_status = 'earned' WHERE id = 123;
```

Partners see their own dashboard at /refer/ → **"Check my referrals"** (mobile + email must both match).

**Commissions to pay** (client has paid you → pay the partner):
```sql
SELECT l.id, l.created_at, l.name AS client, l.plan, l.commission_inr, l.commission_status,
       r.name AS partner, r.code, r.upi_phone AS gpay
FROM leads l JOIN referrers r ON r.id = l.referrer_id
WHERE l.lead_source = 'referral' AND l.commission_status = 'earned'
ORDER BY l.id DESC;
```

**After you send the money on Google Pay** (replace 123 with the lead id):
```sql
UPDATE leads SET commission_status = 'paid' WHERE id = 123;
```

**Client didn't buy** → no commission:
```sql
UPDATE leads SET commission_status = 'cancelled' WHERE id = 123;
```

**Fix an unverified referral** once the client confirms (lead 123, partner code AKASH, plan price × 20%):
```sql
UPDATE leads
SET lead_source = 'referral', referral_code = 'AKASH',
    referrer_id = (SELECT id FROM referrers WHERE code = 'AKASH'),
    commission_inr = CASE plan WHEN 'done-for-you' THEN 1800 ELSE 1200 END,
    commission_status = 'pending'
WHERE id = 123;
```

**Earnings per partner** (leaderboard):
```sql
SELECT r.code, r.name, r.upi_phone AS gpay,
       COUNT(l.id) AS referred,
       SUM(CASE WHEN l.commission_status = 'earned' THEN l.commission_inr ELSE 0 END) AS to_pay,
       SUM(CASE WHEN l.commission_status = 'paid'    THEN l.commission_inr ELSE 0 END) AS paid
FROM referrers r LEFT JOIN leads l ON l.referrer_id = r.id AND l.lead_source = 'referral'
GROUP BY r.id ORDER BY referred DESC;
```

**Organic vs referral leads, last 30 days:**
```sql
SELECT COALESCE(lead_source, 'organic') AS source, COUNT(*) AS leads
FROM leads WHERE created_at > date('now', '-30 day') GROUP BY 1;
```

**All partners:** `SELECT code, name, phone, upi_phone, email, created_at FROM referrers ORDER BY id DESC;`

## Changing the % or prices
- Percentage: `site/config.mjs → REFERRAL_PERCENT` **and** `src/referral.js → REFERRAL_RATE`.
- Prices: `site/config.mjs → PLANS` **and** `src/referral.js → PLAN_PRICES` (+ labels in `src/worker.js → PLANS`).
- `npm run test:unit` fails if the website prices and the commission prices drift apart.

## Tests
- `npm run test:unit` — 14 unit tests for code generation, matching, self-referral and commission maths.
- `npm test` (with `npm run dev` running) — end-to-end: partner sign-up, duplicate phone, AKASH2, bad input, code lookup, and every lead tag.

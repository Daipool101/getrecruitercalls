/**
 * Referral programme — pure helpers (no Cloudflare imports, so they are unit-testable with plain Node).
 *
 * Rules
 *  - A partner's referral code is their first name in capitals (AKASH). If taken: AKASH2, AKASH3, …
 *  - A lead can type a code OR the partner's full name. We match code first, then exact full name.
 *  - Commission = 20% of the plan price, payable only after the referred client pays.
 *  - A partner cannot earn on their own lead (same mobile number) → "self-referral".
 */

export const REFERRAL_RATE = 0.2;
// Keep in sync with site/config.mjs → PLANS.
export const PLAN_PRICES = { makeover: 6000, "done-for-you": 9000 };

export const SOURCE = {
  ORGANIC: "organic",
  REFERRAL: "referral",
  UNVERIFIED: "referral-unverified",
  SELF: "self-referral",
};

export const SOURCE_LABEL = {
  [SOURCE.ORGANIC]: "Organic",
  [SOURCE.REFERRAL]: "Referral",
  [SOURCE.UNVERIFIED]: "Referral — not verified",
  [SOURCE.SELF]: "Self-referral (no commission)",
};

/** 10-digit Indian mobile, or "" if invalid. Accepts +91 / 91 / 0 prefixes, spaces and dashes. */
export function localMobile(s) {
  const d = String(s || "").replace(/\D/g, "");
  const local = d.length === 12 && d.startsWith("91") ? d.slice(2) : d.length === 11 && d.startsWith("0") ? d.slice(1) : d;
  return /^[6-9]\d{9}$/.test(local) ? local : "";
}

/** Letters-only first name in capitals, 2–12 chars. Falls back to "REF" (e.g. non-Latin names). */
export function codeBase(name) {
  const first = String(name || "").trim().split(/\s+/)[0] || "";
  const letters = first.normalize("NFKD").replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 12);
  return letters.length >= 2 ? letters : "REF";
}

/** AKASH, AKASH2, AKASH3, … */
export function codeCandidates(name, count = 60) {
  const base = codeBase(name);
  return [base, ...Array.from({ length: count - 1 }, (_, i) => `${base}${i + 2}`)];
}

/** What a visitor typed, if it looks like a referral code ("akash", " Akash2 ") → "AKASH2"; otherwise "". */
export function normalizeCode(s) {
  const t = String(s || "").trim().toUpperCase().replace(/\s+/g, "");
  return /^[A-Z]{2,12}\d{0,3}$/.test(t) ? t : "";
}

/** Collapse whitespace, strip control characters, cap length. */
export function cleanReferralInput(s) {
  return String(s || "").replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
}

/** 20% of the plan price (whole rupees), 0 for unknown plans. */
export function commissionFor(plan) {
  const price = PLAN_PRICES[plan];
  return price ? Math.round(price * REFERRAL_RATE) : 0;
}

export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

/**
 * Decide how a lead is tagged.
 * @param input        what the visitor typed in "Referral code or friend's name" (cleaned)
 * @param byCode       partner row whose code equals normalizeCode(input), or null
 * @param byName       partner rows whose full name equals input (case-insensitive)
 * @param sameBaseCount how many partners share the first-name base of the typed code (AKASH, AKASH2 → 2)
 * @param leadPhone    the lead's mobile number
 * @param plan         the lead's chosen plan id
 * @returns {{ source, referrer, note, commission }}
 */
export function classifyReferral({ input, byCode = null, byName = [], sameBaseCount = 0, leadPhone = "", plan = "" }) {
  if (!input) return { source: SOURCE.ORGANIC, referrer: null, note: "", commission: 0 };

  let referrer = null;
  let note = "";
  if (byCode) {
    referrer = byCode;
    // "AKASH" typed while AKASH2 also exists → credit AKASH but ask the owner to double-check.
    if (!/\d$/.test(normalizeCode(input)) && sameBaseCount > 1) note = `${sameBaseCount} partners share this first name — confirm with the client.`;
  } else if (byName.length === 1) {
    referrer = byName[0];
    note = "Matched by full name.";
  } else if (byName.length > 1) {
    return { source: SOURCE.UNVERIFIED, referrer: null, note: `${byName.length} partners have this name — ask the client for the code.`, commission: 0 };
  } else {
    return { source: SOURCE.UNVERIFIED, referrer: null, note: "No partner with this code or name — check with the client.", commission: 0 };
  }

  const leadLocal = localMobile(leadPhone);
  if (leadLocal && localMobile(referrer.phone) === leadLocal) {
    return { source: SOURCE.SELF, referrer, note: "Partner referred themselves — no commission.", commission: 0 };
  }
  return { source: SOURCE.REFERRAL, referrer, note, commission: commissionFor(plan) };
}

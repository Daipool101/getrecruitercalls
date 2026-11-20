// Unit tests for the referral logic (no server needed). Run: npm run test:unit
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  localMobile, codeBase, codeCandidates, normalizeCode, cleanReferralInput, commissionFor, classifyReferral, SOURCE, PLAN_PRICES,
} from "../src/referral.js";
import { PLANS } from "../site/config.mjs";

test("localMobile accepts common Indian formats", () => {
  assert.equal(localMobile("9876543210"), "9876543210");
  assert.equal(localMobile("+91 98765 43210"), "9876543210");
  assert.equal(localMobile("09876543210"), "9876543210");
  assert.equal(localMobile("91-9876543210"), "9876543210");
  assert.equal(localMobile("12345"), "");
  assert.equal(localMobile("5876543210"), ""); // must start 6-9
  assert.equal(localMobile(""), "");
});

test("codeBase uses the first name, letters only, capitals", () => {
  assert.equal(codeBase("Akash Jaiswal"), "AKASH");
  assert.equal(codeBase("  priya   sharma "), "PRIYA");
  assert.equal(codeBase("O'Brien"), "OBRIEN");
  assert.equal(codeBase("José"), "JOSE");
  assert.equal(codeBase("Supercalifragilistic"), "SUPERCALIFRA"); // capped at 12
  assert.equal(codeBase("अमित"), "REF"); // non-Latin → fallback
  assert.equal(codeBase("A"), "REF");
  assert.equal(codeBase(""), "REF");
});

test("codeCandidates gives AKASH, AKASH2, AKASH3…", () => {
  const c = codeCandidates("Akash", 4);
  assert.deepEqual(c, ["AKASH", "AKASH2", "AKASH3", "AKASH4"]);
});

test("normalizeCode recognises codes and rejects names/junk", () => {
  assert.equal(normalizeCode(" akash "), "AKASH");
  assert.equal(normalizeCode("Akash2"), "AKASH2");
  assert.equal(normalizeCode("akash jaiswal"), "AKASHJAISWAL"); // space-joined still code-shaped
  assert.equal(normalizeCode("a"), "");
  assert.equal(normalizeCode("akash@x"), "");
  assert.equal(normalizeCode("AKASH12345"), "");
  assert.equal(normalizeCode(""), "");
});

test("cleanReferralInput trims, collapses spaces, strips control chars, caps length", () => {
  assert.equal(cleanReferralInput("  Akash \n  Jaiswal\t"), "Akash Jaiswal");
  assert.equal(cleanReferralInput("x".repeat(200)).length, 80);
  assert.equal(cleanReferralInput("Ak\u0000ash"), "Akash");
});

test("commission is 20% of the plan price and matches the website prices", () => {
  assert.equal(commissionFor("makeover"), 1200);
  assert.equal(commissionFor("done-for-you"), 1800);
  assert.equal(commissionFor("unknown"), 0);
  for (const p of PLANS) assert.equal(PLAN_PRICES[p.id], p.price, `price for ${p.id} out of sync with site/config.mjs`);
});

const akash = { id: 1, code: "AKASH", name: "Akash Jaiswal", phone: "9324700000" };

test("no input → organic", () => {
  const r = classifyReferral({ input: "", plan: "makeover" });
  assert.equal(r.source, SOURCE.ORGANIC);
  assert.equal(r.commission, 0);
});

test("valid code → referral with 20% commission", () => {
  const r = classifyReferral({ input: "akash", byCode: akash, sameBaseCount: 1, leadPhone: "9876543210", plan: "done-for-you" });
  assert.equal(r.source, SOURCE.REFERRAL);
  assert.equal(r.referrer.code, "AKASH");
  assert.equal(r.commission, 1800);
  assert.equal(r.note, "");
});

test("bare first name while AKASH2 exists → credited but flagged", () => {
  const r = classifyReferral({ input: "Akash", byCode: akash, sameBaseCount: 2, leadPhone: "9876543210", plan: "makeover" });
  assert.equal(r.source, SOURCE.REFERRAL);
  assert.match(r.note, /2 partners share this first name/);
});

test("explicit numbered code is not flagged", () => {
  const akash2 = { ...akash, id: 2, code: "AKASH2", phone: "9000000000" };
  const r = classifyReferral({ input: "AKASH2", byCode: akash2, sameBaseCount: 2, leadPhone: "9876543210", plan: "makeover" });
  assert.equal(r.note, "");
});

test("full name match → referral", () => {
  const r = classifyReferral({ input: "Akash Jaiswal", byName: [akash], leadPhone: "9876543210", plan: "makeover" });
  assert.equal(r.source, SOURCE.REFERRAL);
  assert.equal(r.commission, 1200);
});

test("ambiguous full name → unverified, no commission", () => {
  const r = classifyReferral({ input: "Akash Jaiswal", byName: [akash, { ...akash, id: 9 }], leadPhone: "9876543210", plan: "makeover" });
  assert.equal(r.source, SOURCE.UNVERIFIED);
  assert.equal(r.commission, 0);
  assert.equal(r.referrer, null);
});

test("unknown code/name → unverified, text kept for the owner", () => {
  const r = classifyReferral({ input: "Rahul from office", leadPhone: "9876543210", plan: "makeover" });
  assert.equal(r.source, SOURCE.UNVERIFIED);
  assert.match(r.note, /No partner/);
});

test("partner using own code → self-referral, no commission", () => {
  const r = classifyReferral({ input: "AKASH", byCode: akash, sameBaseCount: 1, leadPhone: "+91 93247 00000", plan: "done-for-you" });
  assert.equal(r.source, SOURCE.SELF);
  assert.equal(r.commission, 0);
});

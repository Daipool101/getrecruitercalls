import { faqList, faqSchema, breadcrumbSchema, breadcrumbs, esc, waButton } from "../layout.mjs";
import { SITE, PLANS, inr, REFERRAL_PERCENT } from "../config.mjs";

const earn = (p) => Math.round((p.price * REFERRAL_PERCENT) / 100);

const FAQS = [
  { q: "How much do I earn?", a: `<p>${REFERRAL_PERCENT}% of the plan your friend buys: ${PLANS.map((p) => `<b>${inr(earn(p))}</b> on ${esc(p.name)} (${inr(p.price)})`).join(" and ")}. No limit on how many people you refer.</p>` },
  { q: "When and how do I get paid?", a: "<p>After your friend pays for their plan, we send your share to the Google Pay / UPI number you give us. We’ll message you on WhatsApp when it’s sent.</p>" },
  { q: "What is my referral code?", a: "<p>Your first name in capitals — for example <b>JOHN</b>. If that name is already taken, we add a number (JOHN2). Your friend types it in the “Referred by” box, or simply opens your share link and it’s filled in automatically.</p>" },
  { q: "I forgot my code. What do I do?", a: "<p>Fill this form again with the same mobile number — we’ll show your existing code.</p>" },
  { q: "Can I use my own code?", a: "<p>No — referrals only count for other people. If you want our service yourself, just sign up normally.</p>" },
  { q: "Who should I refer?", a: "<p>Anyone on Naukri who isn’t getting recruiter calls: friends, colleagues, juniors from college, people on notice period or after a layoff.</p>" },
];

const crumbs = [{ name: "Home", path: "/" }, { name: "Refer & Earn", path: "/refer/" }];

export default {
  path: "/refer/",
  title: `Refer & Earn ${REFERRAL_PERCENT}% — GetShortlisted Referral Programme`,
  description: `Refer friends who aren’t getting calls on Naukri and earn ${REFERRAL_PERCENT}% — ${PLANS.map((p) => inr(earn(p))).join(" or ")} per referral, paid to your Google Pay / UPI.`,
  keywords: "refer and earn, referral programme india, earn money referring friends, naukri profile referral, getshortlisted referral",
  priority: 0.7,
  schema: [
    breadcrumbSchema(crumbs),
    { "@type": "WebPage", name: `Refer & Earn ${REFERRAL_PERCENT}%`, url: `${SITE.url}/refer/`, about: { "@id": `${SITE.url}/#organization` } },
    faqSchema(FAQS),
  ],
  body: `
<section class="page-hero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <span class="eyebrow">Refer & Earn</span>
    <h1>Refer a friend. Earn ${REFERRAL_PERCENT}%.</h1>
    <p class="lead">Know someone who isn’t getting calls on Naukri? Send them to us. When they buy a plan, you get ${REFERRAL_PERCENT}% on Google Pay — ${PLANS.map((p) => `<b>${inr(earn(p))}</b>`).join(" or ")} per referral.</p>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <span class="kicker">How it works</span>
      <h2 class="mt-0">3 steps. No limit.</h2>
      <ol class="ref-steps">
        <li><b>Get your code</b><span>Fill the form — your code is your first name, like <code>JOHN</code>.</span></li>
        <li><b>Share it</b><span>Send your link on WhatsApp. Friends who open it are tagged to you automatically.</span></li>
        <li><b>Get paid</b><span>When your friend pays for a plan, you get ${REFERRAL_PERCENT}% on Google Pay / UPI.</span></li>
      </ol>
      <div class="earn-cards">
        ${PLANS.map((p) => `<div class="earn-card"><span>${esc(p.name)} · ${inr(p.price)}</span><b>You earn ${inr(earn(p))}</b></div>`).join("")}
      </div>
    </div>

    <div id="join">
      <form class="lead-form ref-form" action="/api/referrer" method="post" novalidate data-ref-form>
        <div class="form-head">
          <h2 class="form-title">Get my referral code</h2>
          <p class="form-sub">Takes 30 seconds. Your code appears instantly.</p>
        </div>
        <div class="field">
          <label for="rf-name">Full name</label>
          <input id="rf-name" name="name" type="text" autocomplete="name" required minlength="2" maxlength="80" placeholder="e.g. John Mathew">
        </div>
        <div class="field">
          <label for="rf-phone">Mobile (WhatsApp)</label>
          <input id="rf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20" placeholder="98XXXXXXXX">
        </div>
        <label class="check"><input type="checkbox" name="upi_same" value="1" checked data-upi-same> My Google Pay number is the same as my mobile</label>
        <div class="field" data-upi-field hidden>
          <label for="rf-upi">Google Pay / UPI mobile number</label>
          <input id="rf-upi" name="upi_phone" type="tel" inputmode="tel" maxlength="20" placeholder="Number linked to Google Pay">
        </div>
        <div class="field">
          <label for="rf-email">Email</label>
          <input id="rf-email" name="email" type="email" autocomplete="email" required maxlength="120" placeholder="you@email.com">
        </div>
        <div class="hp" aria-hidden="true"><label for="rf-cw">Company website</label><input id="rf-cw" name="company_website" type="text" tabindex="-1" autocomplete="off"></div>
        ${SITE.turnstileSiteKey ? `<div class="cf-turnstile" data-sitekey="${esc(SITE.turnstileSiteKey)}" data-size="flexible" data-appearance="interaction-only"></div>` : ""}
        <button class="btn btn-gold btn-block btn-shine" type="submit">Get my referral code</button>
        <p class="form-status" role="status" aria-live="polite"></p>
        <p class="form-legal">By joining you agree to the <a href="/terms/#referral">referral terms</a> and our <a href="/privacy-policy/">Privacy Policy</a>.</p>
      </form>

      <div class="lead-form ref-done" data-ref-done hidden>
        <div class="form-head">
          <span class="plan-tag">You’re in</span>
          <h2 class="form-title" data-ref-hello>Your referral code</h2>
          <p class="form-sub">Share it with friends. Take a screenshot so you don’t lose it.</p>
        </div>
        <div class="ref-code" data-ref-code>CODE</div>
        <div class="ref-link"><input type="text" readonly data-ref-link aria-label="Your share link"><button class="btn btn-dark btn-sm" type="button" data-ref-copy>Copy</button></div>
        <a class="btn btn-wa btn-block" href="#" target="_blank" rel="noopener" data-ref-share>Share on WhatsApp</a>
        <p class="form-sub" data-ref-existing hidden>This mobile number already has a code — here it is.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-sand">
  <div class="wrap">
    <div class="section-head center"><span class="kicker">FAQ</span><h2>Referral questions</h2></div>
    ${faqList(FAQS)}
    <p class="center faq-more">More questions? ${waButton({ from: "refer", label: "Ask us on WhatsApp", cls: "wa-link" })}</p>
  </div>
</section>`,
};

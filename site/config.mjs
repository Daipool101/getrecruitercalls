// Single source of truth for site-wide details. Change here -> rebuild -> every page updates.
export const SITE = {
  name: "GetShortlisted",
  domain: "getshortlisted.in",
  url: "https://getshortlisted.in",
  tagline: "Naukri Profile & Resume Optimization",
  description:
    "Not getting calls from Naukri? GetShortlisted optimizes your Naukri profile and resume with the right keywords, headline and ATS-friendly format so recruiters find you and call you.",
  // Public contact address. Create it in Cloudflare Email Routing (forward to your Gmail).
  email: "hello@getshortlisted.in",
  country: "India",
  locale: "en_IN",
  themeColor: "#0F3D3A",
  ogImage: "/img/og-image.png",
  // Add real profile URLs when you have them (used in schema "sameAs" + footer). Leave empty to hide.
  social: {
    linkedin: "",
    instagram: "",
    youtube: "",
  },
  // Cloudflare Turnstile (free, invisible bot check on the form). Paste the PUBLIC site key here.
  // The matching secret goes in Cloudflare → Worker → Settings → Variables as TURNSTILE_SECRET (encrypted).
  // Leave empty to switch the check off.
  turnstileSiteKey: "",
  // Used for "dateModified" in schema + sitemap lastmod. Update when you change content.
  updated: "2026-11-21",
};

// Plans shown on the home page, /pricing/ and in the form. `id` is what the form submits.
// The WhatsApp number is NOT stored here (kept as the WHATSAPP_NUMBER secret in Cloudflare).
export const PLANS = [
  {
    id: "makeover",
    name: "Profile Makeover",
    price: 6000,
    tag: "We fix it. You apply.",
    pitch: "We optimize your Naukri profile and resume so recruiters find you — then hand everything over to you.",
    url: "/naukri-profile-optimization/",
    features: [
      "Recruiter-keyword research for your role & city",
      "Naukri resume headline, key skills & profile summary rewritten",
      "Employment, projects & career preferences fixed",
      "ATS-friendly resume (PDF + Word)",
      "Optimized Naukri profile, updated & handed over to you",
    ],
  },
  {
    id: "done-for-you",
    name: "Done-For-You Job Search",
    price: 9000,
    tag: "Hands-free",
    featured: true,
    pitch: "We take over your Naukri job search for 1 month — profile, resume and applications. You just pick up recruiter calls.",
    term: "1 month of job applications",
    url: "/naukri-job-application-service/",
    features: [
      "Everything in Profile Makeover",
      "We manage your Naukri profile and keep it active",
      "We apply to relevant jobs according to your profile — for 1 month",
      "Resume tuned for the roles we apply to",
      "You only attend recruiter calls & interviews",
    ],
  },
];
export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export const NAV = [
  { href: "/pricing/", label: "Pricing" },
  { href: "/naukri-profile-optimization/", label: "Naukri Profile" },
  { href: "/naukri-job-application-service/", label: "We Apply For You" },
  { href: "/blog/", label: "Guides" },
  { href: "/faq/", label: "FAQ" },
];

export const EXPERIENCE_OPTIONS = ["Fresher (0-1 yr)", "1-3 yrs", "3-6 yrs", "6-10 yrs", "10-15 yrs", "15+ yrs"];

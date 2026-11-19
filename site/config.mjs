// Single source of truth for site-wide details. Change here -> rebuild -> every page updates.
export const SITE = {
  name: "GetRecruiterCalls",
  domain: "getrecruitercalls.com",
  url: "https://getrecruitercalls.com",
  tagline: "Naukri Profile & Resume Optimization",
  description:
    "Not getting calls from Naukri? GetRecruiterCalls optimizes your Naukri profile and resume with the right keywords, headline and ATS-friendly format so recruiters find you and call you.",
  founder: "Nishit Salian",
  // Public contact address. Create it in Cloudflare Email Routing (forward to your Gmail).
  email: "hello@getrecruitercalls.com",
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
  // Used for "dateModified" in schema + sitemap lastmod. Update when you change content.
  updated: "2026-11-19",
};

export const NAV = [
  { href: "/naukri-profile-optimization/", label: "Naukri Profile" },
  { href: "/resume-optimization/", label: "Resume" },
  { href: "/blog/", label: "Guides" },
  { href: "/faq/", label: "FAQ" },
];

export const EXPERIENCE_OPTIONS = ["Fresher (0-1 yr)", "1-3 yrs", "3-6 yrs", "6-10 yrs", "10-15 yrs", "15+ yrs"];

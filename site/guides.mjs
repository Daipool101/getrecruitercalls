// One list of all guides - used for "Popular guides" (home), "Related guides" (each guide) and
// "Helpful guides" (service pages). Add new guides here and they get linked everywhere automatically.
export const GUIDES = {
  "/blog/how-to-get-shortlisted-on-naukri/": { title: "How to get shortlisted on Naukri", tag: "Naukri guide" },
  "/blog/not-getting-calls-from-naukri/": { title: "Not getting calls from Naukri? 9 reasons & fixes", tag: "Naukri guide" },
  "/blog/naukri-profile-summary-examples/": { title: "Naukri profile summary examples", tag: "Examples" },
  "/blog/naukri-resume-headline-examples/": { title: "30+ Naukri resume headline examples", tag: "Examples" },
  "/blog/naukri-key-skills/": { title: "Naukri key skills: examples & limits", tag: "Naukri guide" },
  "/blog/best-time-to-update-naukri-profile/": { title: "Best time to update your Naukri profile", tag: "Naukri guide" },
  "/blog/naukri-profile-optimization-tips/": { title: "Naukri profile optimization checklist", tag: "Checklist" },
  "/blog/ats-friendly-resume-format/": { title: "ATS-friendly resume format (India)", tag: "Resume guide" },
  "/blog/naukri-paid-services-worth-it/": { title: "Are Naukri paid services worth it?", tag: "Buying guide" },
  "/blog/chatgpt-prompts-for-naukri-profile/": { title: "ChatGPT & Claude prompts for Naukri", tag: "AI & Naukri" },
};

// Hand-picked "read next" links per guide (topic neighbours first).
export const RELATED = {
  "/blog/how-to-get-shortlisted-on-naukri/": ["/blog/not-getting-calls-from-naukri/", "/blog/naukri-resume-headline-examples/", "/blog/naukri-key-skills/"],
  "/blog/not-getting-calls-from-naukri/": ["/blog/how-to-get-shortlisted-on-naukri/", "/blog/naukri-profile-optimization-tips/", "/blog/best-time-to-update-naukri-profile/"],
  "/blog/naukri-profile-summary-examples/": ["/blog/naukri-resume-headline-examples/", "/blog/naukri-key-skills/", "/blog/naukri-profile-optimization-tips/"],
  "/blog/naukri-resume-headline-examples/": ["/blog/naukri-profile-summary-examples/", "/blog/naukri-key-skills/", "/blog/how-to-get-shortlisted-on-naukri/"],
  "/blog/naukri-key-skills/": ["/blog/naukri-profile-summary-examples/", "/blog/naukri-resume-headline-examples/", "/blog/not-getting-calls-from-naukri/"],
  "/blog/best-time-to-update-naukri-profile/": ["/blog/not-getting-calls-from-naukri/", "/blog/naukri-profile-optimization-tips/", "/blog/how-to-get-shortlisted-on-naukri/"],
  "/blog/naukri-profile-optimization-tips/": ["/blog/naukri-resume-headline-examples/", "/blog/naukri-profile-summary-examples/", "/blog/naukri-key-skills/"],
  "/blog/ats-friendly-resume-format/": ["/blog/naukri-profile-summary-examples/", "/blog/how-to-get-shortlisted-on-naukri/", "/blog/chatgpt-prompts-for-naukri-profile/"],
  "/blog/naukri-paid-services-worth-it/": ["/blog/not-getting-calls-from-naukri/", "/blog/how-to-get-shortlisted-on-naukri/", "/blog/best-time-to-update-naukri-profile/"],
  "/blog/chatgpt-prompts-for-naukri-profile/": ["/blog/naukri-resume-headline-examples/", "/blog/naukri-profile-summary-examples/", "/blog/ats-friendly-resume-format/"],
};

export const POPULAR = [
  "/blog/how-to-get-shortlisted-on-naukri/",
  "/blog/not-getting-calls-from-naukri/",
  "/blog/naukri-profile-summary-examples/",
  "/blog/naukri-resume-headline-examples/",
  "/blog/naukri-key-skills/",
  "/blog/naukri-paid-services-worth-it/",
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Compact link cards. */
export function guideLinks(paths, { heading = "", cls = "" } = {}) {
  const items = paths.filter((p) => GUIDES[p]).map((p) =>
    `<a class="guide-link" href="${p}"><span class="tag">${esc(GUIDES[p].tag)}</span><b>${esc(GUIDES[p].title)}</b></a>`).join("");
  return `<div class="guide-links ${cls}">${heading ? `<h2>${esc(heading)}</h2>` : ""}<div class="guide-grid">${items}</div></div>`;
}

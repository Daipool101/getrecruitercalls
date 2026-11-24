// GetShortlisted brand mark — a check-mark that turns into an upward arrow ("shortlisted" + "career going up"),
// on a golden-hour → terracotta tile with a sparkle. The same geometry is used for favicon.svg and the PNG icons
// (see tools/make-icons.mjs). Animations live in styles.css (.logo-mark …) and respect prefers-reduced-motion.

let n = 0;

export const MARK_PATHS = {
  check: "M12 25 L19.5 32.5 L35 17",
  arrow: "M26 17 H35 V26",
  spark: "M13 7.5 l1.5 3.9 3.9 1.5 -3.9 1.5 -1.5 3.9 -1.5 -3.9 -3.9 -1.5 3.9 -1.5z",
};

/** Animated inline logo mark. Each call gets unique gradient ids (header + footer on one page). */
export function logoMark() {
  const u = `gs${++n}`;
  return `<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="${u}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD27A"/><stop offset=".5" stop-color="#F4B13B"/><stop offset="1" stop-color="#E0745E"/></linearGradient>
<linearGradient id="${u}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="${u}c"><rect width="48" height="48" rx="14"/></clipPath>
</defs>
<rect width="48" height="48" rx="14" fill="url(#${u}a)"/>
<g clip-path="url(#${u}c)"><g transform="rotate(22 24 24)"><rect class="lm-shine" x="-14" y="-12" width="12" height="72" fill="url(#${u}s)"/></g></g>
<path class="lm-check" pathLength="1" d="${MARK_PATHS.check}" fill="none" stroke="#0B1F4B" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
<path class="lm-arrow" pathLength="1" d="${MARK_PATHS.arrow}" fill="none" stroke="#0B1F4B" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
<path class="lm-spark" d="${MARK_PATHS.spark}" fill="#FFFFFF"/>
</svg>`;
}

/** Static mark (favicon / PNG icons). `bg` fills the square behind the rounded tile (apple-touch-icon). */
export function staticMark({ size = 48, rounded = 14, bg = null } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}">
<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD27A"/><stop offset=".5" stop-color="#F4B13B"/><stop offset="1" stop-color="#E0745E"/></linearGradient></defs>
${bg ? `<rect width="48" height="48" fill="${bg}"/>` : ""}<rect width="48" height="48" rx="${rounded}" fill="url(#a)"/>
<path d="${MARK_PATHS.check}" fill="none" stroke="#0B1F4B" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${MARK_PATHS.arrow}" fill="none" stroke="#0B1F4B" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${MARK_PATHS.spark}" fill="#FFFFFF"/>
</svg>`;
}

/** Wordmark next to the mark. */
export const WORDMARK = `<span class="wordmark">Get<b>Shortlisted</b></span>`;

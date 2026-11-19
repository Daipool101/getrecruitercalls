// Static site generator (zero dependencies).
// Reads page modules from site/pages, renders them with site/layout.mjs, copies site/static,
// and writes sitemap.xml + robots.txt into ./public. Run: node build.mjs
import { readdir, mkdir, writeFile, rm, cp, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { render } from "./site/layout.mjs";
import { SITE } from "./site/config.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "public");
const pagesDir = join(root, "site", "pages");

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, "site", "static"), out, { recursive: true });

// Cache-busting version = hash of CSS + JS, so long-cached assets refresh whenever they change.
const hash = createHash("sha256");
for (const f of ["css/styles.css", "js/main.js"]) hash.update(await readFile(join(out, f)));
globalThis.ASSET_VER = hash.digest("hex").slice(0, 10);

const files = (await readdir(pagesDir)).filter((f) => f.endsWith(".mjs")).sort();
const pages = [];
for (const f of files) {
  const mod = await import(pathToFileURL(join(pagesDir, f)).href);
  const list = Array.isArray(mod.default) ? mod.default : [mod.default];
  pages.push(...list);
}

const seen = new Set();
for (const page of pages) {
  if (seen.has(page.path)) throw new Error(`Duplicate page path: ${page.path}`);
  seen.add(page.path);
  if (!page.title || !page.description) throw new Error(`Missing title/description: ${page.path}`);
  const html = render(page);
  const file = page.file
    ? join(out, page.file)
    : join(out, page.path.replace(/^\//, ""), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
}

// sitemap.xml (indexable pages only)
const urls = pages
  .filter((p) => !p.noindex && !p.file)
  .sort((a, b) => (b.priority ?? 0.5) - (a.priority ?? 0.5))
  .map(
    (p) => `  <url>
    <loc>${SITE.url}${p.path}</loc>
    <lastmod>${p.modified || p.published || SITE.updated}</lastmod>
    <changefreq>${p.changefreq || "monthly"}</changefreq>
    <priority>${(p.priority ?? 0.5).toFixed(1)}</priority>
  </url>`
  )
  .join("\n");
await writeFile(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  "utf8"
);

// robots.txt — open to search engines AND AI answer engines (GEO).
await writeFile(
  join(out, "robots.txt"),
  `# ${SITE.name} — all crawlers welcome, including AI search / answer engines.
User-agent: *
Allow: /
Disallow: /api/
Disallow: /thank-you/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`,
  "utf8"
);

console.log(`Built ${pages.length} pages -> public/ (sitemap: ${pages.filter((p) => !p.noindex && !p.file).length} URLs)`);

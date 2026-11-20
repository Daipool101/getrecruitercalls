// Regenerates favicon.svg + PNG icons + og-image.png from site/brand.mjs.
// Needs Google Chrome or Microsoft Edge installed (used headless to rasterize). Run: node tools/make-icons.mjs
// favicon.ico is then built from the PNGs with: python tools/make-ico.py
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { staticMark } from "../site/brand.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stat = join(root, "site", "static");

const browsers = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const chrome = browsers.find((b) => existsSync(b));
if (!chrome) throw new Error("Chrome/Edge not found. Set CHROME=/path/to/chrome");

await writeFile(join(stat, "favicon.svg"), staticMark().replace(/ width="48" height="48"/, "") + "\n");

const tmp = await mkdtemp(join(tmpdir(), "gs-icons-"));
async function shot(name, w, h, html) {
  const file = join(tmp, name.replace(/[/]/g, "_") + ".html");
  await writeFile(file, `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:transparent}</style></head><body>${html}</body></html>`);
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    `--window-size=${w},${h}`, "--default-background-color=00000000", `--screenshot=${join(stat, name)}`, pathToFileURL(file).href], { stdio: "ignore" });
  console.log("wrote", name);
}

const mark = (px, opts) => staticMark({ size: px, ...opts });
await shot("img/logo.png", 512, 512, mark(512));
await shot("img/icon-512.png", 512, 512, mark(512));
await shot("img/icon-192.png", 192, 192, mark(192));
await shot("img/apple-touch-icon.png", 180, 180, mark(180, { rounded: 0 }));
for (const s of [16, 32, 48]) await shot(`ico-${s}.png`, s, s, mark(s));

// Social share image (1200×630)
const font = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;800&display=block">`;
await shot("img/og-image.png", 1200, 630, `${font}
<div style="position:relative;width:1200px;height:630px;overflow:hidden;font-family:'Plus Jakarta Sans',sans-serif;background:radial-gradient(900px 520px at 88% -10%,#1C5550 0%,#0F3D3A 60%);color:#F2E6D6">
  <div style="position:absolute;width:560px;height:560px;right:-150px;top:-170px;border-radius:50%;background:radial-gradient(circle,rgba(244,177,59,.28),transparent 65%)"></div>
  <div style="position:absolute;width:480px;height:480px;left:-200px;bottom:-260px;border-radius:50%;background:radial-gradient(circle,rgba(224,116,94,.3),transparent 65%)"></div>
  <div style="position:absolute;right:86px;top:150px;transform:rotate(-8deg);filter:drop-shadow(0 30px 50px rgba(0,0,0,.35))">${mark(300)}</div>
  <div style="position:absolute;left:80px;top:70px;display:flex;align-items:center;gap:18px">${mark(76)}<span style="font-size:42px;font-weight:600;letter-spacing:-1px">Get<b style="font-weight:800;color:#F4B13B">Shortlisted</b></span></div>
  <div style="position:absolute;left:80px;top:212px;font-size:76px;line-height:1.05;font-weight:800;letter-spacing:-2.5px;color:#fff">Get shortlisted.<br><span style="color:#F4B13B">Get recruiter calls.</span></div>
  <div style="position:absolute;left:80px;top:420px;font-size:30px;font-weight:500;color:rgba(242,230,214,.9);width:640px;line-height:1.35">Naukri profile &amp; ATS resume optimization for job seekers across India.</div>
  <div style="position:absolute;left:80px;top:522px;padding:14px 26px;border-radius:14px;background:linear-gradient(135deg,#FFC85A,#F4B13B 45%,#EE9640);color:#0A2B29;font-size:28px;font-weight:800">getshortlisted.in</div>
</div>`);

await rm(tmp, { recursive: true, force: true });

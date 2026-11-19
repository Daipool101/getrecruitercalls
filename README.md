# GetRecruiterCalls.com

Naukri profile & resume optimization website. Cloudflare Workers (hosting) + D1 (leads database) + Email Routing (lead notification email).

- How it is built → [ARCHITECTURE.md](ARCHITECTURE.md)
- Project facts, decisions, open items → [MEMORY.md](MEMORY.md)

---

## Run on your computer

Needs Node.js 20+.

```bash
npm install
npm run db:migrate:local     # create the local leads table (first time only)
npm run dev                  # http://127.0.0.1:8787
```

In a second terminal, run the automated tests against the dev server:

```bash
npm test
```

Locally, emails are not really sent — Wrangler saves them as `.eml` files and prints the path in the terminal.

Edit content in `site/` (never in `public/`, which is regenerated).

---

## Deploy to Cloudflare (one-time setup)

### 1. Add the domain to Cloudflare
Cloudflare dashboard → **Add a domain** → `getrecruitercalls.com` → change the nameservers at your domain registrar to the two Cloudflare gives you. Wait until the domain shows **Active**.

### 2. Turn on Email Routing (for lead emails + hello@ address)
Dashboard → `getrecruitercalls.com` → **Email** → **Email Routing** → **Enable** (Cloudflare adds the MX/SPF DNS records for you).
1. **Destination addresses** → add `nishit.salian02@gmail.com` → open Gmail and click the **verify** link. *(Lead emails will not send until this is verified.)*
2. **Routing rules → Custom addresses** → create `hello@getrecruitercalls.com` → action *Send to* `nishit.salian02@gmail.com`.

The website sends lead emails **from** `leads@getrecruitercalls.com` **to** your Gmail. Check your Spam folder the first time and mark it "Not spam".

### 3. Log in and create the database
```bash
npx wrangler login
npx wrangler d1 create getrecruitercalls-db
```
Copy the `database_id` it prints and paste it into `wrangler.jsonc` (replace `REPLACE_WITH_YOUR_D1_DATABASE_ID`). Then create the table:
```bash
npm run db:migrate:remote
```

### 4. Deploy
**Option A — from your computer:**
```bash
npm run deploy
```
**Option B — automatic from GitHub (recommended):** push this repo to GitHub → Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → pick the repo.
- Build command: *(leave empty — wrangler runs `node build.mjs` itself)*
- Deploy command: `npx wrangler deploy`

Every push to `main` then redeploys the site.

`wrangler.jsonc` attaches `getrecruitercalls.com` and `www.getrecruitercalls.com` automatically.

### 5. Redirect www → main domain
Dashboard → `getrecruitercalls.com` → **Rules → Redirect Rules → Create from template → "Redirect from WWW to root"** → Deploy. (Canonical tags already point to `https://getrecruitercalls.com`.)

### 6. Test the live site
1. Open https://getrecruitercalls.com/api/health → should show `{"ok":true,…}`
2. Submit the form once with your own details → check Gmail.
3. See saved leads anytime:
```bash
npm run leads:remote
```
4. Read-only tests against the live site:
```bash
BASE=https://getrecruitercalls.com READONLY=1 npm test
```

---

## After launch — get found on Google & AI search
1. **Google Search Console** → add Domain property `getrecruitercalls.com` (verify via Cloudflare DNS) → **Sitemaps** → submit `https://getrecruitercalls.com/sitemap.xml` → use **URL Inspection → Request indexing** for the home page and service pages.
2. **Bing Webmaster Tools** → import from Search Console (Bing also feeds ChatGPT search & Copilot).
3. **Cloudflare Web Analytics** (free, no cookies) → dashboard → Analytics & Logs → Web Analytics → enable for the domain (automatic setup).
4. Create **LinkedIn / Instagram / YouTube** pages for GetRecruiterCalls and add the links in `site/config.mjs → social` (helps Google & AI trust the brand).
5. Keep publishing helpful guides in `site/pages/blog.mjs` (1–2 per month) and add them to `site/static/llms.txt`.
6. Ask happy clients for Google reviews (Google Business Profile, service-area business, no public address needed).

## Common changes
| I want to… | Edit |
|---|---|
| Change email that receives leads | `wrangler.jsonc` → `vars.NOTIFY_TO` **and** `send_email[0].destination_address` (verify new address in Email Routing) |
| Change public email / founder / social links | `site/config.mjs` |
| Change colors | `site/static/css/styles.css` → `:root` |
| Edit home page text | `site/pages/home.mjs` |
| Add a guide | `site/pages/blog.mjs` → copy an `article({...})` block, add it to `posts` |
| Change form fields | `site/layout.mjs → leadForm`, `site/static/js/main.js`, `src/worker.js → validate`, new migration in `migrations/` |

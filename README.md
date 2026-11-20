# GetShortlisted.in

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

## Deploy to Cloudflare (from GitHub — no commands needed)

### Step 1 — Put the site live on a free address
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository**.
2. Connect GitHub and pick **Daipool101/getrecruitercalls**.
3. Settings:
   - Project name: `getrecruitercalls`
   - Build command: *(leave empty)*
   - Deploy command: `npx wrangler deploy`
4. Click **Deploy**.

Cloudflare builds the site, **creates the D1 database automatically**, and gives you a free URL like
`https://getrecruitercalls.<your-account>.workers.dev`. The `leads` table is created by the Worker on the first form submission.
Every push to `main` on GitHub redeploys automatically.

See leads anytime: dashboard → **Storage & Databases → D1 → getrecruitercalls-db → Console** → run
`SELECT id, created_at, name, phone, email, plan, naukri_login, resume_name, email_status FROM leads ORDER BY id DESC;`

### Step 2 — Connect the domain getshortlisted.in
1. The domain is registered at Hostinger. In Cloudflare: **Add a domain** → `getshortlisted.in` → Free plan.
   Cloudflare shows 2 nameservers → in Hostinger, **Domains → getshortlisted.in → DNS / Nameservers → Change nameservers** → paste them. Wait until Cloudflare says "Active" (can take a few hours).
2. In `wrangler.jsonc`, uncomment the `"routes"` block, push to GitHub.
3. Dashboard → `getshortlisted.in` → **Rules → Redirect Rules → template "Redirect from WWW to root"**.

### Step 3 — Turn on lead emails, WhatsApp button and bot check
**Secrets** (never in this repo): Workers & Pages → `getrecruitercalls` → **Settings → Variables and Secrets → Add** → type **Secret**:

| Name | Value |
|---|---|
| `NOTIFY_TO` | Gmail that receives leads (must be verified in step 2 below) |
| `WHATSAPP_NUMBER` | `91` + 10-digit WhatsApp number, digits only |
| `TURNSTILE_SECRET` | *(optional)* Turnstile secret key — only together with `turnstileSiteKey` in `site/config.mjs` |

Email Routing:
1. Dashboard → `getshortlisted.in` → **Email → Email Routing → Enable** (let it add the MX/SPF records).
2. **Destination addresses** → add the lead Gmail → click the verify link in Gmail.
3. **Routing rules → Custom address** → `hello` → send to that Gmail.
4. Submit the form once and check Gmail (and Spam the first time). Leads + resumes are always saved in D1 even if email fails.

For local development put the same names in a `.dev.vars` file (git-ignored).

### Test the live site
- `https://<your-site>/api/health` → `{"ok":true,…}`
- Read-only tests: `BASE=https://<your-site> READONLY=1 npm test`

---

## After launch — get found on Google & AI search
1. **Google Search Console** → add Domain property `getshortlisted.in` (verify via Cloudflare DNS) → **Sitemaps** → submit `https://getshortlisted.in/sitemap.xml` → use **URL Inspection → Request indexing** for the home page and service pages.
2. **Bing Webmaster Tools** → import from Search Console (Bing also feeds ChatGPT search & Copilot).
3. **Cloudflare Web Analytics** (free, no cookies) → dashboard → Analytics & Logs → Web Analytics → enable for the domain (automatic setup).
4. Create **LinkedIn / Instagram / YouTube** pages for GetShortlisted and add the links in `site/config.mjs → social` (helps Google & AI trust the brand).
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

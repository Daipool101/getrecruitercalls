-- Leads submitted through the website form.
CREATE TABLE IF NOT EXISTS leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  name          TEXT    NOT NULL,
  phone         TEXT    NOT NULL,
  email         TEXT    NOT NULL,
  naukri_url    TEXT,
  resume_url    TEXT,
  experience    TEXT,
  target_role   TEXT,
  message       TEXT,
  source_page   TEXT,
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  ip_hash       TEXT,
  user_agent    TEXT,
  email_status  TEXT    NOT NULL DEFAULT 'pending'  -- pending | sent | failed | skipped
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_ip_hash    ON leads (ip_hash, created_at);

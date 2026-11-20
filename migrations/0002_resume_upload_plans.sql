-- v2 form: resume file upload (instead of a link), Naukri login email/mobile (instead of a profile link), chosen plan.
-- The Worker also applies these itself on first use (src/worker.js → ensureSchema), so this file is for `wrangler d1 migrations apply`.
ALTER TABLE leads ADD COLUMN naukri_login TEXT;
ALTER TABLE leads ADD COLUMN plan TEXT;
ALTER TABLE leads ADD COLUMN resume_name TEXT;

-- Uploaded resumes (max ~1.9 MB each — D1 rows are limited to 2 MB).
CREATE TABLE IF NOT EXISTS resumes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id     INTEGER NOT NULL,
  filename    TEXT    NOT NULL,
  mime        TEXT    NOT NULL,
  size        INTEGER NOT NULL,
  data        BLOB    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_resumes_lead ON resumes (lead_id);

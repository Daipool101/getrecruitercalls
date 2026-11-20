-- Referral programme ("Refer & Earn 20%").
-- The Worker also applies this itself on first use (src/worker.js → ensureSchema).

-- Partners who signed up at /refer/. code = first name in capitals (AKASH, AKASH2, …).
CREATE TABLE IF NOT EXISTS referrers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  code        TEXT    NOT NULL UNIQUE,
  code_base   TEXT    NOT NULL,            -- AKASH for AKASH, AKASH2, …
  name        TEXT    NOT NULL,
  phone       TEXT    NOT NULL UNIQUE,     -- 10-digit mobile / WhatsApp
  upi_phone   TEXT    NOT NULL,            -- Google Pay / UPI number for payouts
  email       TEXT    NOT NULL,
  ip_hash     TEXT,
  status      TEXT    NOT NULL DEFAULT 'active'
);
CREATE INDEX IF NOT EXISTS idx_referrers_base ON referrers (code_base);
CREATE INDEX IF NOT EXISTS idx_referrers_ip   ON referrers (ip_hash, created_at);

-- How each lead arrived + the commission owed.
ALTER TABLE leads ADD COLUMN lead_source TEXT;        -- organic | referral | referral-unverified | self-referral
ALTER TABLE leads ADD COLUMN referral_input TEXT;     -- exactly what the client typed
ALTER TABLE leads ADD COLUMN referral_code TEXT;      -- matched partner code
ALTER TABLE leads ADD COLUMN referrer_id INTEGER;     -- referrers.id
ALTER TABLE leads ADD COLUMN referral_note TEXT;      -- e.g. "2 partners share this first name"
ALTER TABLE leads ADD COLUMN commission_inr INTEGER;  -- 20% of the plan price
ALTER TABLE leads ADD COLUMN commission_status TEXT;  -- pending | paid | cancelled (NULL when no commission)

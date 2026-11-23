-- Capacity hardening: normalised mobile number for the 10-minute duplicate guard.
-- (The Worker also applies this itself — src/worker.js → ensureSchema.)
ALTER TABLE leads ADD COLUMN phone_local TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (phone_local, created_at);

-- ─────────────────────────────────────────────
-- Migration v3: Events & Surveys
-- Supabase SQL Editor'da çalıştırın
-- ─────────────────────────────────────────────

-- ── Events ──────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT,
  location         TEXT,
  event_date       TIMESTAMPTZ NOT NULL,
  end_date         TIMESTAMPTZ,
  type             TEXT DEFAULT 'event'
                   CHECK (type IN ('event','seminar','workshop','training','meeting')),
  status           TEXT DEFAULT 'upcoming'
                   CHECK (status IN ('upcoming','ongoing','completed','cancelled')),
  max_participants INTEGER,
  is_online        BOOLEAN DEFAULT FALSE,
  registration_url TEXT,
  cover_image      TEXT,
  tags             TEXT[] DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public: sadece okuma
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (true);

-- Auth: tam yetki
CREATE POLICY "events_auth_all" ON events
  FOR ALL USING (auth.role() = 'authenticated');

-- ── Surveys ─────────────────────────────────
CREATE TABLE IF NOT EXISTS surveys (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  questions   JSONB NOT NULL DEFAULT '[]',
  is_active   BOOLEAN DEFAULT TRUE,
  ends_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "surveys_public_read" ON surveys
  FOR SELECT USING (true);

CREATE POLICY "surveys_auth_all" ON surveys
  FOR ALL USING (auth.role() = 'authenticated');

-- ── Survey Responses ────────────────────────
CREATE TABLE IF NOT EXISTS survey_responses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id         UUID REFERENCES surveys(id) ON DELETE CASCADE,
  answers           JSONB NOT NULL DEFAULT '{}',
  respondent_email  TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Herkes yanıt ekleyebilir
CREATE POLICY "survey_responses_insert" ON survey_responses
  FOR INSERT WITH CHECK (true);

-- Sadece auth okuyabilir
CREATE POLICY "survey_responses_auth_read" ON survey_responses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "survey_responses_auth_delete" ON survey_responses
  FOR DELETE USING (auth.role() = 'authenticated');

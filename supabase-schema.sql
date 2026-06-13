-- Frawell — Supabase SQL Şeması
-- Supabase Dashboard > SQL Editor'da bu kodu çalıştır

CREATE TABLE IF NOT EXISTS responses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz DEFAULT now(),

  -- Step 0: Demografi
  age_range        text,
  gender           text,
  city             text,
  outings_per_week float,
  app_count        text,
  apps_used        text[],

  -- Step 1: Gün içi pain points
  decision_method  text[],
  route_problems   text[],
  venue_quit       text[],
  transport_pref   text[],
  missing_filters  text[],
  experience_note  text,

  -- Step 2: En büyük problem
  top_problems     text[],

  -- Step 3: Özellik sıralaması
  feature_ranking  text[],

  -- Step 4: Açık metin + e-posta
  open_feedback    text,
  email            text
);

-- RLS: Herkes insert yapabilsin (anonim anket)
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonim insert" ON responses
  FOR INSERT
  WITH CHECK (true);

-- Dashboard için okuma (isteğe bağlı — anon key ile okuyacaksak)
CREATE POLICY "Anonim okuma" ON responses
  FOR SELECT
  USING (true);

-- Realtime için yayın aç
ALTER PUBLICATION supabase_realtime ADD TABLE responses;

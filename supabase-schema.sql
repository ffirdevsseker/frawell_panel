-- Frawell — Supabase SQL Şeması
-- Supabase Dashboard > SQL Editor'da bu kodu çalıştır

CREATE TABLE IF NOT EXISTS responses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz DEFAULT now(),

  -- Durak 0: Kaşif kimliği
  age_range        text,
  gender           text,
  city             text,
  travel_companions text,

  -- Durak 1: Hareket tarzın
  outings_per_week float,
  app_count        text,
  apps_used        text[],

  -- Durak 2: Seni mutlu eden ne?
  travel_motivations text[],
  memorable_moment text,

  -- Durak 3: Yolda ne oluyor?
  decision_method  text[],
  route_problems   text[],
  transport_pref   text[],

  -- Durak 4: Mekan seçerken
  venue_quit       text[],
  missing_filters  text[],
  experience_note  text,

  -- Durak 5: En büyük 2 derdin
  top_problems     text[],

  -- Durak 6: Frawell'i hayal et
  ai_guide_appeal        text,
  personalization_appeal text,
  gamification_appeal    text,
  avatar_quest_appeal    text,
  local_deals_appeal     text,

  -- Durak 7: Özellik sıralaması
  feature_ranking  text[],

  -- Durak 8: Son istasyon
  magic_wand_wish  text,
  email            text,

  -- Gönderim anında hesaplanan "Gezgin Tipi" rozeti
  traveler_persona text
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

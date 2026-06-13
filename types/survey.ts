export type AgeRange = '13-17' | '18-24' | '25-34' | '35-44' | '45+'
export type Gender = 'Kadın' | 'Erkek' | 'Belirtmek istemiyorum'
export type City = 'İstanbul' | 'İzmir' | 'Ankara' | 'Bursa' | 'Antalya' | 'Diğer'
export type AppCount = 'Sadece 1' | '2-3 uygulama' | '4 veya daha fazla'
export type TravelCompanion =
  | 'Tek başıma'
  | 'Arkadaşlarımla'
  | 'Partnerimle'
  | 'Ailemle'
  | 'Değişir, duruma göre'

/** AI rehber, kişiselleştirme, oyunlaştırma gibi "hayal et" senaryolarına tepki ölçeği */
export type AppealLevel = 'Kesinlikle isterim' | 'Olabilir, denerim' | 'Gerek yok'

export interface SurveyData {
  // Durak 0 — Kaşif kimliği
  age_range: AgeRange | null
  gender: Gender | null
  city: City | null
  travel_companions: TravelCompanion | null

  // Durak 1 — Hareket tarzın
  outings_per_week: number
  app_count: AppCount | null
  apps_used: string[]

  // Durak 2 — Seni mutlu eden ne?
  travel_motivations: string[]
  memorable_moment: string

  // Durak 3 — Yolda
  decision_method: string[]
  route_problems: string[]
  transport_pref: string[]

  // Durak 4 — Mekan seçerken
  venue_quit: string[]
  missing_filters: string[]
  experience_note: string

  // Durak 5 — En büyük 2 derdin
  top_problems: string[]

  // Durak 6 — Frawell'i hayal et
  ai_guide_appeal: AppealLevel | null
  personalization_appeal: AppealLevel | null
  gamification_appeal: AppealLevel | null
  avatar_quest_appeal: AppealLevel | null
  local_deals_appeal: AppealLevel | null

  // Durak 7 — Ne önce gelsin?
  feature_ranking: string[]

  // Durak 8 — Son istasyon
  magic_wand_wish: string
  email: string

  // Gönderim anında hesaplanan "Gezgin Tipi" rozeti
  traveler_persona: string
}

export const INITIAL_SURVEY_DATA: SurveyData = {
  age_range: null,
  gender: null,
  city: null,
  travel_companions: null,

  outings_per_week: 3,
  app_count: null,
  apps_used: [],

  travel_motivations: [],
  memorable_moment: '',

  decision_method: [],
  route_problems: [],
  transport_pref: [],

  venue_quit: [],
  missing_filters: [],
  experience_note: '',

  top_problems: [],

  ai_guide_appeal: null,
  personalization_appeal: null,
  gamification_appeal: null,
  avatar_quest_appeal: null,
  local_deals_appeal: null,

  feature_ranking: [
    'AI ile kişisel rota oluşturma (zevklerime göre)',
    'Grup planlaması — herkes aynı sayfada',
    'Ulaşım + konaklama + rota tek ekranda',
    'Anlık kalabalık ve çalışma saati bilgisi',
    'Keşfet modu — anlık gezi fikirleri',
    'Gezi arşivi + harcama geçmişi',
    'AI rehberin yerleri sesli hikaye gibi anlatması',
  ],

  magic_wand_wish: '',
  email: '',

  traveler_persona: '',
}

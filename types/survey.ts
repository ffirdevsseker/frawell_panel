export type AgeRange = '13-17' | '18-24' | '25-34' | '35-44' | '45+'
export type Gender = 'Kadın' | 'Erkek' | 'Belirtmek istemiyorum'
export type City = 'İstanbul' | 'İzmir' | 'Ankara' | 'Bursa' | 'Antalya' | 'Diğer'
export type AppCount = 'Sadece 1' | '2-3 uygulama' | '4 veya daha fazla'

export interface SurveyData {
  // Step 0
  age_range: AgeRange | null
  gender: Gender | null
  city: City | null
  outings_per_week: number
  app_count: AppCount | null
  apps_used: string[]

  // Step 1
  decision_method: string[]
  route_problems: string[]
  venue_quit: string[]
  transport_pref: string[]
  missing_filters: string[]
  experience_note: string

  // Step 2
  top_problems: string[]

  // Step 3
  feature_ranking: string[]

  // Step 4
  open_feedback: string
  email: string
}

export const INITIAL_SURVEY_DATA: SurveyData = {
  age_range: null,
  gender: null,
  city: null,
  outings_per_week: 3,
  app_count: null,
  apps_used: [],
  decision_method: [],
  route_problems: [],
  venue_quit: [],
  transport_pref: [],
  missing_filters: [],
  experience_note: '',
  top_problems: [],
  feature_ranking: [
    'AI ile kişisel rota oluşturma (zevklerime göre)',
    'Grup planlaması — herkes aynı sayfada',
    'Ulaşım + konaklama + rota tek ekranda',
    'Anlık kalabalık ve çalışma saati bilgisi',
    'Keşfet modu — anlık gezi fikirleri',
    'Gezi arşivi + harcama geçmişi',
  ],
  open_feedback: '',
  email: '',
}

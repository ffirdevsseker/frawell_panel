import { SurveyData } from '@/types/survey'
import { Locale } from '@/i18n/config'
import trMessages from '@/messages/tr.json'
import enMessages from '@/messages/en.json'

export interface TravelerPersona {
  key: string
  emoji: string
  title: string
  tagline: string
  description: string
}

const PERSONA_EMOJI: Record<string, string> = {
  explorer: '🧭',
  social: '🎉',
  foodie: '🍜',
  gamer: '🎮',
  planner: '📋',
  calm: '🌙',
}

const PERSONA_TEXT = { tr: trMessages.persona, en: enMessages.persona }

const FALLBACK_KEY = 'explorer'

/**
 * Anket cevaplarına göre eğlenceli bir "Gezgin Tipi" rozeti hesaplar.
 * Puanlama basittir: her ipucu ilgili kişiliğe puan ekler, en yükseği kazanır.
 * Skorlama, veritabanında saklanan Türkçe değerler üzerinden çalışır ve dilden bağımsızdır.
 */
export function computeTravelerPersona(data: SurveyData): { key: string } {
  const scores: Record<string, number> = {
    explorer: 0,
    social: 0,
    foodie: 0,
    gamer: 0,
    planner: 0,
    calm: 0,
  }

  for (const m of data.travel_motivations) {
    if (m.includes('Yeni yerler') || m.includes('Tarih') || m.includes('sürpriz')) scores.explorer += 2
    if (m.includes('Yöresel') || m.includes('lezzet')) scores.foodie += 2
    if (m.includes('sosyalleş') || m.includes('arkadaş')) scores.social += 2
    if (m.includes('dinlenmek') || m.includes('Stres')) scores.calm += 2
    if (m.includes('fotoğraf')) scores.social += 1
  }

  if (data.travel_companions === 'Arkadaşlarımla' || data.travel_companions === 'Ailemle') scores.social += 2
  if (data.travel_companions === 'Tek başıma') scores.explorer += 1

  if (data.gamification_appeal === 'Kesinlikle isterim') scores.gamer += 3
  if (data.avatar_quest_appeal === 'Kesinlikle isterim') scores.gamer += 2

  if (data.app_count === '4 veya daha fazla') scores.planner += 2
  if (data.decision_method.some((d) => d.includes('Uygulama') || d.includes('Haritada'))) scores.planner += 1
  if (data.feature_ranking[0]?.includes('tek ekranda')) scores.planner += 2

  if (data.outings_per_week <= 2) scores.calm += 1
  if (data.missing_filters.includes('Kalabalık bilgisi (şu an ne kadar dolu?)')) scores.calm += 1

  let best = FALLBACK_KEY
  let bestScore = -1
  for (const [key, score] of Object.entries(scores)) {
    if (score > bestScore) {
      best = key
      bestScore = score
    }
  }

  return { key: best }
}

export function getPersonaByKey(key: string, locale: Locale): TravelerPersona {
  const text = PERSONA_TEXT[locale]
  const entry = (key in text ? text[key as keyof typeof text] : text[FALLBACK_KEY])
  const emoji = PERSONA_EMOJI[key] ?? PERSONA_EMOJI[FALLBACK_KEY]
  return { key, emoji, ...entry }
}

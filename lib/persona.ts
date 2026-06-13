import { SurveyData } from '@/types/survey'

export interface TravelerPersona {
  key: string
  emoji: string
  title: string
  tagline: string
  description: string
}

const PERSONAS: Record<string, TravelerPersona> = {
  explorer: {
    key: 'explorer',
    emoji: '🧭',
    title: 'Kaşif',
    tagline: 'Haritanın dışına çıkmaktan korkmazsın',
    description:
      "Yeni sokaklar, bilinmeyen köşeler senin için bir davet. Frawell'in 7/24 AI rehberi, adım attığın her yerde hiç bilmediğin hikayeleri sana fısıldayacak.",
  },
  social: {
    key: 'social',
    emoji: '🎉',
    title: 'Sosyal Kelebek',
    tagline: 'En güzel anılar paylaşılan anılardır',
    description:
      'Gezmek senin için bir "biz" hikayesi. Frawell\'in grup planlama modu herkesi aynı sayfada tutarken, sen sadece eğlenceye odaklanırsın.',
  },
  foodie: {
    key: 'foodie',
    emoji: '🍜',
    title: 'Lezzet Avcısı',
    tagline: 'Rotanı midenin sesi çiziyor',
    description:
      "Bir şehri tadarak tanırsın. Travel DNA'n geliştikçe Frawell, o sokak arasındaki kahveciyi ya da gizli lokantayı tam sana göre önerecek.",
  },
  gamer: {
    key: 'gamer',
    emoji: '🎮',
    title: 'Oyuncu Gezgin',
    tagline: 'Her gezi senin için bir seviye',
    description:
      "Rozet, puan, görev — kulağına müzik gibi geliyor. Frawell'de attığın her adım 3D avatarını geliştirir, tamamladığın quest'ler seni gerçek ödüllere taşır.",
  },
  planner: {
    key: 'planner',
    emoji: '📋',
    title: 'Usta Planlayıcı',
    tagline: 'Her şey tek bir yerde toplanmalı',
    description:
      'Onlarca sekme açmak sana göre değil. Frawell; ulaşımdan rotaya, bütçeden check-in\'e kadar her şeyi tek ekranda topluyor.',
  },
  calm: {
    key: 'calm',
    emoji: '🌙',
    title: 'Sakin Ruhlu',
    tagline: 'Senin temponda, senin huzurunda',
    description:
      'Acele etmeden, kalabalıktan kaçarak keşfetmeyi seversin. Frawell, anlık kalabalık bilgisiyle sana en sakin köşeleri gösterecek.',
  },
}

const FALLBACK = PERSONAS.explorer

/**
 * Anket cevaplarına göre eğlenceli bir "Gezgin Tipi" rozeti hesaplar.
 * Puanlama basittir: her ipucu ilgili kişiliğe puan ekler, en yükseği kazanır.
 */
export function computeTravelerPersona(data: SurveyData): TravelerPersona {
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

  let best = FALLBACK.key
  let bestScore = -1
  for (const [key, score] of Object.entries(scores)) {
    if (score > bestScore) {
      best = key
      bestScore = score
    }
  }

  return PERSONAS[best] ?? FALLBACK
}

export function getPersonaByKey(key: string): TravelerPersona {
  return PERSONAS[key] ?? FALLBACK
}

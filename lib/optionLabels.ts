import { Locale } from '@/i18n/config'

/**
 * Survey option values are stored in Supabase as the Turkish strings below
 * (32 rows already exist). This map only affects the DISPLAYED label —
 * the stored value passed to onChange/the API always stays the Turkish string.
 */
const EN_LABELS: Record<string, string> = {
  // Step0 — gender
  'Kadın': 'Female',
  'Erkek': 'Male',
  'Belirtmek istemiyorum': 'Prefer not to say',

  // Step0 — city
  'İstanbul': 'Istanbul',
  'İzmir': 'Izmir',
  'Ankara': 'Ankara',
  'Bursa': 'Bursa',
  'Antalya': 'Antalya',
  'Diğer': 'Other',

  // Step0 — travel companions
  'Tek başıma': 'By myself',
  'Arkadaşlarımla': 'With friends',
  'Partnerimle': 'With my partner',
  'Ailemle': 'With family',
  'Değişir, duruma göre': 'Depends on the situation',

  // Step1 — app count
  'Sadece 1': 'Just 1',
  '2-3 uygulama': '2-3 apps',
  '4 veya daha fazla': '4 or more',

  // Step1 — apps used
  'Yemeksepeti / Getir': 'Yemeksepeti / Getir (food delivery)',
  'Uygulama kullanmıyorum': "I don't use any app",

  // Step2 — motivations
  '🗺️ Yeni yerler keşfetmek': '🗺️ Discovering new places',
  '📚 Tarihi ve hikayeleri öğrenmek': '📚 Learning history and stories',
  '🍜 Yöresel lezzetleri tatmak': '🍜 Tasting local food',
  '🤝 Yerel halkla / kültürle tanışmak': '🤝 Meeting locals / experiencing culture',
  '🎉 Arkadaşlarla sosyalleşmek': '🎉 Socializing with friends',
  '🧘 Stres atmak, dinlenmek': '🧘 Relaxing, de-stressing',
  '🎯 Plansız bir sürpriz/macera yaşamak': '🎯 Having a spontaneous adventure',
  '📸 Unutulmaz fotoğraflar/anılar biriktirmek': '📸 Collecting memorable photos/memories',

  // Step3 — decision method
  'Aklımda zaten var, direkt giderim': 'I already have it in mind, I just go',
  'Haritada bakıyorum': 'I check the map',
  'Sosyal medyadan ilham alıyorum': 'I get inspired by social media',
  'Birine soruyorum': 'I ask someone',
  'Uygulama önerisine bakıyorum': 'I check app recommendations',

  // Step3 — route problems
  'Trafik / toplu taşıma belirsizliği': 'Traffic / public transit uncertainty',
  'Birden fazla durak varsa koordinasyon': 'Coordinating multiple stops',
  'Otopark / araç bırakma yeri': 'Parking / drop-off spot',
  'Süreyi tahmin edemiyorum': "Can't estimate the duration",
  'Yeni bir mahallede kayboluyorum': 'Getting lost in a new neighborhood',
  'Sorun yaşamıyorum': "I don't have any issues",

  // Step3 — transport preference
  'En hızlı yol': 'The fastest route',
  'En ucuz yol': 'The cheapest route',
  'Konfor (araçla gitmek)': 'Comfort (going by car)',
  'Yürünebilir mesafe tercih ederim': 'I prefer walkable distance',
  'Çevreye duyarlı seçenekler': 'Eco-friendly options',

  // Step4 — venue quit
  'Fiyatı yüksek çıkınca': 'When the price is too high',
  'Kapalı / dolu olduğunu öğrenince': "When it's closed or full",
  'Çok uzak olduğunu görünce': 'When it turns out to be too far',
  'Yorumlar güven vermeyince': "When the reviews aren't convincing",
  'Karar veremeyip bıkıyorum': "I get tired of not being able to decide",

  // Step4 — missing filters
  'Mekanın atmosferi / vibes': 'The vibe / atmosphere of the place',
  'Beslenme tercihi (vegan, glütensiz...)': 'Dietary preference (vegan, gluten-free...)',
  'Kalabalık bilgisi (şu an ne kadar dolu?)': 'Crowd info (how busy is it right now?)',
  'Güncel çalışma saati': 'Up-to-date opening hours',
  'Evcil hayvan dostu mu?': 'Pet-friendly?',
  'Wi-Fi / çalışmaya uygun mu?': 'Wi-Fi / good for working?',

  // Step6 — appeal options
  'Kesinlikle isterim': 'Definitely want this',
  'Olabilir, denerim': 'Maybe, I would try it',
  'Gerek yok': 'Not needed',

  // Step7 — feature ranking
  'AI ile kişisel rota oluşturma (zevklerime göre)': 'AI-powered personal route planning (based on my taste)',
  'Grup planlaması — herkes aynı sayfada': 'Group planning — everyone on the same page',
  'Ulaşım + konaklama + rota tek ekranda': 'Transport + lodging + route in one screen',
  'Anlık kalabalık ve çalışma saati bilgisi': 'Real-time crowd & opening-hours info',
  'Keşfet modu — anlık gezi fikirleri': 'Discover mode — instant trip ideas',
  'Gezi arşivi + harcama geçmişi': 'Trip archive + spending history',
  'AI rehberin yerleri sesli hikaye gibi anlatması': 'AI guide narrating places like an audio story',
}

/**
 * Returns the display label for a stored survey option value.
 * The stored value itself never changes — only what's shown to the user does.
 */
export function getOptionLabel(value: string, locale: Locale): string {
  if (locale === 'en') return EN_LABELS[value] ?? value
  return value
}

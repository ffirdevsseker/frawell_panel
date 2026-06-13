'use client'

import { SurveyData } from '@/types/survey'

interface StepOneProps {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

const DECISION_METHODS = [
  'Aklımda zaten var, direkt giderim',
  'Haritada bakıyorum',
  'Sosyal medyadan ilham alıyorum',
  'Birine soruyorum',
  'Uygulama önerisine bakıyorum',
]

const ROUTE_PROBLEMS = [
  'Trafik / toplu taşıma belirsizliği',
  'Birden fazla durak varsa koordinasyon',
  'Otopark / araç bırakma yeri',
  'Süreyi tahmin edemiyorum',
  'Yeni bir mahallede kayboluyorum',
  'Sorun yaşamıyorum',
]

const VENUE_QUIT = [
  'Fiyatı yüksek çıkınca',
  'Kapalı / dolu olduğunu öğrenince',
  'Çok uzak olduğunu görünce',
  'Yorumlar güven vermeyince',
  'Karar veremeyip bıkıyorum',
]

const TRANSPORT_PREF = [
  'En hızlı yol',
  'En ucuz yol',
  'Konfor (araçla gitmek)',
  'Yürünebilir mesafe tercih ederim',
  'Çevreye duyarlı seçenekler',
]

const MISSING_FILTERS = [
  'Mekanın atmosferi / vibes',
  'Beslenme tercihi (vegan, glütensiz...)',
  'Kalabalık bilgisi (şu an ne kadar dolu?)',
  'Güncel çalışma saati',
  'Evcil hayvan dostu mu?',
  'Wi-Fi / çalışmaya uygun mu?',
]

function toggleMax<T>(arr: T[], item: T, max: number): T[] {
  if (arr.includes(item)) return arr.filter((x) => x !== item)
  if (arr.length >= max) return arr
  return [...arr, item]
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export default function StepOne({ data, onChange }: StepOneProps) {
  return (
    <div className="space-y-8">
      {/* Decision method */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
          Nereye gideceğine nasıl karar veriyorsun?
        </p>
        <div className="flex flex-wrap gap-2">
          {DECISION_METHODS.map((m) => (
            <button
              key={m}
              id={`decision-${m.replace(/[\s/,]+/g, '-').toLowerCase().slice(0, 30)}`}
              onClick={() => onChange({ decision_method: toggle(data.decision_method, m) })}
              className={`chip${data.decision_method.includes(m) ? ' selected' : ''}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Route problems — max 2 */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
          Rota çizerken en çok hangi sorunla karşılaşıyorsun?{' '}
          <span className="normal-case font-normal">(2 seçim)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {ROUTE_PROBLEMS.map((p) => (
            <button
              key={p}
              id={`route-${p.replace(/[\s/]+/g, '-').toLowerCase().slice(0, 30)}`}
              onClick={() =>
                onChange({ route_problems: toggleMax(data.route_problems, p, 2) })
              }
              className={`chip${data.route_problems.includes(p) ? ' selected' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Venue quit */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
          Mekan seçerken ne zaman vazgeçiyorsun?
        </p>
        <div className="flex flex-wrap gap-2">
          {VENUE_QUIT.map((v) => (
            <button
              key={v}
              id={`venue-${v.replace(/[\s/]+/g, '-').toLowerCase().slice(0, 30)}`}
              onClick={() => onChange({ venue_quit: toggle(data.venue_quit, v) })}
              className={`chip${data.venue_quit.includes(v) ? ' selected' : ''}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Transport */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
          Ulaşım tercihini ne belirliyor?
        </p>
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_PREF.map((t) => (
            <button
              key={t}
              id={`transport-${t.replace(/[\s/()]+/g, '-').toLowerCase().slice(0, 30)}`}
              onClick={() => onChange({ transport_pref: toggle(data.transport_pref, t) })}
              className={`chip${data.transport_pref.includes(t) ? ' selected' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Missing filters */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
          Kişisel tercihlerine göre mekan filtrelerken ne eksik kalıyor?
        </p>
        <div className="flex flex-wrap gap-2">
          {MISSING_FILTERS.map((f) => (
            <button
              key={f}
              id={`filter-${f.replace(/[\s/()?]+/g, '-').toLowerCase().slice(0, 30)}`}
              onClick={() => onChange({ missing_filters: toggle(data.missing_filters, f) })}
              className={`chip${data.missing_filters.includes(f) ? ' selected' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Experience note */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
          Bir deneyimini anlat — planın tutmadığı bir an{' '}
          <span className="normal-case font-normal">(opsiyonel)</span>
        </p>
        <textarea
          id="experience-note"
          rows={3}
          placeholder="Örnek: Kafenin kapalı olduğunu kapıda öğrendim, 30 dk geri döndüm…"
          value={data.experience_note}
          onChange={(e) => onChange({ experience_note: e.target.value })}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition"
        />
      </div>
    </div>
  )
}

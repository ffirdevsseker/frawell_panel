'use client'

import { SurveyData } from '@/types/survey'

interface Step3Props {
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

const TRANSPORT_PREF = [
  'En hızlı yol',
  'En ucuz yol',
  'Konfor (araçla gitmek)',
  'Yürünebilir mesafe tercih ederim',
  'Çevreye duyarlı seçenekler',
]

function toggleMax<T>(arr: T[], item: T, max: number): T[] {
  if (arr.includes(item)) return arr.filter((x) => x !== item)
  if (arr.length >= max) return arr
  return [...arr, item]
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export default function Step3({ data, onChange }: Step3Props) {
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
    </div>
  )
}

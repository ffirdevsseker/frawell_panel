'use client'

import { SurveyData } from '@/types/survey'

interface Step4Props {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

const VENUE_QUIT = [
  'Fiyatı yüksek çıkınca',
  'Kapalı / dolu olduğunu öğrenince',
  'Çok uzak olduğunu görünce',
  'Yorumlar güven vermeyince',
  'Karar veremeyip bıkıyorum',
]

const MISSING_FILTERS = [
  'Mekanın atmosferi / vibes',
  'Beslenme tercihi (vegan, glütensiz...)',
  'Kalabalık bilgisi (şu an ne kadar dolu?)',
  'Güncel çalışma saati',
  'Evcil hayvan dostu mu?',
  'Wi-Fi / çalışmaya uygun mu?',
]

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export default function Step4({ data, onChange }: Step4Props) {
  return (
    <div className="space-y-8">
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

'use client'

import { motion } from 'framer-motion'
import { SurveyData } from '@/types/survey'

interface StepZeroProps {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

const AGE_RANGES = ['13-17', '18-24', '25-34', '35-44', '45+'] as const
const GENDERS = ['Kadın', 'Erkek', 'Belirtmek istemiyorum'] as const
const CITIES = ['İstanbul', 'İzmir', 'Ankara', 'Bursa', 'Antalya', 'Diğer'] as const
const APP_COUNTS = ['Sadece 1', '2-3 uygulama', '4 veya daha fazla'] as const
const APPS = [
  { label: 'Google Maps', icon: '🗺️' },
  { label: 'Instagram / TikTok', icon: '📸' },
  { label: 'TripAdvisor', icon: '✈️' },
  { label: 'Yemeksepeti / Getir', icon: '🍔' },
  { label: 'Foursquare', icon: '📍' },
  { label: 'Trafi / Moovit', icon: '🚇' },
  { label: 'Booking / Airbnb', icon: '🏨' },
  { label: 'Uygulama kullanmıyorum', icon: '🙅' },
]

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
        {label}
      </p>
      {children}
    </div>
  )
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export default function StepZero({ data, onChange }: StepZeroProps) {
  const sliderPct = (data.outings_per_week / 7) * 100

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-7"
    >
      {/* Age */}
      <motion.div variants={item}>
        <Section label="Yaş aralığın">
          <div className="flex flex-wrap gap-2">
            {AGE_RANGES.map((r) => (
              <button
                key={r}
                id={`age-${r}`}
                onClick={() => onChange({ age_range: r })}
                className={`chip${data.age_range === r ? ' selected' : ''}`}
              >
                {r}
              </button>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Gender */}
      <motion.div variants={item}>
        <Section label="Cinsiyet (opsiyonel)">
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                id={`gender-${g.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => onChange({ gender: g })}
                className={`chip${data.gender === g ? ' selected' : ''}`}
              >
                {g}
              </button>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* City */}
      <motion.div variants={item}>
        <Section label="Bulunduğun şehir">
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                id={`city-${c.toLowerCase()}`}
                onClick={() => onChange({ city: c })}
                className={`chip${data.city === c ? ' selected' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Slider */}
      <motion.div variants={item}>
        <Section label="Haftada kaç kez dışarı çıkarsın?">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Neredeyse hiç</span>
              <span className="font-bold text-indigo-600 text-sm">
                {data.outings_per_week % 1 === 0
                  ? `${data.outings_per_week} gün`
                  : `${data.outings_per_week} gün`}
              </span>
            </div>
            <input
              id="outings-slider"
              type="range"
              min={0}
              max={7}
              step={0.5}
              value={data.outings_per_week}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                onChange({ outings_per_week: val })
                e.target.style.setProperty('--pct', `${(val / 7) * 100}%`)
              }}
              style={{ '--pct': `${sliderPct}%` } as React.CSSProperties}
            />
            <div className="flex justify-between text-xs text-slate-300">
              {[0,1,2,3,4,5,6,7].map((n) => (
                <span key={n} className={data.outings_per_week >= n ? 'text-indigo-400 font-medium' : ''}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </Section>
      </motion.div>

      {/* App count */}
      <motion.div variants={item}>
        <Section label="Yer bulmak için kaç farklı uygulama kullanıyorsun?">
          <div className="flex flex-wrap gap-2">
            {APP_COUNTS.map((a) => (
              <button
                key={a}
                id={`appcount-${a.replace(/\s/g, '-').toLowerCase()}`}
                onClick={() => onChange({ app_count: a })}
                className={`chip${data.app_count === a ? ' selected' : ''}`}
              >
                {a}
              </button>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Apps used */}
      <motion.div variants={item}>
        <Section label="Şu an kullandığın uygulamalar (birden fazla)">
          <div className="flex flex-wrap gap-2">
            {APPS.map(({ label, icon }) => (
              <button
                key={label}
                id={`app-${label.replace(/[\s/]+/g, '-').toLowerCase()}`}
                onClick={() => onChange({ apps_used: toggle(data.apps_used, label) })}
                className={`chip${data.apps_used.includes(label) ? ' selected' : ''}`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </Section>
      </motion.div>
    </motion.div>
  )
}

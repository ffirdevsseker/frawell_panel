'use client'

import { motion } from 'framer-motion'
import { SurveyData, TravelCompanion } from '@/types/survey'

interface Step0Props {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

const AGE_RANGES = ['13-17', '18-24', '25-34', '35-44', '45+'] as const
const GENDERS = ['Kadın', 'Erkek', 'Belirtmek istemiyorum'] as const
const CITIES = ['İstanbul', 'İzmir', 'Ankara', 'Bursa', 'Antalya', 'Diğer'] as const
const COMPANIONS: { label: TravelCompanion; icon: string }[] = [
  { label: 'Tek başıma', icon: '🧍' },
  { label: 'Arkadaşlarımla', icon: '👯' },
  { label: 'Partnerimle', icon: '💑' },
  { label: 'Ailemle', icon: '👨‍👩‍👧' },
  { label: 'Değişir, duruma göre', icon: '🔀' },
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export default function Step0({ data, onChange }: Step0Props) {
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

      {/* Travel companions */}
      <motion.div variants={item}>
        <Section label="Genelde kiminle gezersin?">
          <div className="flex flex-wrap gap-2">
            {COMPANIONS.map(({ label, icon }) => (
              <button
                key={label}
                id={`companion-${label.replace(/[\s,]+/g, '-').toLowerCase()}`}
                onClick={() => onChange({ travel_companions: label })}
                className={`chip${data.travel_companions === label ? ' selected' : ''}`}
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

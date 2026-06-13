'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { SurveyData } from '@/types/survey'
import { Locale } from '@/i18n/config'
import { getOptionLabel } from '@/lib/optionLabels'

interface Step1Props {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

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
  show: { transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export default function Step1({ data, onChange }: Step1Props) {
  const t = useTranslations('survey.step1')
  const locale = useLocale() as Locale
  const sliderPct = (data.outings_per_week / 7) * 100

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-7"
    >
      {/* Slider */}
      <motion.div variants={item}>
        <Section label={t('outingsLabel')}>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t('almostNever')}</span>
              <span className="font-bold text-indigo-600 text-sm">
                {data.outings_per_week} {t('dayUnit')}
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
        <Section label={t('appCountLabel')}>
          <div className="flex flex-wrap gap-2">
            {APP_COUNTS.map((a) => (
              <button
                key={a}
                id={`appcount-${a.replace(/\s/g, '-').toLowerCase()}`}
                onClick={() => onChange({ app_count: a })}
                className={`chip${data.app_count === a ? ' selected' : ''}`}
              >
                {getOptionLabel(a, locale)}
              </button>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Apps used */}
      <motion.div variants={item}>
        <Section label={t('appsUsedLabel')}>
          <div className="flex flex-wrap gap-2">
            {APPS.map(({ label, icon }) => (
              <button
                key={label}
                id={`app-${label.replace(/[\s/]+/g, '-').toLowerCase()}`}
                onClick={() => onChange({ apps_used: toggle(data.apps_used, label) })}
                className={`chip${data.apps_used.includes(label) ? ' selected' : ''}`}
              >
                <span>{icon}</span>
                {getOptionLabel(label, locale)}
              </button>
            ))}
          </div>
        </Section>
      </motion.div>
    </motion.div>
  )
}

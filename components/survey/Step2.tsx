'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { SurveyData } from '@/types/survey'
import { Locale } from '@/i18n/config'
import { getOptionLabel } from '@/lib/optionLabels'

interface Step2Props {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

const MOTIVATIONS = [
  '🗺️ Yeni yerler keşfetmek',
  '📚 Tarihi ve hikayeleri öğrenmek',
  '🍜 Yöresel lezzetleri tatmak',
  '🤝 Yerel halkla / kültürle tanışmak',
  '🎉 Arkadaşlarla sosyalleşmek',
  '🧘 Stres atmak, dinlenmek',
  '🎯 Plansız bir sürpriz/macera yaşamak',
  '📸 Unutulmaz fotoğraflar/anılar biriktirmek',
]

const MAX_MOTIVATIONS = 3

function toggleMax<T>(arr: T[], item: T, max: number): T[] {
  if (arr.includes(item)) return arr.filter((x) => x !== item)
  if (arr.length >= max) return arr
  return [...arr, item]
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export default function Step2({ data, onChange }: Step2Props) {
  const t = useTranslations('survey.step2')
  const locale = useLocale() as Locale
  const count = data.travel_motivations.length

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-7">
      {/* Motivations */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            {t('motivationsLabel')}
          </p>
          <span className="text-[11px] font-medium text-indigo-400">
            {count}/{MAX_MOTIVATIONS}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOTIVATIONS.map((m) => {
            const selected = data.travel_motivations.includes(m)
            const disabled = !selected && count >= MAX_MOTIVATIONS
            return (
              <button
                key={m}
                id={`motivation-${m.replace(/[^\p{L}\s]/gu, '').trim().replace(/\s+/g, '-').toLowerCase()}`}
                disabled={disabled}
                onClick={() => onChange({ travel_motivations: toggleMax(data.travel_motivations, m, MAX_MOTIVATIONS) })}
                className={`chip${selected ? ' selected' : ''}${disabled ? ' opacity-40 cursor-not-allowed' : ''}`}
              >
                {getOptionLabel(m, locale)}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Memorable moment */}
      <motion.div variants={item}>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
          {t('bonusLabel')} <span className="normal-case font-normal text-slate-400">({t('optional')})</span>
        </p>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">
          {t('memorableHelp')}
        </p>
        <textarea
          id="memorable-moment"
          rows={3}
          placeholder={t('memorablePlaceholder')}
          value={data.memorable_moment}
          onChange={(e) => onChange({ memorable_moment: e.target.value })}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition"
        />
      </motion.div>
    </motion.div>
  )
}

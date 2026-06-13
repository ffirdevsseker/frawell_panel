'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { SurveyData } from '@/types/survey'

interface Step5Props {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

const PROBLEMS = [
  {
    id: 'platform-kaosasi',
    emoji: '🗺️',
    selectedBorder: 'border-indigo-500',
    selectedBg: 'from-indigo-50 to-blue-50',
  },
  {
    id: 'planlama-yorgunlugu',
    emoji: '😫',
    selectedBorder: 'border-amber-500',
    selectedBg: 'from-amber-50 to-orange-50',
  },
  {
    id: 'grup-koordinasyonu',
    emoji: '👥',
    selectedBorder: 'border-violet-500',
    selectedBg: 'from-violet-50 to-purple-50',
  },
  {
    id: 'ilham-eksikligi',
    emoji: '💡',
    selectedBorder: 'border-yellow-500',
    selectedBg: 'from-yellow-50 to-amber-50',
  },
  {
    id: 'butce-takibi',
    emoji: '💸',
    selectedBorder: 'border-emerald-500',
    selectedBg: 'from-emerald-50 to-teal-50',
  },
  {
    id: 'kisisellestime-yok',
    emoji: '🎯',
    selectedBorder: 'border-rose-500',
    selectedBg: 'from-rose-50 to-pink-50',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
}

export default function Step5({ data, onChange }: Step5Props) {
  const t = useTranslations('survey.step5')
  const selected = data.top_problems

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange({ top_problems: selected.filter((x) => x !== id) })
    } else if (selected.length < 2) {
      onChange({ top_problems: [...selected, id] })
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="text-xs font-medium text-slate-500">
          {selected.length === 0 && t('noneSelected')}
          {selected.length === 1 && (
            <span className="text-indigo-600 font-semibold">{t('oneSelected')}</span>
          )}
          {selected.length === 2 && (
            <span className="text-emerald-600 font-semibold">{t('twoSelected')}</span>
          )}
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {PROBLEMS.map((p) => {
          const isSelected = selected.includes(p.id)
          const isDisabled = !isSelected && selected.length >= 2

          return (
            <motion.button
              key={p.id}
              id={`problem-${p.id}`}
              variants={cardVariant}
              onClick={() => toggle(p.id)}
              disabled={isDisabled}
              whileHover={isDisabled ? {} : { y: -3, scale: 1.01 }}
              whileTap={isDisabled ? {} : { scale: 0.98 }}
              className={`
                relative text-left rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? `border-2 ${p.selectedBorder} bg-gradient-to-br ${p.selectedBg} shadow-md`
                  : isDisabled
                  ? 'border-slate-100 bg-slate-50/50 opacity-40 cursor-not-allowed'
                  : `border-slate-200 bg-white hover:border-slate-300 hover:shadow-md`}
              `}
            >
              {/* Selection indicator */}
              <div className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? `${p.selectedBorder} bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent` : 'border-slate-300'
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className={`text-3xl mb-2 transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
                {p.emoji}
              </div>
              <p className="font-semibold text-slate-800 text-sm mb-1 pr-6">{t(`problems.${p.id}.title`)}</p>
              <p className="text-xs text-slate-500 leading-relaxed pr-6">{t(`problems.${p.id}.desc`)}</p>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}

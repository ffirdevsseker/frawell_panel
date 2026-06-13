'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Locale } from '@/i18n/config'
import { getOptionLabel } from '@/lib/optionLabels'

interface RankingTableProps {
  data: { feature: string; score: number; rank: number }[]
}

const MEDAL = ['🥇', '🥈', '🥉']
const BAR_GRADIENT = [
  'from-amber-400 to-yellow-500',
  'from-slate-400 to-slate-500',
  'from-orange-400 to-amber-600',
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-purple-500',
  'from-slate-500 to-slate-600',
]

export default function RankingTable({ data }: RankingTableProps) {
  const t = useTranslations('dashboard.ranking')
  const locale = useLocale() as Locale
  const max = data[0]?.score || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-dark rounded-3xl p-6 relative overflow-hidden flex flex-col h-full"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="mb-6 shrink-0">
        <h3 className="text-base font-semibold text-slate-100 tracking-tight">{t('title')}</h3>
        <p className="text-sm text-slate-400 mt-1">
          {t('subtitle')}
        </p>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {data.map((item, i) => {
          const barPct = (item.score / max) * 100
          return (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              {/* Medal or rank */}
              <div className="w-8 text-center shrink-0">
                {i < 3 ? (
                  <span className="text-lg">{MEDAL[i]}</span>
                ) : (
                  <span className="text-xs font-bold text-slate-500">{item.rank}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm font-medium truncate ${i === 0 ? 'text-amber-300' : i === 1 ? 'text-slate-300' : 'text-slate-400'}`}>
                    {getOptionLabel(item.feature, locale)}
                  </span>
                  <span className="text-xs font-bold text-slate-500 ml-2 shrink-0 tabular-nums">
                    {item.score} pt
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{ delay: i * 0.07 + 0.3, duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${BAR_GRADIENT[Math.min(i, BAR_GRADIENT.length - 1)]}`}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

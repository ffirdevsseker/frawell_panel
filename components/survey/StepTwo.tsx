'use client'

import { motion } from 'framer-motion'
import { SurveyData } from '@/types/survey'

interface StepTwoProps {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

const PROBLEMS = [
  {
    id: 'platform-kaosasi',
    emoji: '🗺️',
    color: 'from-blue-500/10 to-indigo-500/10',
    border: 'border-blue-200',
    selectedBorder: 'border-indigo-500',
    selectedBg: 'from-indigo-50 to-blue-50',
    title: 'Platform karmaşası',
    desc: 'Harita, otel, bilet… sekmeler arasında kayboluyorum',
  },
  {
    id: 'planlama-yorgunlugu',
    emoji: '😫',
    color: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-200',
    selectedBorder: 'border-amber-500',
    selectedBg: 'from-amber-50 to-orange-50',
    title: 'Planlama yorgunluğu',
    desc: 'Araştırmak çok zaman alıyor, sonunda iptal ediyorum',
  },
  {
    id: 'grup-koordinasyonu',
    emoji: '👥',
    color: 'from-violet-500/10 to-purple-500/10',
    border: 'border-violet-200',
    selectedBorder: 'border-violet-500',
    selectedBg: 'from-violet-50 to-purple-50',
    title: 'Grup koordinasyonu',
    desc: 'Herkesi aynı planda buluşturmak imkânsız gibi',
  },
  {
    id: 'ilham-eksikligi',
    emoji: '💡',
    color: 'from-yellow-500/10 to-amber-500/10',
    border: 'border-yellow-200',
    selectedBorder: 'border-yellow-500',
    selectedBg: 'from-yellow-50 to-amber-50',
    title: 'İlham eksikliği',
    desc: 'Nereye gideceğimi bulmak, karar vermekten daha zor',
  },
  {
    id: 'butce-takibi',
    emoji: '💸',
    color: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-200',
    selectedBorder: 'border-emerald-500',
    selectedBg: 'from-emerald-50 to-teal-50',
    title: 'Bütçe takibi',
    desc: 'Harcamaları takip etmek gezi bittikten sonra baş ağrısı',
  },
  {
    id: 'kisisellestime-yok',
    emoji: '🎯',
    color: 'from-rose-500/10 to-pink-500/10',
    border: 'border-rose-200',
    selectedBorder: 'border-rose-500',
    selectedBg: 'from-rose-50 to-pink-50',
    title: 'Kişiselleştirme yok',
    desc: 'Öneriler benim zevkime hiç uymuyor, hep genel kalıyor',
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

export default function StepTwo({ data, onChange }: StepTwoProps) {
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
          {selected.length === 0 && 'Henüz seçilmedi'}
          {selected.length === 1 && (
            <span className="text-indigo-600 font-semibold">1 seçildi · 1 hakkın daha var</span>
          )}
          {selected.length === 2 && (
            <span className="text-emerald-600 font-semibold">✓ Harika! 2 seçim tamamlandı</span>
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
              <p className="font-semibold text-slate-800 text-sm mb-1 pr-6">{p.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed pr-6">{p.desc}</p>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}

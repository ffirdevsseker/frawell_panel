'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { SurveyData } from '@/types/survey'

interface Step8Props {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

export default function Step8({ data, onChange }: Step8Props) {
  const t = useTranslations('survey.step8')
  const perks = t.raw('perks') as { icon: string; title: string; desc: string }[]
  return (
    <div className="space-y-7">
      {/* Magic wand wish */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
          {t('magicWandLabel')}
        </p>
        <p className="text-sm text-slate-500 leading-relaxed">
          {t('magicWandHelpPrefix')}{' '}
          <span className="font-medium text-slate-700">{t('magicWandHelpQuote')}</span>{' '}
          {t('magicWandHelpSuffix')}
        </p>
        <textarea
          id="magic-wand-wish"
          rows={4}
          placeholder={t('magicWandPlaceholder')}
          value={data.magic_wand_wish}
          onChange={(e) => onChange({ magic_wand_wish: e.target.value })}
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 resize-none transition-all"
        />
      </div>

      <hr className="border-slate-100" />

      {/* Early access */}
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">
            {t('earlyAccessLabel')}
          </p>
          <p className="text-base font-bold text-slate-900">
            {t('earlyAccessHeading')}
          </p>
        </div>

        {/* Perks */}
        <div className="space-y-2.5">
          {perks.map((perk) => (
            <motion.div
              key={perk.title}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100"
            >
              <span className="text-xl shrink-0">{perk.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{perk.title}</p>
                <p className="text-xs text-slate-500">{perk.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Email input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            id="email-input"
            type="email"
            placeholder={t('emailPlaceholder')}
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all"
          />
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t('privacyNote')}
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Step0 from './Step0'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'
import Step7 from './Step7'
import Step8 from './Step8'
import { SurveyData, INITIAL_SURVEY_DATA } from '@/types/survey'
import { computeTravelerPersona, getPersonaByKey } from '@/lib/persona'
import { Locale } from '@/i18n/config'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const STEP_META = [
  { number: 0, emoji: '🧭' },
  { number: 1, emoji: '🚶' },
  { number: 2, emoji: '✨' },
  { number: 3, emoji: '🗺️' },
  { number: 4, emoji: '📍' },
  { number: 5, emoji: '⚡' },
  { number: 6, emoji: '🔮' },
  { number: 7, emoji: '🚀' },
  { number: 8, emoji: '🪄' },
]

const TOTAL = STEP_META.length

const pageVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] },
  }),
}

const FLOATING_ICONS = ['✈️','🗺️','☕','🏙️','🚇','🍜','🎭','🌅','🧭','🏨','🎮','🏆','✨','📸']

export default function SurveyShell() {
  const t = useTranslations('survey')
  const locale = useLocale() as Locale
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState<SurveyData>(INITIAL_SURVEY_DATA)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function patch(p: Partial<SurveyData>) {
    setData((prev) => ({ ...prev, ...p }))
  }

  function next() {
    setDir(1)
    setStep((s) => Math.min(s + 1, TOTAL - 1))
  }

  function back() {
    setDir(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  async function submit() {
    setLoading(true)
    setError(null)
    const persona = computeTravelerPersona(data)
    const payload: SurveyData = { ...data, traveler_persona: persona.key }
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(t('errors.submitFailed'))
      setData(payload)
      setSubmitted(true)
    } catch {
      setError(t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  // ── Thank you / Gezgin Tipi reveal screen ──
  if (submitted) {
    const persona = getPersonaByKey(computeTravelerPersona(data).key, locale)
    return (
      <div className="survey-bg min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
        {mounted && FLOATING_ICONS.map((icon, i) => (
          <motion.div
            key={icon}
            className="absolute text-2xl pointer-events-none select-none opacity-[0.07]"
            style={{ left: `${(i * 137.5) % 100}%`, top: `${(i * 73) % 100}%` }}
            animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          >
            {icon}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl relative z-10"
        >
          {/* Persona badge */}
          <div className="persona-badge persona-glow mx-auto mb-5 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-teal-400 flex items-center justify-center text-5xl shadow-xl">
            {persona.emoji}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[11px] font-semibold tracking-widest uppercase text-indigo-400 mb-1">
              {t('thankYou.personaLabel')}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{persona.title}</h2>
            <p className="text-sm font-medium gradient-text-teal mb-4">{persona.tagline}</p>
            <p className="text-slate-500 text-sm leading-relaxed">{persona.description}</p>
          </motion.div>

          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-slate-100 my-6"
          />

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg font-bold text-slate-900 mb-2"
          >
            {t('thankYou.heading')}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-slate-500 text-sm leading-relaxed mb-6"
          >
            {t('thankYou.body')}
          </motion.p>

          {data.email && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="inline-flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2 mb-4"
            >
              <span>📬</span>
              <span>{t('thankYou.emailNotice', { email: data.email })}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {t('thankYou.dashboardCta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const stepCopy = t.raw('steps') as { title: string; subtitle: string; cta: string }[]
  const current = { ...STEP_META[step], ...stepCopy[step] }

  return (
    <div className="survey-bg min-h-screen relative overflow-hidden">
      {/* Floating background icons */}
      {mounted && FLOATING_ICONS.map((icon, i) => (
        <motion.div
          key={icon}
          className="absolute text-2xl pointer-events-none select-none opacity-[0.07]"
          style={{
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 73) % 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        >
          {icon}
        </motion.div>
      ))}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200">
            F
          </div>
          <span className="text-sm font-semibold text-slate-700">Frawell</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-medium">
            {t('topBarStop', { current: step + 1, total: TOTAL })}
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main card */}
      <div className="relative z-10 flex justify-center px-4 pt-2 pb-16">
        <div className="w-full max-w-xl">
          {/* Journey progress — "Gezgin Rotası" */}
          <div className="mb-4 px-2">
            <div className="journey-track">
              <div className="journey-line" />
              <div
                className="journey-line-fill"
                style={{ width: `${(step / (TOTAL - 1)) * 100}%` }}
              />
              {STEP_META.map((s, i) => (
                <div
                  key={s.number}
                  className={`journey-stop${i < step ? ' done' : i === step ? ' active' : ''}`}
                >
                  {i < step ? '✓' : s.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <motion.div
            layout
            className="glass rounded-3xl shadow-2xl shadow-indigo-100/50 overflow-hidden"
          >
            {/* Step header */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`header-${step}`}
                custom={dir}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="px-8 pt-8 pb-6 border-b border-slate-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Step badge */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-300/40">
                      {current.number}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 leading-tight">
                      {current.emoji} {current.title}
                    </h1>
                    {current.subtitle && (
                      <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step content */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`step-${step}`}
                custom={dir}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="px-8 py-7"
              >
                {step === 0 && <Step0 data={data} onChange={patch} />}
                {step === 1 && <Step1 data={data} onChange={patch} />}
                {step === 2 && <Step2 data={data} onChange={patch} />}
                {step === 3 && <Step3 data={data} onChange={patch} />}
                {step === 4 && <Step4 data={data} onChange={patch} />}
                {step === 5 && <Step5 data={data} onChange={patch} />}
                {step === 6 && <Step6 data={data} onChange={patch} />}
                {step === 7 && <Step7 data={data} onChange={patch} />}
                {step === 8 && <Step8 data={data} onChange={patch} />}
              </motion.div>
            </AnimatePresence>

            {/* Error */}
            {error && (
              <div className="mx-8 mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Footer actions */}
            <div className="px-8 pb-8 flex items-center justify-between">
              {step > 0 ? (
                <button
                  id="btn-back"
                  onClick={back}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('back')}
                </button>
              ) : (
                <div />
              )}

              {step < TOTAL - 1 ? (
                <motion.button
                  id="btn-next"
                  onClick={next}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-300/40 hover:shadow-indigo-400/50 transition-shadow"
                >
                  {current.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              ) : (
                <motion.button
                  id="btn-submit"
                  onClick={submit}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.03 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-300/40 disabled:opacity-60 transition-all"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      {current.cta}
                      <span>✨</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

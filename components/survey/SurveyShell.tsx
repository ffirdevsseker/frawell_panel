'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StepZero from './StepZero'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import { SurveyData, INITIAL_SURVEY_DATA } from '@/types/survey'

const STEPS = [
  {
    number: 0,
    emoji: '👤',
    title: 'Seni tanıyalım',
    subtitle: 'Anonim · 1 dakika · Cevapların kimseyle paylaşılmaz',
    cta: 'Devam et',
  },
  {
    number: 1,
    emoji: '🗺️',
    title: 'Gün içinde ne oluyor?',
    subtitle: 'Bir yerden başka bir yere gittiğinde hangi süreçlerde zorlanıyorsun?',
    cta: 'Devam et',
  },
  {
    number: 2,
    emoji: '⚡',
    title: 'En büyük engelin ne?',
    subtitle: 'En fazla 2 seçim — seçimlerin özellik önceliğimizi belirleyecek',
    cta: 'Devam et',
  },
  {
    number: 3,
    emoji: '🚀',
    title: 'Ne önce gelsin?',
    subtitle: 'Sürükleyerek sırala · En üstteki = en çok istediğin özellik',
    cta: 'Bu sıralamayı gönder',
  },
  {
    number: 4,
    emoji: '💬',
    title: 'Son bir şey',
    subtitle: 'Aklında çözmemizi istediğin başka bir sorun var mı?',
    cta: 'Gönder ve bitir',
  },
]

const TOTAL = STEPS.length

const pageVariants = {
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

const FLOATING_ICONS = ['✈️','🗺️','☕','🏙️','🚇','🍜','🎭','🌅','🧭','🏨']

export default function SurveyShell() {
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
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Gönderim başarısız')
      setSubmitted(true)
    } catch {
      setError('Bir hata oluştu, lütfen tekrar dene.')
    } finally {
      setLoading(false)
    }
  }

  // ── Thank you screen ──
  if (submitted) {
    return (
      <div className="survey-bg min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-slate-900 mb-3"
          >
            Süpersin, teşekkürler!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 text-sm leading-relaxed mb-6"
          >
            Cevapların Frawell&apos;i şekillendiriyor. Şehri gerçekten anlayan, seni
            gezdiren bir uygulama yapıyoruz — ve sen de bir parçasısın.
          </motion.p>
          {data.email && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2"
            >
              <span>📬</span>
              <span>{data.email} adresine haber vereceğiz</span>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-center gap-3"
          >
            {['✈️','🗺️','☕','🏙️','🌅'].map((icon, i) => (
              <motion.span
                key={icon}
                animate={{ y: [0, -8, 0] }}
                transition={{ delay: i * 0.15, repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="text-xl"
              >
                {icon}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const current = STEPS[step]

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
        <div className="text-xs text-slate-400 font-medium">
          {step + 1} / {TOTAL}
        </div>
      </div>

      {/* Main card */}
      <div className="relative z-10 flex justify-center px-4 pt-4 pb-16">
        <div className="w-full max-w-xl">
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
                {step === 0 && <StepZero data={data} onChange={patch} />}
                {step === 1 && <StepOne data={data} onChange={patch} />}
                {step === 2 && <StepTwo data={data} onChange={patch} />}
                {step === 3 && <StepThree data={data} onChange={patch} />}
                {step === 4 && <StepFour data={data} onChange={patch} />}
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
                  Geri
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
                      Gönderiliyor…
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

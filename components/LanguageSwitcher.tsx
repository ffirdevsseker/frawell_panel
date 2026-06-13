'use client'

import { useLocaleSwitcher } from '@/components/LocaleProvider'

const OPTIONS: { code: 'tr' | 'en'; label: string }[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
]

export default function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { locale, setLocale, isPending } = useLocaleSwitcher()

  const isDark = variant === 'dark'

  return (
    <div
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-full border ${
        isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/80'
      }`}
    >
      {OPTIONS.map((opt) => {
        const active = opt.code === locale
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLocale(opt.code)}
            disabled={isPending}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-all disabled:opacity-60 ${
              active
                ? isDark
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

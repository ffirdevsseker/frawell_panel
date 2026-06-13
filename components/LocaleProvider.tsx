'use client'

import { createContext, useContext, useState, useTransition } from 'react'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Locale, LOCALE_COOKIE } from '@/i18n/config'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  isPending: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocaleSwitcher() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocaleSwitcher must be used within LocaleProvider')
  return ctx
}

export default function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale
  messages: AbstractIntlMessages
  children: React.ReactNode
}) {
  const [currentLocale, setCurrentLocale] = useState(locale)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function setLocale(next: Locale) {
    if (next === currentLocale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`
    setCurrentLocale(next)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <LocaleContext.Provider value={{ locale: currentLocale, setLocale, isPending }}>
      <NextIntlClientProvider locale={currentLocale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}

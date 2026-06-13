import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import type { AbstractIntlMessages } from 'next-intl'
import LocaleProvider from '@/components/LocaleProvider'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/i18n/config'
import trMessages from '@/messages/tr.json'
import enMessages from '@/messages/en.json'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const MESSAGES = { tr: trMessages, en: enMessages }

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale
  const messages = MESSAGES[locale]

  return {
    title: messages.meta.title,
    description: messages.meta.description,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale
  const messages = MESSAGES[locale]

  return (
    <html lang={locale} className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <LocaleProvider locale={locale} messages={messages as unknown as AbstractIntlMessages}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}

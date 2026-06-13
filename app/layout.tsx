import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Frawell — Şehri daha iyi tanı',
  description:
    'Frawell uygulamasını birlikte şekillendiriyoruz. Sana özel rotalar, anlık mekan bilgisi ve grup planlaması — hepsi tek ekranda.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  )
}

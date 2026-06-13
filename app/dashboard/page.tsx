import type { Metadata } from 'next'
import Link from 'next/link'
import DashboardClient from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
  title: 'Frawell Dashboard — Kurucu Görünümü',
  description: 'Anket yanıtları ve kullanıcı yönelim analizi',
}

export default function DashboardPage() {
  return (
    <div className="dash-bg min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 glass-dark border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + title */}
          <div className="flex items-center gap-4">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-black text-lg">F</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base tracking-tight">Frawell</span>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Dashboard
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">Kurucu Analiz Paneli</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <div className="relative w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400">Canlı</span>
            </div>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              Ankete git
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Page header */}
      <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Kullanıcı{' '}
              <span className="gradient-text lg:mr-2">Yönelim Analizi</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Anket yanıtları ve pazar analizleri — Supabase Realtime ile canlı senkronizasyon.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-[1400px] mx-auto px-6 pb-16">
        <DashboardClient />
      </main>
    </div>
  )
}

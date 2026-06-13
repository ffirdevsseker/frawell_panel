'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import StatCard from '@/components/dashboard/StatCard'
import { HBarChart, VBarChart, PieChartCard } from '@/components/dashboard/Charts'
import RankingTable from '@/components/dashboard/RankingTable'
import EmailList from '@/components/dashboard/EmailList'
import ResponseFeed from '@/components/dashboard/ResponseFeed'

interface DbResponse {
  id: string
  created_at: string
  age_range: string | null
  gender: string | null
  city: string | null
  travel_companions: string | null
  outings_per_week: number | null
  app_count: string | null
  apps_used: string[] | null
  travel_motivations: string[] | null
  memorable_moment: string | null
  decision_method: string[] | null
  route_problems: string[] | null
  venue_quit: string[] | null
  transport_pref: string[] | null
  missing_filters: string[] | null
  experience_note: string | null
  top_problems: string[] | null
  ai_guide_appeal: string | null
  personalization_appeal: string | null
  gamification_appeal: string | null
  avatar_quest_appeal: string | null
  local_deals_appeal: string | null
  feature_ranking: string[] | null
  magic_wand_wish: string | null
  email: string | null
  traveler_persona: string | null
}

/* ── Helpers ── */
function countArray(rows: DbResponse[], field: keyof DbResponse) {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    const val = row[field]
    if (Array.isArray(val)) {
      for (const v of val) { counts[v] = (counts[v] || 0) + 1 }
    } else if (typeof val === 'string' && val) {
      counts[val] = (counts[val] || 0) + 1
    }
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

function computeFeatureRanking(rows: DbResponse[]) {
  const N = 7
  const scores: Record<string, number> = {}
  for (const row of rows) {
    if (!row.feature_ranking) continue
    row.feature_ranking.forEach((f, idx) => {
      scores[f] = (scores[f] || 0) + (N - idx)
    })
  }
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([feature, score], i) => ({ feature, score, rank: i + 1 }))
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

/* ── Skeleton ── */
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/5 animate-pulse ${className}`} />
  )
}

export default function DashboardClient() {
  const t = useTranslations('dashboard')
  const [rows, setRows] = useState<DbResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [newPing, setNewPing] = useState(false)

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setRows(data as DbResponse[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses' }, (payload) => {
        setRows((prev) => [payload.new as DbResponse, ...prev])
        setNewPing(true)
        setTimeout(() => setNewPing(false), 3000)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchAll])

  /* Loading */
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-56" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  /* ── Computed ── */
  const today = new Date()
  const todayCount = rows.filter((r) => isSameDay(new Date(r.created_at), today)).length
  const emails = [...new Set(rows.map((r) => r.email).filter(Boolean) as string[])]
  const openTexts = rows.filter((r) => r.magic_wand_wish?.trim()).map((r) => ({
    id: r.id, text: r.magic_wand_wish!, created_at: r.created_at,
  }))

  const ageData = countArray(rows, 'age_range')
  const cityData = countArray(rows, 'city')
  const appsData = countArray(rows, 'apps_used')
  const problemLabels = t.raw('problemLabels') as Record<string, string>
  const problemsData = countArray(rows, 'top_problems').map((p) => ({
    ...p, name: problemLabels[p.name] || p.name,
  }))
  const transportData = countArray(rows, 'transport_pref')
  const missingFiltersData = countArray(rows, 'missing_filters')
  const featureRanking = computeFeatureRanking(rows)

  return (
    <div className="space-y-6">
      {/* New response toast */}
      {newPing && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-semibold shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {t('toastNewResponse')}
        </motion.div>
      )}

      {/* Row 1: Hero stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="📊"
          label={t('stats.totalResponses')}
          value={rows.length}
          gradient="from-indigo-500 to-violet-600"
          delay={0}
        />
        <StatCard
          icon="📅"
          label={t('stats.today')}
          value={todayCount}
          sub={t('stats.newResponses')}
          gradient="from-violet-500 to-purple-600"
          delay={0.08}
        />
        <StatCard
          icon="📬"
          label={t('stats.earlyAccess')}
          value={emails.length}
          sub={t('stats.uniqueEmails')}
          gradient="from-emerald-500 to-teal-600"
          delay={0.16}
        />
        <StatCard
          icon="🪄"
          label={t('stats.magicWish')}
          value={openTexts.length}
          sub={t('stats.freeText')}
          gradient="from-amber-500 to-orange-600"
          delay={0.24}
        />
      </div>

      {/* Demographics */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 px-1">
          {t('sections.demographics')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PieChartCard
              title={t('charts.cityTitle')}
              subtitle={t('charts.citySubtitle')}
              data={cityData}
            />
          </div>
          <div className="lg:col-span-2">
            <VBarChart
              title={t('charts.ageTitle')}
              subtitle={t('charts.ageSubtitle')}
              data={ageData}
            />
          </div>
        </div>
      </div>

      {/* Behavior & Preferences */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 px-1">
          {t('sections.behavior')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RankingTable data={featureRanking} />
          </div>
          <div className="lg:col-span-1">
            <HBarChart
              title={t('charts.problemsTitle')}
              subtitle={t('charts.problemsSubtitle')}
              data={problemsData}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HBarChart
            title={t('charts.appsTitle')}
            subtitle={t('charts.appsSubtitle')}
            data={appsData}
          />
          <HBarChart
            title={t('charts.transportTitle')}
            subtitle={t('charts.transportSubtitle')}
            data={transportData}
          />
          <HBarChart
            title={t('charts.missingFiltersTitle')}
            subtitle={t('charts.missingFiltersSubtitle')}
            data={missingFiltersData}
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="space-y-4 pb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 px-1">
          {t('sections.feedback')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <ResponseFeed responses={openTexts} />
          </div>
          <div className="lg:col-span-2">
            <EmailList emails={emails} />
          </div>
        </div>
      </div>
    </div>
  )
}

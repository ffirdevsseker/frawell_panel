'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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
  outings_per_week: number | null
  app_count: string | null
  apps_used: string[] | null
  decision_method: string[] | null
  route_problems: string[] | null
  venue_quit: string[] | null
  transport_pref: string[] | null
  missing_filters: string[] | null
  experience_note: string | null
  top_problems: string[] | null
  feature_ranking: string[] | null
  open_feedback: string | null
  email: string | null
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
  const N = 6
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

const PROBLEM_LABELS: Record<string, string> = {
  'platform-kaosasi': 'Platform karmaşası',
  'planlama-yorgunlugu': 'Planlama yorgunluğu',
  'grup-koordinasyonu': 'Grup koordinasyonu',
  'ilham-eksikligi': 'İlham eksikliği',
  'butce-takibi': 'Bütçe takibi',
  'kisisellestime-yok': 'Kişiselleştirme yok',
}

/* ── Skeleton ── */
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/5 animate-pulse ${className}`} />
  )
}

export default function DashboardClient() {
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
  const openTexts = rows.filter((r) => r.open_feedback?.trim()).map((r) => ({
    id: r.id, text: r.open_feedback!, created_at: r.created_at,
  }))

  const ageData = countArray(rows, 'age_range')
  const cityData = countArray(rows, 'city')
  const appsData = countArray(rows, 'apps_used')
  const problemsData = countArray(rows, 'top_problems').map((p) => ({
    ...p, name: PROBLEM_LABELS[p.name] || p.name,
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
          Yeni yanıt geldi!
        </motion.div>
      )}

      {/* Row 1: Hero stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="📊"
          label="Toplam Yanıt"
          value={rows.length}
          gradient="from-indigo-500 to-violet-600"
          delay={0}
        />
        <StatCard
          icon="📅"
          label="Bugün"
          value={todayCount}
          sub="yeni yanıt"
          gradient="from-violet-500 to-purple-600"
          delay={0.08}
        />
        <StatCard
          icon="📬"
          label="Erken Erişim"
          value={emails.length}
          sub="benzersiz e-posta"
          gradient="from-emerald-500 to-teal-600"
          delay={0.16}
        />
        <StatCard
          icon="💬"
          label="Açık Yanıt"
          value={openTexts.length}
          sub="serbest metin"
          gradient="from-amber-500 to-orange-600"
          delay={0.24}
        />
      </div>

      {/* Row 2: 3 Columns - Top Level Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PieChartCard 
            title="Şehir Dağılımı" 
            subtitle="Katılımcıların yaşadığı şehirler" 
            data={cityData} 
          />
        </div>
        <div className="lg:col-span-2">
          <HBarChart
            title="En Büyük Problemler"
            subtitle="Kullanıcıların en önemli gördüğü 2 ana sorun"
            data={problemsData}
          />
        </div>
      </div>

      {/* Row 3: 3 Columns - Priority & Age */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RankingTable data={featureRanking} />
        </div>
        <div className="lg:col-span-1">
          <VBarChart 
            title="Yaş Dağılımı" 
            subtitle="Hangi yaş gruplarından geliyorlar?" 
            data={ageData} 
          />
        </div>
      </div>

      {/* Row 4: Secondary Bar Charts (3x) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HBarChart
          title="Uygulamalar"
          subtitle="Mevcut tercih edilen araçlar"
          data={appsData}
        />
        <HBarChart
          title="Ulaşım"
          subtitle="Seyahatte öne çıkan etkenler"
          data={transportData}
        />
        <HBarChart
          title="Eksik Filtreler"
          subtitle="Mekan ararken arananlar"
          data={missingFiltersData}
        />
      </div>

      {/* Row 5: Qualitative Data */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-10">
        <div className="lg:col-span-3">
          <ResponseFeed responses={openTexts} />
        </div>
        <div className="lg:col-span-2">
          <EmailList emails={emails} />
        </div>
      </div>
    </div>
  )
}

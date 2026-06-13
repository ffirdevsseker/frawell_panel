'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
} from 'recharts'
import { motion } from 'framer-motion'

const TOOLTIP_STYLE = {
  background: 'rgba(10,10,30,0.95)',
  border: '1px solid rgba(99,102,241,0.25)',
  borderRadius: 12,
  color: '#e2e8f0',
  fontSize: 12,
  padding: '8px 12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
}

const CURSOR_STYLE = { fill: 'rgba(99,102,241,0.06)', radius: 6 }

// Gradient indigo palette
const INDIGO_PALETTE = ['#818cf8','#6366f1','#4f46e5','#4338ca','#a5b4fc','#c7d2fe']
const PIE_COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899']

/* ── Card wrapper ── */
function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-dark rounded-3xl p-6 relative overflow-hidden h-full flex flex-col"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="mb-6 shrink-0">
        <h3 className="text-base font-semibold text-slate-100 tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="flex-1 w-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  )
}

/* ── Horizontal Bar ── */
interface HBarChartProps {
  title: string
  subtitle?: string
  data: { name: string; value: number }[]
}

export function HBarChart({ title, subtitle, data }: HBarChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 8)
  // Auto-scaling height based on items to fit symmetrically
  const height = Math.max(sorted.length * 40, 220)

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={190}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={CURSOR_STYLE}
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: any) => [`${v ?? 0} yanıt`, '']}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22} background={{ fill: 'rgba(255,255,255,0.02)', radius: 8 }}>
            {sorted.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={`url(#bar-grad-${i % 6})`}
              />
            ))}
            {/* SVG defs for gradients */}
            <defs>
              {INDIGO_PALETTE.map((color, i) => (
                <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={color} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

/* ── Vertical Bar ── */
interface VBarChartProps {
  title: string
  subtitle?: string
  data: { name: string; value: number }[]
}

export function VBarChart({ title, subtitle, data }: VBarChartProps) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={CURSOR_STYLE}
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number) => [`${v} kişi`, '']}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={36}>
            {data.map((_, i) => (
              <Cell key={i} fill={INDIGO_PALETTE[i % INDIGO_PALETTE.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

/* ── Pie Chart ── */
interface PieChartCardProps {
  title: string
  subtitle?: string
  data: { name: string; value: number }[]
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function PieChartCard({ title, subtitle, data }: PieChartCardProps) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="48%"
            outerRadius={88}
            innerRadius={40}
            dataKey="value"
            nameKey="name"
            labelLine={false}
            label={renderCustomLabel}
            strokeWidth={2}
            stroke="rgba(10,10,30,0.6)"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number, name: string) => [`${v} kişi`, name]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

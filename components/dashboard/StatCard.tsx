'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  sub?: string
  icon: string
  gradient: string
  delay?: number
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return count
}

export default function StatCard({ label, value, suffix = '', sub, icon, gradient, delay = 0 }: StatCardProps) {
  const count = useCountUp(value, 1200)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative glass-dark rounded-3xl p-6 overflow-hidden group border border-white/5"
    >
      {/* Gradient glow bg */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} opacity-[0.04]`} />

      {/* Top line gradient */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradient}`} />

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} mb-5 shadow-lg text-2xl`}>
        {icon}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1 mb-1.5">
        <span className={`text-4xl font-black tracking-tight bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
          {count}
        </span>
        {suffix && <span className="text-slate-400 text-sm mb-1.5">{suffix}</span>}
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-slate-200 tracking-tight">{label}</p>
      {sub && <p className="text-xs font-medium text-slate-500 mt-1">{sub}</p>}
    </motion.div>
  )
}

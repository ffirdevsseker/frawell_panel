'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EmailListProps {
  emails: string[]
}

function downloadCSV(emails: string[]) {
  const csv = ['email', ...emails].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `frawell-erken-erisim-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function EmailList({ emails }: EmailListProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyAll() {
    navigator.clipboard.writeText(emails.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-dark rounded-3xl p-6 relative overflow-hidden flex flex-col h-full"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <h3 className="text-base font-semibold text-slate-100 tracking-tight">Erken Erişim Listesi</h3>
          <p className="text-sm text-slate-400 mt-1">
            <span className="text-emerald-400 font-semibold">{emails.length}</span> benzersiz katılımcı
          </p>
        </div>
        {emails.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              {copied ? '✓ Kopyalandı' : 'Kopyala'}
            </button>
            <button
              id="btn-export-csv"
              onClick={() => downloadCSV(emails)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-2 rounded-xl border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5"
            >
              ⬇ CSV İndir
            </button>
          </div>
        )}
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[22rem] pr-2">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-3xl mb-2 opacity-30">📭</div>
            <p className="text-xs text-slate-600">Henüz e-posta yok</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {emails.map((email, i) => (
              <motion.div
                key={email}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-xs shrink-0">
                  📬
                </div>
                <span className="text-sm text-slate-300 font-medium flex-1 truncate">{email}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(email)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-slate-400"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}

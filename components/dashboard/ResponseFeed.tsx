'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ResponseFeedProps {
  responses: { id: string; text: string; created_at: string }[]
}

const AVATARS = ['🧑', '👩', '👨', '🧔', '👱', '🧕', '👳', '🧑‍💼']

export default function ResponseFeed({ responses }: ResponseFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-dark rounded-3xl p-6 relative overflow-hidden flex flex-col h-full"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="mb-6 shrink-0">
        <h3 className="text-base font-semibold text-slate-100 tracking-tight">Kullanıcı Geribildirimleri</h3>
        <p className="text-sm text-slate-400 mt-1">
          <span className="text-amber-400 font-semibold">{responses.length}</span> serbest metin yanıtı
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-[22rem] pr-2">
        {responses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-3xl mb-2 opacity-30">💬</div>
            <p className="text-xs text-slate-600">Henüz açık metin yanıtı yok</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {responses.map((r, i) => {
              const avatar = AVATARS[i % AVATARS.length]
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl bg-white/5 border border-white/5 p-3.5 hover:bg-white/8 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-sm shrink-0 mt-0.5">
                      {avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-relaxed">{r.text}</p>
                      <p className="text-[11px] text-slate-600 mt-1.5">
                        {new Date(r.created_at).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppealLevel, SurveyData } from '@/types/survey'

interface Step6Props {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

type AppealField =
  | 'ai_guide_appeal'
  | 'personalization_appeal'
  | 'gamification_appeal'
  | 'avatar_quest_appeal'
  | 'local_deals_appeal'

interface Scenario {
  key: AppealField
  icon: string
  title: string
  desc: string
}

const SCENARIOS: Scenario[] = [
  {
    key: 'ai_guide_appeal',
    icon: '🎙️',
    title: 'Cebinde, hiç susmayan bir gezi arkadaşın olsa…',
    desc: "Gittiğin yerde sokağın hikayesini, az bilinen bir detayı ya da \"5 dakika ileride enfes bir simitçi var\" diye sesli anlatan bir AI rehber olsa, bu sence nasıl olurdu?",
  },
  {
    key: 'personalization_appeal',
    icon: '🧬',
    title: 'Uygulama seni tanısa, herkese aynı şeyi önermese…',
    desc: 'Zevklerini ve geçmiş gezilerini öğrenip sana özel mekan ve rota önerileri çıkaran bir "Gezi DNA\'n" olsa?',
  },
  {
    key: 'gamification_appeal',
    icon: '🎮',
    title: 'Gezmek bir oyuna dönüşse…',
    desc: 'Gittiğin yerlerde küçük görevler tamamlayıp puan, rozet kazansan ve arkadaşlarınla skorunu karşılaştırsan?',
  },
]

const AVATAR_SCENARIO: Scenario = {
  key: 'avatar_quest_appeal',
  icon: '🕹️',
  title: 'Bu rozetler bir karaktere dönüşse…',
  desc: "Kazandığın puan ve rozetlerle kendi 3D avatarını geliştirsen, onu yeni \"quest\"lere yollasan?",
}

const LOCAL_DEALS_SCENARIO: Scenario = {
  key: 'local_deals_appeal',
  icon: '🏷️',
  title: 'Tam o an, tam o yerde bir sürpriz çıksa…',
  desc: 'Bulunduğun bölgedeki kafe, restoran ya da etkinliklerden anlık özel indirim ve fırsatlar görsen?',
}

const APPEAL_OPTIONS: { value: AppealLevel; emoji: string; variant: 'positive' | 'neutral' | 'negative' }[] = [
  { value: 'Kesinlikle isterim', emoji: '🤩', variant: 'positive' },
  { value: 'Olabilir, denerim', emoji: '🤔', variant: 'neutral' },
  { value: 'Gerek yok', emoji: '😐', variant: 'negative' },
]

function ScenarioBlock({
  scenario,
  value,
  onSelect,
}: {
  scenario: Scenario
  value: AppealLevel | null
  onSelect: (v: AppealLevel) => void
}) {
  return (
    <div className="scenario-card">
      <div className="flex items-start gap-3 mb-3.5">
        <div className="scenario-icon">{scenario.icon}</div>
        <div className="pt-0.5">
          <p className="font-semibold text-sm text-slate-800 leading-snug">{scenario.title}</p>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">{scenario.desc}</p>
        </div>
      </div>
      <div className="space-y-2">
        {APPEAL_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            id={`${scenario.key}-${opt.variant}`}
            onClick={() => onSelect(opt.value)}
            className={`chip-appeal${value === opt.value ? ` selected-${opt.variant}` : ''}`}
          >
            <span className="chip-appeal-emoji">{opt.emoji}</span>
            {opt.value}
          </button>
        ))}
      </div>
    </div>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function Step6({ data, onChange }: Step6Props) {
  const showAvatarQuest = data.gamification_appeal !== null && data.gamification_appeal !== 'Gerek yok'

  function select(field: AppealField, value: AppealLevel) {
    const patch: Partial<SurveyData> = { [field]: value }
    if (field === 'gamification_appeal' && value === 'Gerek yok') {
      patch.avatar_quest_appeal = null
    }
    onChange(patch)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {SCENARIOS.map((s) => (
        <motion.div key={s.key} variants={item}>
          <ScenarioBlock scenario={s} value={data[s.key]} onSelect={(v) => select(s.key, v)} />
        </motion.div>
      ))}

      <AnimatePresence initial={false}>
        {showAvatarQuest && (
          <motion.div
            key="avatar-quest"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ScenarioBlock
              scenario={AVATAR_SCENARIO}
              value={data.avatar_quest_appeal}
              onSelect={(v) => select('avatar_quest_appeal', v)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item}>
        <ScenarioBlock
          scenario={LOCAL_DEALS_SCENARIO}
          value={data.local_deals_appeal}
          onSelect={(v) => select('local_deals_appeal', v)}
        />
      </motion.div>
    </motion.div>
  )
}

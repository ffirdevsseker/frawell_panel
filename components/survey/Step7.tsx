'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { SurveyData } from '@/types/survey'

interface Step7Props {
  data: SurveyData
  onChange: (patch: Partial<SurveyData>) => void
}

const RANK_COLORS = [
  'from-amber-400 to-yellow-500',
  'from-slate-400 to-slate-500',
  'from-orange-400 to-amber-500',
  'from-indigo-400 to-violet-500',
  'from-violet-400 to-purple-500',
  'from-slate-300 to-slate-400',
  'from-teal-400 to-cyan-500',
]

const RANK_BG = [
  'bg-amber-50 border-amber-200',
  'bg-slate-50 border-slate-200',
  'bg-orange-50 border-orange-200',
  'bg-indigo-50 border-indigo-200',
  'bg-violet-50 border-violet-200',
  'bg-slate-50 border-slate-200',
  'bg-teal-50 border-teal-200',
]

function SortableItem({
  id,
  rank,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  id: string
  rank: number
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        drag-item flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 select-none touch-none
        ${isDragging
          ? 'border-indigo-400 bg-white shadow-2xl shadow-indigo-200/60 dragging'
          : `${RANK_BG[Math.min(rank - 1, RANK_BG.length - 1)]} hover:shadow-lg`}
      `}
    >
      {/* Sürükleme tutamacı */}
      <div
        {...attributes}
        {...listeners}
        id={`drag-handle-${rank}`}
        className="flex-1 flex items-center gap-3 cursor-grab active:cursor-grabbing pb-1 pt-1"
        aria-label="Sürükle"
      >
        <button
          className="text-slate-400 hover:text-slate-600 p-1 -ml-2 shrink-0 pointer-events-none"
        >
          <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor">
            <circle cx="4" cy="3" r="1.5" />
            <circle cx="10" cy="3" r="1.5" />
            <circle cx="4" cy="9" r="1.5" />
            <circle cx="10" cy="9" r="1.5" />
            <circle cx="4" cy="15" r="1.5" />
            <circle cx="10" cy="15" r="1.5" />
          </svg>
        </button>

        {/* Rank badge */}
        <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${RANK_COLORS[Math.min(rank - 1, RANK_COLORS.length - 1)]} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
          {rank}
        </div>

        {/* Label */}
        <span className="flex-1 text-sm text-slate-700 font-medium leading-snug">{id}</span>
      </div>

      {/* Oklar */}
      <div className="flex items-center gap-1 shrink-0 ml-1">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMoveUp(); }}
          disabled={isFirst}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
          title="Yukarı taşı"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMoveDown(); }}
          disabled={isLast}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
          title="Aşağı taşı"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function Step7({ data, onChange }: Step7Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = data.feature_ranking.indexOf(active.id as string)
      const newIndex = data.feature_ranking.indexOf(over.id as string)
      onChange({ feature_ranking: arrayMove(data.feature_ranking, oldIndex, newIndex) })
    }
  }

  function moveItem(index: number, direction: 'up' | 'down') {
    const newQueue = [...data.feature_ranking]
    if (direction === 'up' && index > 0) {
      ;[newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]]
    } else if (direction === 'down' && index < newQueue.length - 1) {
      ;[newQueue[index + 1], newQueue[index]] = [newQueue[index], newQueue[index + 1]]
    } else {
      return
    }
    onChange({ feature_ranking: newQueue })
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
        <span className="text-lg">👆</span>
        <p className="text-xs text-indigo-700 font-medium">
          Dilediğin gibi sürükle veya <span className="font-bold">sağdaki okları kullanarak</span> yerini değiştir.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={data.feature_ranking} strategy={verticalListSortingStrategy}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="space-y-2"
          >
            {data.feature_ranking.map((feature, i) => (
              <motion.div
                key={feature}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                }}
              >
                <SortableItem
                  id={feature}
                  rank={i + 1}
                  isFirst={i === 0}
                  isLast={i === data.feature_ranking.length - 1}
                  onMoveUp={() => moveItem(i, 'up')}
                  onMoveDown={() => moveItem(i, 'down')}
                />
              </motion.div>
            ))}
          </motion.div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

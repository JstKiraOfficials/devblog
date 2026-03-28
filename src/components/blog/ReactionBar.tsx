import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useReactions } from '@/hooks/useReactions'
import type { ReactionType } from '@/types'

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'like',  emoji: '👍', label: 'Like' },
  { type: 'love',  emoji: '❤️', label: 'Love' },
  { type: 'fire',  emoji: '🔥', label: 'Fire' },
  { type: 'wow',   emoji: '😮', label: 'Wow' },
]

interface ReactionBarProps {
  postId: string
  orientation?: 'vertical' | 'horizontal'
}

export const ReactionBar = ({ postId, orientation = 'vertical' }: ReactionBarProps) => {
  const { counts, userReactions, react } = useReactions(postId)

  const handleReact = (type: ReactionType) => {
    if (userReactions.has(type)) return
    react(type)
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF6B00', '#FF8C38', '#FF9F45'],
    })
  }

  return (
    <div
      className={[
        'flex gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
      ].join(' ')}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
        Reactions
      </p>
      {REACTIONS.map(({ type, emoji, label }) => {
        const reacted = userReactions.has(type)
        return (
          <motion.button
            key={type}
            whileTap={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3, type: 'spring' }}
            onClick={() => handleReact(type)}
            disabled={reacted}
            aria-label={`${label} reaction — ${counts[type]} reactions`}
            aria-pressed={reacted}
            className={[
              'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm',
              'border transition-all duration-200',
              reacted
                ? 'bg-primary-muted border-primary text-primary'
                : 'bg-bg-surface border-border text-text-secondary hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            <span role="img" aria-hidden="true">{emoji}</span>
            <span className="font-medium">{label}</span>
            <span className="text-xs text-text-muted ml-auto">{counts[type]}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

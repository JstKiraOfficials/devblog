import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface TagBadgeProps {
  tag: string
  color?: string
  count?: number
  active?: boolean
  onClick?: () => void
  asLink?: boolean
}

export const TagBadge = ({ tag, color, count, active, onClick, asLink = true }: TagBadgeProps) => {
  const style = color
    ? { backgroundColor: `${color}20`, borderColor: `${color}40`, color }
    : undefined

  const classes = [
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] text-xs font-medium',
    'border transition-all duration-200 cursor-pointer',
    active
      ? 'bg-primary text-text-inverse border-primary'
      : 'bg-primary-muted text-primary border-primary/20 hover:bg-primary hover:text-text-inverse hover:border-primary',
  ].join(' ')

  const content = (
    <>
      {tag}
      {count !== undefined && (
        <span className="opacity-70">{count}</span>
      )}
    </>
  )

  if (asLink && !onClick) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
        <Link to={`/tag/${tag}`} className={classes} style={style}>
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={classes}
      style={style}
    >
      {content}
    </motion.button>
  )
}

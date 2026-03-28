import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom'
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={[
              'absolute z-50 px-2.5 py-1 text-xs font-medium text-text-inverse bg-text-primary',
              'rounded-[var(--radius-sm)] whitespace-nowrap pointer-events-none',
              position === 'top'
                ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
                : 'top-full left-1/2 -translate-x-1/2 mt-2',
            ].join(' ')}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

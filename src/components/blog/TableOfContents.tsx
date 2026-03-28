import { motion } from 'framer-motion'
import type { TableOfContentsItem } from '@/types'

interface TableOfContentsProps {
  items: TableOfContentsItem[]
  activeId: string
}

const indentMap: Record<2 | 3 | 4, string> = { 2: 'pl-0', 3: 'pl-3', 4: 'pl-6' }

const TOCItem = ({
  item,
  activeId,
}: {
  item: TableOfContentsItem
  activeId: string
}) => {
  const isActive = item.id === activeId

  return (
    <li>
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault()
          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
        }}
        className={[
          'relative flex items-center py-1 text-sm transition-colors duration-200',
          indentMap[item.level],
          isActive ? 'text-primary font-medium' : 'text-text-muted hover:text-text-secondary',
        ].join(' ')}
      >
        {isActive && (
          <motion.span
            layoutId="toc-indicator"
            className="absolute -left-3 w-0.5 h-full bg-primary rounded-full"
          />
        )}
        {item.text}
      </a>
      {item.children.length > 0 && (
        <ul className="space-y-0.5">
          {item.children.map((child) => (
            <TOCItem key={child.id} item={child} activeId={activeId} />
          ))}
        </ul>
      )}
    </li>
  )
}

export const TableOfContents = ({ items, activeId }: TableOfContentsProps) => {
  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
        On this page
      </p>
      <ul className="space-y-0.5 border-l border-border pl-3">
        {items.map((item) => (
          <TOCItem key={item.id} item={item} activeId={activeId} />
        ))}
      </ul>
    </nav>
  )
}

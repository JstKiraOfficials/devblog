import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useCopyCode } from '@/hooks/useCopyCode'

interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
}

/** Extracts plain text from React children recursively */
const extractText = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in (node as object)) {
    return extractText((node as React.ReactElement).props.children)
  }
  return ''
}

export const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const ref = useRef<HTMLPreElement>(null)
  const code = extractText(children)
  const { copied, copy } = useCopyCode(code)

  return (
    <div className="group relative">
      <pre
        ref={ref}
        className={[
          'bg-[var(--color-code-bg)] border border-[var(--color-code-border)]',
          'rounded-[var(--radius-lg)] p-5 overflow-x-auto text-sm',
          className ?? '',
        ].join(' ')}
      >
        {children}
      </pre>

      <motion.button
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity
                   p-1.5 rounded-[var(--radius-sm)] bg-bg-raised border border-border
                   text-text-muted hover:text-text-primary"
        onClick={copy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </motion.button>
    </div>
  )
}

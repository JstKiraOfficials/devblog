import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import { CodeBlock } from './CodeBlock'
import 'highlight.js/styles/github-dark.css'
import '@/styles/highlight.css'
import type { Components } from 'react-markdown'
import { AlertCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react'

/** GitHub-style callout detection */
const calloutMap: Record<string, { icon: React.ReactNode; color: string }> = {
  NOTE:    { icon: <Info size={16} />,          color: 'text-blue-400 border-blue-500/30 bg-blue-500/5' },
  TIP:     { icon: <Lightbulb size={16} />,     color: 'text-green-400 border-green-500/30 bg-green-500/5' },
  WARNING: { icon: <AlertTriangle size={16} />, color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5' },
  CAUTION: { icon: <AlertCircle size={16} />,   color: 'text-red-400 border-red-500/30 bg-red-500/5' },
}

const CustomBlockquote = ({ children }: { children?: React.ReactNode }) => {
  // Detect [!NOTE] / [!WARNING] etc. in first text node
  const text = String(children)
  const match = text.match(/\[!(NOTE|TIP|WARNING|CAUTION)\]/)
  if (match) {
    const type = match[1]
    const callout = calloutMap[type]
    return (
      <div className={`flex gap-3 p-4 rounded-[var(--radius-md)] border my-4 ${callout.color}`}>
        <span className="mt-0.5 flex-shrink-0">{callout.icon}</span>
        <div>{children}</div>
      </div>
    )
  }
  return (
    <blockquote className="border-l-[3px] border-primary bg-primary/5 rounded-r-[var(--radius-md)] px-5 py-4 my-4">
      {children}
    </blockquote>
  )
}

const components: Components = {
  pre: ({ children, ...props }) => (
    <CodeBlock {...props}>{children}</CodeBlock>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <figure>
      <img src={src} alt={alt ?? ''} loading="lazy" className="rounded-[var(--radius-lg)] w-full" />
      {alt && <figcaption className="text-center text-sm text-text-muted mt-2">{alt}</figcaption>}
    </figure>
  ),
  blockquote: ({ children }) => <CustomBlockquote>{children}</CustomBlockquote>,
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border my-4">
      <table className="w-full">{children}</table>
    </div>
  ),
}

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => (
  <ReactMarkdown
    className="prose prose-devblog max-w-none"
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeHighlight,
    ]}
    components={components}
  >
    {content}
  </ReactMarkdown>
)

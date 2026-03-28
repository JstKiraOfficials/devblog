import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { TagBadge } from '@/components/blog'
import type { Post } from '@/types'

interface SearchResultProps {
  post: Post
  query: string
  active: boolean
  onClick: () => void
}

/** Highlight matching query text in a string */
const highlight = (text: string, query: string) => {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/30 text-primary rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export const SearchResult = ({ post, query, active, onClick }: SearchResultProps) => (
  <Link
    to={`/blog/${post.slug}`}
    onClick={onClick}
    className={[
      'flex gap-4 p-4 rounded-[var(--radius-md)] transition-colors duration-150',
      active ? 'bg-primary-muted border border-primary/20' : 'hover:bg-bg-raised',
    ].join(' ')}
  >
    {post.coverImage && (
      <img
        src={post.coverImage}
        alt={post.coverImageAlt || post.title}
        className="w-16 h-12 object-cover rounded-[var(--radius-sm)] flex-shrink-0"
        loading="lazy"
      />
    )}
    <div className="flex-1 min-w-0">
      <p className="font-medium text-text-primary text-sm leading-snug mb-1 line-clamp-1">
        {highlight(post.title, query)}
      </p>
      <p className="text-text-muted text-xs line-clamp-2 mb-2">
        {highlight(post.excerpt, query)}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {post.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} tag={tag} asLink={false} />
        ))}
        <span className="flex items-center gap-1 text-xs text-text-muted ml-auto">
          <Clock size={11} />
          {post.readingTime} min
        </span>
      </div>
    </div>
  </Link>
)

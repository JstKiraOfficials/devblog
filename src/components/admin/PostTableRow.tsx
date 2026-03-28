import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Edit2, Eye } from 'lucide-react'
import { DraftBadge } from './DraftBadge'
import type { Post } from '@/types'

interface PostTableRowProps {
  post: Post
}

export const PostTableRow = ({ post }: PostTableRowProps) => (
  <tr className="border-b border-border hover:bg-bg-raised transition-colors">
    <td className="py-3 px-4">
      <p className="text-sm font-medium text-text-primary line-clamp-1">{post.title}</p>
      <p className="text-xs text-text-muted mt-0.5">/blog/{post.slug}</p>
    </td>
    <td className="py-3 px-4">
      <DraftBadge status={post.status} />
    </td>
    <td className="py-3 px-4 text-sm text-text-muted">
      <span className="flex items-center gap-1.5">
        <Eye size={13} />
        {post.viewCount.toLocaleString()}
      </span>
    </td>
    <td className="py-3 px-4 text-sm text-text-muted">
      {post.publishedAt ? format(post.publishedAt, 'MMM d, yyyy') : '—'}
    </td>
    <td className="py-3 px-4">
      <Link
        to={`/admin/posts/${post.id}/edit`}
        aria-label={`Edit ${post.title}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] bg-bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors"
      >
        <Edit2 size={12} />
        Edit
      </Link>
    </td>
  </tr>
)

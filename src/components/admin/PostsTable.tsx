import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Edit2, Eye } from 'lucide-react'
import { DraftBadge } from './DraftBadge'
import { Skeleton } from '@/components/ui'
import type { Post } from '@/types'

interface PostsTableProps {
  posts: Post[]
  loading?: boolean
}

/** Card layout for mobile */
const PostCard = ({ post }: { post: Post }) => (
  <div className="bg-bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary line-clamp-2">{post.title}</p>
        <p className="text-xs text-text-muted mt-0.5 truncate">/blog/{post.slug}</p>
      </div>
      <DraftBadge status={post.status} />
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <Eye size={12} />
          {post.viewCount.toLocaleString()}
        </span>
        <span>{post.publishedAt ? format(post.publishedAt, 'MMM d, yyyy') : '—'}</span>
      </div>
      <Link
        to={`/admin/posts/${post.id}/edit`}
        aria-label={`Edit ${post.title}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] bg-bg-raised border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors"
      >
        <Edit2 size={12} />
        Edit
      </Link>
    </div>
  </div>
)

export const PostsTable = ({ posts, loading }: PostsTableProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-text-muted text-sm border border-border rounded-[var(--radius-lg)]">
        No posts yet.
      </div>
    )
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-raised">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Title</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Views</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Published</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border hover:bg-bg-raised transition-colors">
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-text-primary line-clamp-1">{post.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">/blog/{post.slug}</p>
                </td>
                <td className="py-3 px-4"><DraftBadge status={post.status} /></td>
                <td className="py-3 px-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5"><Eye size={13} />{post.viewCount.toLocaleString()}</span>
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Clock, Eye } from 'lucide-react'
import { TagBadge } from './TagBadge'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  variant?: 'default' | 'compact'
}

export const PostCard = ({ post, variant = 'default' }: PostCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover="hover"
    className="group bg-bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden
               transition-colors duration-200 hover:border-primary"
    style={{ background: 'var(--color-surface)' }}
  >
    <Link to={`/blog/${post.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      {/* Cover image */}
      {post.coverImage && variant === 'default' && (
        <div className="overflow-hidden aspect-video">
          <motion.img
            variants={{ hover: { scale: 1.03 } }}
            transition={{ duration: 0.3 }}
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} asLink={false} />
          ))}
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-text-primary text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {variant === 'default' && (
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-text-muted">
          {post.publishedAt && (
            <time dateTime={post.publishedAt.toISOString()}>
              {format(post.publishedAt, 'MMM d, yyyy')}
            </time>
          )}
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readingTime} min
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {post.viewCount.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
)

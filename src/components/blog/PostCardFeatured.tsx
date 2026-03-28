import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Eye, Heart } from 'lucide-react'
import { format } from 'date-fns'
import { TagBadge } from './TagBadge'
import { Badge } from '@/components/ui'
import type { Post } from '@/types'

interface PostCardFeaturedProps {
  post: Post
}

export const PostCardFeatured = ({ post }: PostCardFeaturedProps) => {
  const totalReactions = Object.values(post.reactionCounts).reduce((a, b) => a + b, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
      className="group bg-bg-surface border border-border rounded-[var(--radius-xl)] overflow-hidden
                 transition-colors duration-200 hover:border-primary"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="grid md:grid-cols-2 gap-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-video md:aspect-auto">
          <motion.img
            variants={{ hover: { scale: 1.03 } }}
            transition={{ duration: 0.4 }}
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="primary">Featured</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 4).map((tag) => (
              <TagBadge key={tag} tag={tag} asLink={false} />
            ))}
          </div>

          <h2 className="font-heading font-bold text-text-primary text-2xl md:text-3xl leading-tight mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          <p className="text-text-secondary leading-relaxed mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {format(post.publishedAt, 'MMM d, yyyy')}
              </time>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={13} />
              {post.viewCount.toLocaleString()}
            </span>
            {totalReactions > 0 && (
              <span className="flex items-center gap-1.5">
                <Heart size={13} />
                {totalReactions}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

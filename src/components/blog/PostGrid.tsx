import { motion } from 'framer-motion'
import { PostCard } from './PostCard'
import { PostCardSkeleton } from '@/components/ui'
import type { Post } from '@/types'

interface PostGridProps {
  posts: Post[]
  loading?: boolean
  skeletonCount?: number
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

export const PostGrid = ({ posts, loading, skeletonCount = 6 }: PostGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </motion.div>
  )
}

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { usePublishedPosts } from '@/hooks/usePosts'
import { useTags } from '@/hooks/useTags'
import { PostGrid } from '@/components/blog'
import { Button, Badge } from '@/components/ui'
import { SITE_CONFIG } from '@/constants/site'
import type { Post } from '@/types'

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

type SortOption = 'latest' | 'oldest' | 'views' | 'reactions'

const sortPosts = (posts: Post[], sort: SortOption): Post[] => {
  const copy = [...posts]
  switch (sort) {
    case 'oldest':    return copy.sort((a, b) => (a.publishedAt?.getTime() ?? 0) - (b.publishedAt?.getTime() ?? 0))
    case 'views':     return copy.sort((a, b) => b.viewCount - a.viewCount)
    case 'reactions': return copy.sort((a, b) => {
      const ra = Object.values(a.reactionCounts).reduce((s, v) => s + v, 0)
      const rb = Object.values(b.reactionCounts).reduce((s, v) => s + v, 0)
      return rb - ra
    })
    default:          return copy.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
  }
}

const BlogPage = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('latest')

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = usePublishedPosts()
  const { data: tags = [] } = useTags()

  const allPosts = data?.pages.flatMap((p) => p.posts) ?? []
  const filtered = activeTag ? allPosts.filter((p) => p.tags.includes(activeTag)) : allPosts
  const sorted = sortPosts(filtered, sort)
  const totalShowing = sorted.length

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Helmet>
        <title>Blog — {SITE_CONFIG.name}</title>
        <meta name="description" content={`All articles by ${SITE_CONFIG.authorName}`} />
      </Helmet>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-heading font-bold text-3xl text-text-primary">All Articles</h1>
        <Badge variant="primary" className="text-sm px-3 py-1">
          {totalShowing}
        </Badge>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Tag filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-none">
          <button
            onClick={() => setActiveTag(null)}
            className={[
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              !activeTag
                ? 'bg-primary text-text-inverse border-primary'
                : 'border-border text-text-secondary hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => setActiveTag(activeTag === tag.name ? null : tag.name)}
              className={[
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                activeTag === tag.name
                  ? 'bg-primary text-text-inverse border-primary'
                  : 'border-border text-text-secondary hover:border-primary hover:text-primary',
              ].join(' ')}
            >
              {tag.label || tag.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort posts"
          className="px-3 py-1.5 rounded-[var(--radius-md)] bg-bg-surface border border-border text-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-shrink-0"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="views">Most Viewed</option>
          <option value="reactions">Most Reactions</option>
        </select>
      </div>

      {/* Grid */}
      <PostGrid posts={sorted} loading={isLoading} />

      {/* Load more */}
      {!isLoading && sorted.length > 0 && (
        <div className="mt-10 text-center space-y-3">
          <p className="text-sm text-text-muted">
            Showing {totalShowing} article{totalShowing !== 1 ? 's' : ''}
          </p>
          {hasNextPage && (
            <Button
              variant="secondary"
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
            >
              Load More
            </Button>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && sorted.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <p className="text-lg mb-2">No articles found</p>
          {activeTag && (
            <button onClick={() => setActiveTag(null)} className="text-primary hover:underline text-sm">
              Clear filter
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default BlogPage

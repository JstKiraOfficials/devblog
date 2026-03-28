import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PostGrid } from '@/components/blog'
import { Button } from '@/components/ui'
import { fetchPostsByTag } from '@/api/posts'
import { SITE_CONFIG } from '@/constants/site'
import { ROUTES } from '@/constants/routes'

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const TagPage = () => {
  const { tag } = useParams<{ tag: string }>()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts', 'tag', tag],
    queryFn: ({ pageParam }) =>
      fetchPostsByTag(tag ?? '', SITE_CONFIG.postsPerPage, pageParam as Parameters<typeof fetchPostsByTag>[2]),
    initialPageParam: undefined,
    getNextPageParam: (last) => last.lastDoc ?? undefined,
    enabled: !!tag,
  })

  const posts = data?.pages.flatMap((p) => p.posts) ?? []

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Helmet>
        <title>#{tag} — {SITE_CONFIG.name}</title>
        <meta name="description" content={`Articles tagged with ${tag}`} />
      </Helmet>

      <Link
        to={ROUTES.BLOG}
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={14} /> All Articles
      </Link>

      <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">
        #{tag}
      </h1>
      <p className="text-text-muted text-sm mb-10">
        {posts.length} article{posts.length !== 1 ? 's' : ''}
      </p>

      <PostGrid posts={posts} loading={isLoading} />

      {hasNextPage && (
        <div className="mt-10 text-center">
          <Button variant="secondary" onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
            Load More
          </Button>
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          No articles found for <span className="text-primary">#{tag}</span>
        </div>
      )}
    </motion.div>
  )
}

export default TagPage

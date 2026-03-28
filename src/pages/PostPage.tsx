import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from 'lucide-react'
import {
  MarkdownRenderer, TagBadge, PostMeta, ReadingProgress,
  ReactionBar, ShareButtons, CommentSection, RelatedPosts, TableOfContents,
} from '@/components/blog'
import { Spinner } from '@/components/ui'
import { usePostBySlug } from '@/hooks/usePost'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { useTableOfContents } from '@/hooks/useTableOfContents'
import { trackView } from '@/api/views'
import { SITE_CONFIG } from '@/constants/site'

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: post, isLoading, isError } = usePostBySlug(slug ?? '')
  const articleRef = useRef<HTMLElement>(null)
  const progress = useReadingProgress(articleRef)
  const { items: tocItems, activeId } = useTableOfContents(post?.content ?? '')
  const [tocOpen, setTocOpen] = useState(false)

  // Track view after 5s
  useEffect(() => {
    if (!post) return
    const cleanup = trackView(post.id, post.slug)
    return cleanup
  }, [post])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-muted text-lg">Post not found.</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline text-sm">
          Go back
        </button>
      </div>
    )
  }

  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://yourdomain.com'
  const postUrl = `${siteUrl}/blog/${post.slug}`

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title} | {SITE_CONFIG.name}</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.ogImage || post.coverImage} />
        <meta property="og:url" content={postUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.ogImage || post.coverImage} />
        <meta property="article:published_time" content={post.publishedAt?.toISOString()} />
        <meta property="article:tag" content={post.tags.join(',')} />
        <link rel="canonical" href={postUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            author: { '@type': 'Person', name: SITE_CONFIG.authorName },
          })}
        </script>
      </Helmet>

      <ReadingProgress progress={progress} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* 3-column layout */}
        <div className="flex gap-10">
          {/* Left: TOC (desktop) */}
          <aside className="hidden xl:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents items={tocItems} activeId={activeId} />
            </div>
          </aside>

          {/* Center: Article */}
          <article ref={articleRef} className="flex-1 min-w-0 max-w-[740px]">
            {/* Article header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
              </div>

              {/* Title */}
              <h1 className="font-heading font-bold text-3xl sm:text-5xl text-text-primary leading-tight mb-4">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-text-secondary text-lg leading-relaxed mb-6">{post.excerpt}</p>

              {/* Meta */}
              <PostMeta
                publishedAt={post.publishedAt}
                readingTime={post.readingTime}
                viewCount={post.viewCount}
              />

              {/* Cover image */}
              {post.coverImage && (
                <div className="mt-8 rounded-[var(--radius-lg)] overflow-hidden aspect-video">
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}
            </motion.header>

            {/* Mobile TOC toggle */}
            {tocItems.length > 0 && (
              <div className="xl:hidden mb-6">
                <button
                  onClick={() => setTocOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors border border-border rounded-[var(--radius-md)] px-4 py-2"
                >
                  {tocOpen ? <X size={15} /> : <List size={15} />}
                  {tocOpen ? 'Hide' : 'Show'} Table of Contents
                </button>
                <AnimatePresence>
                  {tocOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 pl-4 border-l border-border"
                    >
                      <TableOfContents items={tocItems} activeId={activeId} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Body */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <MarkdownRenderer content={post.content} />
            </motion.div>

            {/* Mobile reactions */}
            <div className="xl:hidden mt-10 pt-8 border-t border-border">
              <ReactionBar postId={post.id} orientation="horizontal" />
            </div>

            {/* Share (mobile) */}
            <div className="xl:hidden mt-6">
              <ShareButtons title={post.title} url={postUrl} />
            </div>

            {/* Related posts */}
            <RelatedPosts postId={post.id} tags={post.tags} />

            {/* Comments */}
            <CommentSection postId={post.id} />
          </article>

          {/* Right: Reactions + Share (desktop) */}
          <aside className="hidden xl:flex flex-col gap-8 w-48 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <ReactionBar postId={post.id} orientation="vertical" />
              <ShareButtons title={post.title} url={postUrl} />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export default PostPage

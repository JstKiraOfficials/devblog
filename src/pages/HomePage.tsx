import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { PostCardFeatured, PostGrid, TagCloud, NewsletterSignup } from '@/components/blog'
import { Button, Skeleton } from '@/components/ui'
import { useFeaturedPost, usePublishedPosts } from '@/hooks/usePosts'
import { useTags } from '@/hooks/useTags'
import { SITE_CONFIG } from '@/constants/site'
import { ROUTES } from '@/constants/routes'

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

/** Animated floating code snippet shown in the hero */
const HeroCodeSnippet = () => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-80 bg-bg-surface border border-border rounded-[var(--radius-lg)] p-4 font-mono text-xs shadow-[var(--shadow-raised)]"
    aria-hidden="true"
  >
    <div className="flex gap-1.5 mb-3">
      <span className="w-3 h-3 rounded-full bg-red-500/60" />
      <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
      <span className="w-3 h-3 rounded-full bg-green-500/60" />
    </div>
    <pre className="text-text-secondary leading-relaxed">
      <span className="text-primary">const</span>{' '}
      <span className="text-blue-400">blog</span>{' = {\n'}
      {'  '}
      <span className="text-green-400">author</span>
      {': '}
      <span className="text-yellow-400">"You"</span>
      {',\n  '}
      <span className="text-green-400">topics</span>
      {': [\n    '}
      <span className="text-yellow-400">"React"</span>
      {',\n    '}
      <span className="text-yellow-400">"TypeScript"</span>
      {',\n    '}
      <span className="text-yellow-400">"Web"</span>
      {'\n  ],\n  '}
      <span className="text-green-400">passion</span>
      {': '}
      <span className="text-primary">true</span>
      {'\n}'}
    </pre>
  </motion.div>
)

const HomePage = () => {
  const { data: featuredPost, isLoading: featuredLoading } = useFeaturedPost()
  const { data, isLoading: postsLoading } = usePublishedPosts()
  const { data: tags = [], isLoading: tagsLoading } = useTags()

  const recentPosts = data?.pages[0]?.posts.slice(0, 6) ?? []

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show">
      <Helmet>
        <title>{SITE_CONFIG.name} — {SITE_CONFIG.tagline}</title>
        <meta name="description" content={SITE_CONFIG.authorBio} />
        <meta property="og:title" content={SITE_CONFIG.name} />
        <meta property="og:description" content={SITE_CONFIG.tagline} />
        <meta property="og:image" content="/og-default.png" />
      </Helmet>

      {/* Hero */}
      <section
        className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading font-bold text-5xl sm:text-6xl leading-tight text-text-primary mb-4">
                Writing about code,{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'var(--gradient-primary)' }}
                >
                  craft, and the web.
                </span>
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                {SITE_CONFIG.authorBio}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to={ROUTES.BLOG}
                  size="lg"
                  icon={<BookOpen size={18} />}
                >
                  Read the Blog
                </Button>
                <Button
                  as={Link}
                  to={ROUTES.ABOUT}
                  variant="ghost"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                >
                  About Me
                </Button>
              </div>
            </motion.div>
          </div>
          <HeroCodeSnippet />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20 py-16">
        {/* Featured post */}
        {(featuredLoading || featuredPost) && (
          <section aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="font-heading font-bold text-2xl text-text-primary mb-6">
              Featured
            </h2>
            {featuredLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : featuredPost ? (
              <PostCardFeatured post={featuredPost} />
            ) : null}
          </section>
        )}

        {/* Recent posts */}
        <section aria-labelledby="recent-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="recent-heading" className="font-heading font-bold text-2xl text-text-primary">
              Recent Articles
            </h2>
            <Link
              to={ROUTES.BLOG}
              className="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <PostGrid posts={recentPosts} loading={postsLoading} skeletonCount={6} />
        </section>

        {/* Tag cloud */}
        <section aria-labelledby="topics-heading">
          <h2 id="topics-heading" className="font-heading font-bold text-2xl text-text-primary mb-6">
            Browse by Topic
          </h2>
          <TagCloud tags={tags} loading={tagsLoading} />
        </section>

        {/* Newsletter */}
        <section className="bg-bg-surface border border-border rounded-[var(--radius-xl)] p-8 sm:p-10">
          <div className="max-w-xl">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
              Stay in the loop
            </h2>
            <p className="text-text-secondary mb-6">
              Get notified when new articles drop. No spam, unsubscribe anytime.
            </p>
            <NewsletterSignup />
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export default HomePage

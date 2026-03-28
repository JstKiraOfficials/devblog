import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { Avatar } from '@/components/ui'
import { NewsletterSignup } from '@/components/blog'
import { SITE_CONFIG } from '@/constants/site'

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const AboutPage = () => (
  <motion.div variants={pageVariants} initial="hidden" animate="show" className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <Helmet>
      <title>About — {SITE_CONFIG.name}</title>
      <meta name="description" content={SITE_CONFIG.authorBio} />
    </Helmet>

    {/* Author card */}
    <div className="flex flex-col sm:flex-row items-start gap-8 mb-12">
      <Avatar src={SITE_CONFIG.authorAvatar} alt={SITE_CONFIG.authorName} size="lg" className="w-24 h-24" />
      <div>
        <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">{SITE_CONFIG.authorName}</h1>
        <p className="text-text-secondary leading-relaxed mb-4">{SITE_CONFIG.authorBio}</p>
        <div className="flex gap-3">
          {[
            { href: SITE_CONFIG.github,   icon: <GithubIcon size={18} />,   label: 'GitHub' },
            { href: SITE_CONFIG.twitter,  icon: <TwitterIcon size={18} />,  label: 'Twitter' },
            { href: SITE_CONFIG.linkedin, icon: <LinkedinIcon size={18} />, label: 'LinkedIn' },
            { href: `mailto:${SITE_CONFIG.email}`, icon: <Mail size={18} />, label: 'Email' },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="p-2 rounded-[var(--radius-md)] text-text-muted hover:text-primary hover:bg-bg-raised border border-border transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* About content */}
    <div className="prose prose-devblog max-w-none mb-16">
      <h2>About this blog</h2>
      <p>
        This is a space where I write about building things for the web — React, TypeScript, Firebase,
        performance, developer experience, and everything in between.
      </p>
      <p>
        I believe in writing code that's readable, maintainable, and a little bit fun. If you find
        something useful here, that makes my day.
      </p>
      <h2>Get in touch</h2>
      <p>
        Have a question, a topic suggestion, or just want to say hi? Reach me at{' '}
        <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> or on{' '}
        <a href={SITE_CONFIG.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>.
      </p>
    </div>

    {/* Newsletter */}
    <div className="bg-bg-surface border border-border rounded-[var(--radius-xl)] p-8">
      <h2 className="font-heading font-bold text-xl text-text-primary mb-2">Stay updated</h2>
      <p className="text-text-secondary text-sm mb-5">New articles straight to your inbox.</p>
      <NewsletterSignup />
    </div>
  </motion.div>
)

export default AboutPage

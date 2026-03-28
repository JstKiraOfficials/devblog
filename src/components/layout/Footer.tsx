import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { SITE_CONFIG } from '@/constants/site'
import { ROUTES } from '@/constants/routes'

export const Footer = () => (
  <footer className="border-t border-border mt-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Brand */}
        <div>
          <Link to={ROUTES.HOME} className="font-heading font-bold text-xl text-text-primary mb-3 block">
            <span className="text-primary">Dev</span>Blog
          </Link>
          <p className="text-text-muted text-sm leading-relaxed">{SITE_CONFIG.tagline}</p>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Navigation</p>
          <ul className="space-y-2">
            {[
              { to: ROUTES.HOME,  label: 'Home' },
              { to: ROUTES.BLOG,  label: 'Blog' },
              { to: ROUTES.ABOUT, label: 'About' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-text-secondary hover:text-primary transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Connect</p>
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
                className="p-2 rounded-[var(--radius-md)] text-text-muted hover:text-primary hover:bg-bg-raised transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
        <p>© {new Date().getFullYear()} {SITE_CONFIG.authorName}. All rights reserved.</p>
        <p>Built with React, TypeScript & Firebase</p>
      </div>
    </div>
  </footer>
)

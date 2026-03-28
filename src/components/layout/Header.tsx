import { Link, NavLink } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { GithubIcon, TwitterIcon } from '@/components/ui/SocialIcons'
import { MobileMenu } from './MobileMenu'
import { useUIStore } from '@/store/uiStore'
import { SITE_CONFIG } from '@/constants/site'
import { ROUTES } from '@/constants/routes'

const navLinks = [
  { to: ROUTES.BLOG,  label: 'Blog' },
  { to: ROUTES.ABOUT, label: 'About' },
]

export const Header = () => {
  const { searchOpen, toggleSearch, mobileMenuOpen, setMobileMenuOpen } = useUIStore()

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="font-heading font-bold text-xl text-text-primary hover:text-primary transition-colors flex-shrink-0"
          aria-label={`${SITE_CONFIG.name} — home`}
        >
          <span className="text-primary">Dev</span>Blog
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'text-primary bg-primary-muted'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSearch}
            aria-label="Open search (Ctrl+K)"
            aria-expanded={searchOpen}
            className="p-2 rounded-[var(--radius-md)] text-text-muted hover:text-text-primary hover:bg-bg-raised transition-colors"
          >
            <Search size={18} />
          </button>

          <a
            href={SITE_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="hidden sm:flex p-2 rounded-[var(--radius-md)] text-text-muted hover:text-text-primary hover:bg-bg-raised transition-colors"
          >
            <GithubIcon size={18} />
          </a>

          <a
            href={SITE_CONFIG.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter profile"
            className="hidden sm:flex p-2 rounded-[var(--radius-md)] text-text-muted hover:text-text-primary hover:bg-bg-raised transition-colors"
          >
            <TwitterIcon size={18} />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-[var(--radius-md)] text-text-muted hover:text-text-primary hover:bg-bg-raised transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}

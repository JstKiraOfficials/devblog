import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GithubIcon, TwitterIcon } from '@/components/ui/SocialIcons'
import { SITE_CONFIG } from '@/constants/site'
import { ROUTES } from '@/constants/routes'

const navLinks = [
  { to: ROUTES.BLOG,  label: 'Blog' },
  { to: ROUTES.ABOUT, label: 'About' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export const MobileMenu = ({ open, onClose }: MobileMenuProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="md:hidden border-t border-border bg-bg-raised"
      >
        <nav aria-label="Mobile navigation" className="flex flex-col p-4 gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                  isActive ? 'text-primary bg-primary-muted' : 'text-text-secondary hover:text-text-primary',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="flex gap-3 px-4 pt-3 border-t border-border mt-2">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={SITE_CONFIG.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <TwitterIcon size={18} />
            </a>
          </div>
        </nav>
      </motion.div>
    )}
  </AnimatePresence>
)

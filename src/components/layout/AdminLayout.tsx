import { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, PlusCircle, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { ToastContainer } from '@/components/ui'

const adminNav = [
  { to: ROUTES.ADMIN,       icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { to: ROUTES.ADMIN_POSTS, icon: <FileText size={16} />,        label: 'Posts' },
  { to: ROUTES.ADMIN_NEW,   icon: <PlusCircle size={16} />,      label: 'New Post' },
]

export const AdminLayout = () => {
  const { logOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logOut()
    navigate(ROUTES.ADMIN_LOGIN)
  }

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {adminNav.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === ROUTES.ADMIN}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-muted text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised',
            ].join(' ')
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-bg-surface flex-shrink-0">
        <Link to={ROUTES.HOME} className="font-heading font-bold text-lg text-text-primary">
          <span className="text-primary">Dev</span>Blog
        </Link>
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          className="p-2 rounded-[var(--radius-md)] text-text-muted hover:text-text-primary hover:bg-bg-raised transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-30 bg-black/60"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="md:hidden fixed top-0 left-0 bottom-0 z-40 w-64 bg-bg-surface border-r border-border flex flex-col"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <Link to={ROUTES.HOME} className="font-heading font-bold text-lg text-text-primary">
                    <span className="text-primary">Dev</span>Blog
                  </Link>
                  <p className="text-xs text-text-muted mt-0.5">Admin Panel</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-text-muted hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                <NavLinks onNavigate={() => setSidebarOpen(false)} />
              </nav>
              <div className="p-3 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 border-r border-border bg-bg-surface flex-col">
        <div className="p-5 border-b border-border">
          <Link to={ROUTES.HOME} className="font-heading font-bold text-lg text-text-primary">
            <span className="text-primary">Dev</span>Blog
          </Link>
          <p className="text-xs text-text-muted mt-0.5">Admin Panel</p>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 p-3 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

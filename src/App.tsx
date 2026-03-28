import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { RootLayout } from '@/components/layout/RootLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { queryClient } from '@/lib/queryClient'
import { ROUTES } from '@/constants/routes'

// Lazy-load all pages for code splitting
const HomePage            = lazy(() => import('@/pages/HomePage'))
const BlogPage            = lazy(() => import('@/pages/BlogPage'))
const PostPage            = lazy(() => import('@/pages/PostPage'))
const TagPage             = lazy(() => import('@/pages/TagPage'))
const SearchPage          = lazy(() => import('@/pages/SearchPage'))
const AboutPage           = lazy(() => import('@/pages/AboutPage'))
const NotFoundPage        = lazy(() => import('@/pages/NotFoundPage'))
const AdminLoginPage      = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboardPage  = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminPostsPage      = lazy(() => import('@/pages/admin/AdminPostsPage'))
const AdminNewPostPage    = lazy(() => import('@/pages/admin/AdminNewPostPage'))
const AdminEditPostPage   = lazy(() => import('@/pages/admin/AdminEditPostPage'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
)

/** Protects admin routes — redirects to login if unauthenticated */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`${ROUTES.ADMIN_LOGIN}?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}

/** Initialises Firebase auth listener at app root */
const AuthInitialiser = ({ children }: { children: React.ReactNode }) => {
  useAuth() // subscribes to onAuthStateChanged
  return <>{children}</>
}

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public routes */}
      <Route element={<RootLayout />}>
        <Route path={ROUTES.HOME}   element={<HomePage />} />
        <Route path={ROUTES.BLOG}   element={<BlogPage />} />
        <Route path={ROUTES.POST}   element={<PostPage />} />
        <Route path={ROUTES.TAG}    element={<TagPage />} />
        <Route path={ROUTES.SEARCH} element={<SearchPage />} />
        <Route path={ROUTES.ABOUT}  element={<AboutPage />} />
        <Route path="*"             element={<NotFoundPage />} />
      </Route>

      {/* Admin login (no layout) */}
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

      {/* Protected admin routes */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path={ROUTES.ADMIN}       element={<AdminDashboardPage />} />
        <Route path={ROUTES.ADMIN_POSTS} element={<AdminPostsPage />} />
        <Route path={ROUTES.ADMIN_NEW}   element={<AdminNewPostPage />} />
        <Route path={ROUTES.ADMIN_EDIT}  element={<AdminEditPostPage />} />
      </Route>
    </Routes>
  </Suspense>
)

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthInitialiser>
          <AppRoutes />
        </AuthInitialiser>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
)

export default App

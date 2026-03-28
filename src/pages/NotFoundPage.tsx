import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { SITE_CONFIG } from '@/constants/site'
import { ROUTES } from '@/constants/routes'

const NotFoundPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
  >
    <Helmet>
      <title>404 Not Found — {SITE_CONFIG.name}</title>
    </Helmet>

    <p className="text-8xl font-heading font-bold text-primary mb-4">404</p>
    <h1 className="font-heading font-bold text-2xl text-text-primary mb-3">Page not found</h1>
    <p className="text-text-muted mb-8 max-w-sm">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex gap-3">
      <Button as={Link} to={ROUTES.HOME} icon={<Home size={16} />}>
        Go Home
      </Button>
      <Button variant="ghost" onClick={() => window.history.back()} icon={<ArrowLeft size={16} />}>
        Go Back
      </Button>
    </div>
  </motion.div>
)

export default NotFoundPage

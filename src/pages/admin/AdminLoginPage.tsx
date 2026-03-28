import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { Input, Button } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      const redirect = params.get('redirect') ?? ROUTES.ADMIN
      navigate(redirect, { replace: true })
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <Helmet><title>Admin Login — DevBlog</title></Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-2xl text-text-primary">
            <span className="text-primary">Dev</span>Blog
          </h1>
          <p className="text-text-muted text-sm mt-1">Admin access only</p>
        </div>

        <div className="bg-bg-surface border border-border rounded-[var(--radius-xl)] p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            {error && (
              <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-md)] px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" loading={loading} icon={<LogIn size={16} />}>
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage

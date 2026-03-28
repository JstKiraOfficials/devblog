import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { PostsTable } from '@/components/admin'
import { useAllPostsAdmin } from '@/hooks/usePosts'
import { ROUTES } from '@/constants/routes'

const AdminPostsPage = () => {
  const { data: posts = [], isLoading } = useAllPostsAdmin()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Helmet><title>Posts — DevBlog Admin</title></Helmet>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary">Posts</h1>
          <p className="text-text-muted text-sm mt-1">{posts.length} total</p>
        </div>
        <Button as={Link} to={ROUTES.ADMIN_NEW} icon={<PlusCircle size={16} />}>
          New Post
        </Button>
      </div>

      <PostsTable posts={posts} loading={isLoading} />
    </motion.div>
  )
}

export default AdminPostsPage

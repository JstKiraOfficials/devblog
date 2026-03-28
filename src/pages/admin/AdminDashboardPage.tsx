import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FileText, Eye, PenSquare, CheckCircle, Trash2, PlusCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Spinner } from '@/components/ui'
import { DraftBadge, PostsTable } from '@/components/admin'
import { fetchAllPosts } from '@/api/posts'
import { fetchPendingComments, approveComment, deleteComment } from '@/api/comments'
import { ROUTES } from '@/constants/routes'
import { format } from 'date-fns'
import type { Post } from '@/types'

const StatCard = ({
  label, value, icon, color = 'text-primary',
}: { label: string; value: number | string; icon: React.ReactNode; color?: string }) => (
  <div className="bg-bg-surface border border-border rounded-[var(--radius-lg)] p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[var(--radius-md)] bg-primary-muted flex items-center justify-center text-primary flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className={`font-heading font-bold text-2xl sm:text-3xl ${color}`}>{value}</p>
      <p className="text-text-muted text-xs sm:text-sm">{label}</p>
    </div>
  </div>
)

const AdminDashboardPage = () => {
  const qc = useQueryClient()
  const [commentsOpen, setCommentsOpen] = useState(false)

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts', 'admin', 'all'],
    queryFn: fetchAllPosts,
  })

  // Aggregate stats
  const totalPosts = posts.length
  const published = posts.filter((p: Post) => p.status === 'published').length
  const drafts = posts.filter((p: Post) => p.status === 'draft').length
  const totalViews = posts.reduce((sum: number, p: Post) => sum + p.viewCount, 0)
  const recentPosts = [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)

  // Pending comments — fetch pending comments across all posts
  const { data: pendingComments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', 'pending', 'dashboard'],
    queryFn: async () => {
      const results = await Promise.all(
        posts.slice(0, 10).map(async (p: Post) => {
          const comments = await fetchPendingComments(p.id)
          return comments.map((c) => ({ ...c, postTitle: p.title }))
        })
      )
      return results.flat()
    },
    enabled: posts.length > 0,
  })

  const { mutate: approve } = useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      approveComment(postId, commentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments'] }),
  })

  const { mutate: remove } = useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      deleteComment(postId, commentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments'] }),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Helmet><title>Dashboard — DevBlog Admin</title></Helmet>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-2xl text-text-primary">Dashboard</h1>
        <Button as={Link} to={ROUTES.ADMIN_NEW} icon={<PlusCircle size={16} />}>
          New Post
        </Button>
      </div>

      {/* Stats */}
      {postsLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Posts"  value={totalPosts}  icon={<FileText size={20} />} />
          <StatCard label="Published"    value={published}   icon={<CheckCircle size={20} />} color="text-green-400" />
          <StatCard label="Drafts"       value={drafts}      icon={<PenSquare size={20} />} color="text-yellow-400" />
          <StatCard label="Total Views"  value={totalViews.toLocaleString()} icon={<Eye size={20} />} />
        </div>
      )}

      {/* Recent posts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-text-primary">Recent Posts</h2>
          <Link to={ROUTES.ADMIN_POSTS} className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <PostsTable posts={recentPosts} loading={postsLoading} />
      </section>

      {/* Pending comments */}
      <section>
        <button
          onClick={() => setCommentsOpen((o) => !o)}
          className="flex items-center justify-between w-full mb-4"
        >
          <h2 className="font-heading font-semibold text-lg text-text-primary flex items-center gap-2">
            Comments to Approve
            {pendingComments.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-primary text-text-inverse rounded-full">
                {pendingComments.length}
              </span>
            )}
          </h2>
          <span className="text-sm text-text-muted">{commentsOpen ? 'Hide' : 'Show'}</span>
        </button>

        {commentsOpen && (
          commentsLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : pendingComments.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No pending comments.</p>
          ) : (
            <div className="space-y-3">
              {pendingComments.map((c) => (
                <div key={c.id} className="bg-bg-surface border border-border rounded-[var(--radius-lg)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-text-muted mb-1">
                        On: <span className="text-text-secondary">{(c as { postTitle?: string }).postTitle}</span>
                        {' · '}{format(c.createdAt, 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm font-medium text-text-primary">{c.authorName}</p>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">{c.content}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => approve({ postId: c.postId, commentId: c.id })}
                        aria-label="Approve comment"
                        className="p-1.5 rounded-[var(--radius-sm)] text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => remove({ postId: c.postId, commentId: c.id })}
                        aria-label="Delete comment"
                        className="p-1.5 rounded-[var(--radius-sm)] text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </section>
    </motion.div>
  )
}

export default AdminDashboardPage

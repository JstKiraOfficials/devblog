import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Spinner } from '@/components/ui'
import { PostEditor } from '@/components/admin'
import { usePostById } from '@/hooks/usePost'

const AdminEditPostPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading } = usePostById(id ?? '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <Helmet><title>{post?.title ?? 'Edit Post'} — DevBlog Admin</title></Helmet>
      <PostEditor post={post ?? undefined} />
    </>
  )
}

export default AdminEditPostPage

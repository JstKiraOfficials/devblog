import { Helmet } from 'react-helmet-async'
import { PostEditor } from '@/components/admin'

const AdminNewPostPage = () => (
  <>
    <Helmet><title>New Post — DevBlog Admin</title></Helmet>
    <PostEditor />
  </>
)

export default AdminNewPostPage

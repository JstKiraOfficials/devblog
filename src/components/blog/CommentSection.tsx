import { useQuery } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'
import { CommentForm } from './CommentForm'
import { CommentThread } from './CommentThread'
import { Divider, Spinner } from '@/components/ui'
import { fetchApprovedComments } from '@/api/comments'

interface CommentSectionProps {
  postId: string
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { data: comments = [], isLoading, refetch } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchApprovedComments(postId),
    enabled: !!postId,
  })

  return (
    <section aria-labelledby="comments-heading" className="mt-16">
      <Divider className="mb-10" />

      <h2 id="comments-heading" className="font-heading font-bold text-2xl text-text-primary mb-8 flex items-center gap-3">
        <MessageSquare size={22} className="text-primary" />
        {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Leave a Comment'}
      </h2>

      <div className="mb-10">
        <CommentForm postId={postId} onSuccess={() => refetch()} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <CommentThread comments={comments} postId={postId} />
      )}
    </section>
  )
}

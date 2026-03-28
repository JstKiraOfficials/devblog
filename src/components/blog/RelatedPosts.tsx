import { useQuery } from '@tanstack/react-query'
import { PostCard } from './PostCard'
import { Skeleton } from '@/components/ui'
import { fetchRelatedPosts } from '@/api/posts'

interface RelatedPostsProps {
  postId: string
  tags: string[]
}

export const RelatedPosts = ({ postId, tags }: RelatedPostsProps) => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['related', postId],
    queryFn: () => fetchRelatedPosts(postId, tags),
    enabled: !!postId && tags.length > 0,
  })

  if (!isLoading && posts.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <h2 id="related-heading" className="font-heading font-bold text-2xl text-text-primary mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)
          : posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </section>
  )
}

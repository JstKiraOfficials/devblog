import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { fetchPublishedPosts, fetchFeaturedPost, fetchAllPosts } from '@/api/posts'
import { SITE_CONFIG } from '@/constants/site'

export const usePublishedPosts = () =>
  useInfiniteQuery({
    queryKey: ['posts', 'published'],
    queryFn: ({ pageParam }) =>
      fetchPublishedPosts(SITE_CONFIG.postsPerPage, pageParam as Parameters<typeof fetchPublishedPosts>[1]),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
  })

export const useFeaturedPost = () =>
  useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: fetchFeaturedPost,
  })

export const useAllPostsAdmin = () =>
  useQuery({
    queryKey: ['posts', 'admin', 'all'],
    queryFn: fetchAllPosts,
  })

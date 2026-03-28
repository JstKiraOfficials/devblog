import { useQuery } from '@tanstack/react-query'
import { fetchPostBySlug, fetchPostById } from '@/api/posts'

export const usePostBySlug = (slug: string) =>
  useQuery({
    queryKey: ['post', 'slug', slug],
    queryFn: () => fetchPostBySlug(slug),
    enabled: !!slug,
  })

export const usePostById = (id: string) =>
  useQuery({
    queryKey: ['post', 'id', id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
  })

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, updatePost, deletePost } from '@/api/posts'
import type { PostDraft, PostStatus } from '@/types'

export const useCreatePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (draft: PostDraft) => createPost(draft),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export const useUpdatePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PostDraft> & { status?: PostStatus } }) =>
      updatePost(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export const useDeletePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchReactions, addReaction } from '@/api/reactions'
import type { ReactionType } from '@/types'
import { useMemo } from 'react'

/** Persistent session ID stored in localStorage */
const getSessionId = (): string => {
  const key = 'devblog_session_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export const useReactions = (postId: string) => {
  const qc = useQueryClient()
  const sessionId = useMemo(() => getSessionId(), [])

  const { data: reactions = [] } = useQuery({
    queryKey: ['reactions', postId],
    queryFn: () => fetchReactions(postId),
    enabled: !!postId,
  })

  const counts = useMemo(() => {
    const c: Record<ReactionType, number> = { like: 0, love: 0, fire: 0, wow: 0 }
    for (const r of reactions) c[r.type]++
    return c
  }, [reactions])

  const userReactions = useMemo(
    () => new Set(reactions.filter((r) => r.sessionId === sessionId).map((r) => r.type)),
    [reactions, sessionId]
  )

  const { mutate: react } = useMutation({
    mutationFn: (type: ReactionType) => addReaction(postId, type, sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reactions', postId] }),
  })

  return { counts, userReactions, react }
}

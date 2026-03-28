import {
  collection, addDoc, getDocs, query, where,
  Timestamp, db, fromFirestore, createAppException,
} from '@/lib/firestore'
import type { Reaction, ReactionType } from '@/types'

const reactionsCol = (postId: string) => collection(db, 'posts', postId, 'reactions')

export const fetchReactions = async (postId: string): Promise<Reaction[]> => {
  try {
    const snap = await getDocs(reactionsCol(postId))
    return snap.docs.map((d) => ({ ...fromFirestore<Omit<Reaction, 'id'>>(d.data()), id: d.id }))
  } catch (err) {
    throw createAppException('reactions/fetch-failed', 'Failed to fetch reactions', err)
  }
}

export const addReaction = async (
  postId: string,
  type: ReactionType,
  sessionId: string
): Promise<void> => {
  try {
    // Check for existing reaction of same type from this session
    const q = query(
      reactionsCol(postId),
      where('type', '==', type),
      where('sessionId', '==', sessionId)
    )
    const existing = await getDocs(q)
    if (!existing.empty) return // already reacted

    await addDoc(reactionsCol(postId), {
      type,
      sessionId,
      postId,
      createdAt: Timestamp.now(),
    })
  } catch (err) {
    throw createAppException('reactions/add-failed', 'Failed to add reaction', err)
  }
}

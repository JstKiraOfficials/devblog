import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc,
  query, where, orderBy, Timestamp, db, fromFirestore, createAppException,
} from '@/lib/firestore'
import type { Comment } from '@/types'

const commentsCol = (postId: string) => collection(db, 'posts', postId, 'comments')

export const fetchApprovedComments = async (postId: string): Promise<Comment[]> => {
  try {
    const q = query(
      commentsCol(postId),
      where('isApproved', '==', true),
      orderBy('createdAt', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...fromFirestore<Omit<Comment, 'id'>>(d.data()), id: d.id }))
  } catch (err) {
    throw createAppException('comments/fetch-failed', 'Failed to fetch comments', err)
  }
}

export const fetchPendingComments = async (postId: string): Promise<Comment[]> => {
  try {
    const q = query(commentsCol(postId), where('isApproved', '==', false), orderBy('createdAt', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...fromFirestore<Omit<Comment, 'id'>>(d.data()), id: d.id }))
  } catch (err) {
    throw createAppException('comments/fetch-pending-failed', 'Failed to fetch pending comments', err)
  }
}

export const addComment = async (
  postId: string,
  data: { authorName: string; authorEmail: string; authorWebsite: string; content: string; parentId: string | null }
): Promise<void> => {
  try {
    await addDoc(commentsCol(postId), {
      ...data,
      postId,
      isApproved: false,
      createdAt: Timestamp.now(),
    })
  } catch (err) {
    throw createAppException('comments/add-failed', 'Failed to add comment', err)
  }
}

export const approveComment = async (postId: string, commentId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'posts', postId, 'comments', commentId), { isApproved: true })
  } catch (err) {
    throw createAppException('comments/approve-failed', 'Failed to approve comment', err)
  }
}

export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'posts', postId, 'comments', commentId))
  } catch (err) {
    throw createAppException('comments/delete-failed', 'Failed to delete comment', err)
  }
}

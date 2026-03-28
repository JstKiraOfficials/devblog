import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter,
  Timestamp, db, fromFirestore, createAppException,
  type QueryDocumentSnapshot, type DocumentData,
} from '@/lib/firestore'
import { increment } from 'firebase/firestore'
import type { Post, PostDraft, PostStatus } from '@/types'

/** ~200 words per minute reading speed estimate */
const calcReadingTime = (content: string): number =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))

const POSTS_COL = 'posts'

const toPost = (snap: QueryDocumentSnapshot<DocumentData>): Post => {
  const data = fromFirestore<Omit<Post, 'id'>>(snap.data())
  return { ...data, id: snap.id }
}

export const fetchPublishedPosts = async (
  pageSize: number,
  cursor?: QueryDocumentSnapshot<DocumentData>
): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    // Simple query — no composite index needed
    const constraints = [
      where('status', '==', 'published'),
      limit(pageSize * 3), // fetch extra to allow client-side sort
    ]
    if (cursor) constraints.push(startAfter(cursor))

    const q = query(collection(db, POSTS_COL), ...constraints)
    const snap = await getDocs(q)
    const posts = snap.docs
      .map(toPost)
      .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
      .slice(0, pageSize)
    const lastDoc = snap.docs[snap.docs.length - 1] ?? null
    return { posts, lastDoc }
  } catch (err) {
    throw createAppException('posts/fetch-failed', 'Failed to fetch posts', err)
  }
}

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const q = query(collection(db, POSTS_COL), where('slug', '==', slug), limit(1))
    const snap = await getDocs(q)
    if (snap.empty) return null
    return toPost(snap.docs[0])
  } catch (err) {
    throw createAppException('posts/fetch-slug-failed', 'Failed to fetch post by slug', err)
  }
}

export const fetchFeaturedPost = async (): Promise<Post | null> => {
  try {
    const q = query(
      collection(db, POSTS_COL),
      where('status', '==', 'published'),
      where('featured', '==', true),
      limit(5)
    )
    const snap = await getDocs(q)
    if (snap.empty) return null
    const posts = snap.docs.map(toPost).sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    return posts[0]
  } catch (err) {
    throw createAppException('posts/fetch-featured-failed', 'Failed to fetch featured post', err)
  }
}

export const fetchPostsByTag = async (
  tag: string,
  pageSize: number,
  cursor?: QueryDocumentSnapshot<DocumentData>
): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    const constraints = [
      where('status', '==', 'published'),
      where('tags', 'array-contains', tag),
      limit(pageSize * 3),
    ]
    if (cursor) constraints.push(startAfter(cursor))

    const q = query(collection(db, POSTS_COL), ...constraints)
    const snap = await getDocs(q)
    const posts = snap.docs
      .map(toPost)
      .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
      .slice(0, pageSize)
    return { posts, lastDoc: snap.docs[snap.docs.length - 1] ?? null }
  } catch (err) {
    throw createAppException('posts/fetch-tag-failed', 'Failed to fetch posts by tag', err)
  }
}

export const fetchRelatedPosts = async (postId: string, tags: string[]): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, POSTS_COL),
      where('status', '==', 'published'),
      where('tags', 'array-contains-any', tags.slice(0, 10)),
      limit(4)
    )
    const snap = await getDocs(q)
    return snap.docs.map(toPost).filter((p) => p.id !== postId).slice(0, 3)
  } catch (err) {
    throw createAppException('posts/fetch-related-failed', 'Failed to fetch related posts', err)
  }
}

// Admin: fetch all posts regardless of status
export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    const q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(toPost)
  } catch (err) {
    throw createAppException('posts/fetch-all-failed', 'Failed to fetch all posts', err)
  }
}

export const fetchPostById = async (id: string): Promise<Post | null> => {
  try {
    const snap = await getDoc(doc(db, POSTS_COL, id))
    if (!snap.exists()) return null
    const data = fromFirestore<Omit<Post, 'id'>>(snap.data())
    return { ...data, id: snap.id }
  } catch (err) {
    throw createAppException('posts/fetch-id-failed', 'Failed to fetch post by id', err)
  }
}

export const createPost = async (draft: PostDraft): Promise<string> => {
  try {
    const now = Timestamp.now()
    const rt = calcReadingTime(draft.content)
    const docRef = await addDoc(collection(db, POSTS_COL), {
      ...draft,
      readingTime: rt,
      viewCount: 0,
      reactionCounts: { like: 0, love: 0, fire: 0, wow: 0 },
      commentCount: 0,
      publishedAt: draft.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    return docRef.id
  } catch (err) {
    throw createAppException('posts/create-failed', 'Failed to create post', err)
  }
}

export const updatePost = async (
  id: string,
  updates: Partial<PostDraft> & { status?: PostStatus }
): Promise<void> => {
  try {
    const now = Timestamp.now()
    const rt = updates.content ? calcReadingTime(updates.content) : null
    const payload: Record<string, unknown> = {
      ...updates,
      updatedAt: now,
    }
    if (rt !== null) payload.readingTime = rt

    // Set publishedAt on first publish
    if (updates.status === 'published') {
      const existing = await fetchPostById(id)
      if (existing && !existing.publishedAt) {
        payload.publishedAt = now
      }
    }

    await updateDoc(doc(db, POSTS_COL, id), payload)
  } catch (err) {
    throw createAppException('posts/update-failed', 'Failed to update post', err)
  }
}

export const deletePost = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, POSTS_COL, id))
  } catch (err) {
    throw createAppException('posts/delete-failed', 'Failed to delete post', err)
  }
}

export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    await updateDoc(doc(db, POSTS_COL, id), { viewCount: increment(1) })
  } catch (err) {
    throw createAppException('posts/view-failed', 'Failed to increment view count', err)
  }
}

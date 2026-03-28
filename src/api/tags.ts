import { collection, getDocs, query, orderBy, db, fromFirestore, createAppException } from '@/lib/firestore'
import type { Tag } from '@/types'

const TAGS_COL = 'tags'

export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const q = query(collection(db, TAGS_COL), orderBy('postCount', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => fromFirestore<Tag>(d.data()))
  } catch (err) {
    throw createAppException('tags/fetch-failed', 'Failed to fetch tags', err)
  }
}

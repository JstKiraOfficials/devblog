import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { AppException } from '@/types'

export { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, Timestamp }
export type { QueryDocumentSnapshot, DocumentData }
export { db }

/** Convert Firestore Timestamps to JS Dates recursively */
export const fromFirestore = <T extends Record<string, unknown>>(data: DocumentData): T => {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(data)) {
    const val = data[key]
    if (val instanceof Timestamp) {
      result[key] = val.toDate()
    } else if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = fromFirestore(val as Record<string, unknown>)
    } else {
      result[key] = val
    }
  }
  return result as T
}

export const createAppException = (code: string, message: string, originalError?: unknown): AppException => ({
  code,
  message,
  originalError,
})

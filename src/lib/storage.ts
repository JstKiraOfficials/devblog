import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'
import { createAppException } from './firestore'

export type StorageFolder = 'covers' | 'og' | 'content'

/** Upload a file to Firebase Storage with progress callback */
export const uploadFile = (
  file: File,
  folder: StorageFolder,
  onProgress?: (pct: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const storageRef = ref(storage, filename)
    const task = uploadBytesResumable(storageRef, file)

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(Math.round(pct))
      },
      (error) => reject(createAppException('storage/upload-failed', error.message, error)),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        } catch (err) {
          reject(createAppException('storage/url-failed', 'Failed to get download URL', err))
        }
      }
    )
  })
}

/** Delete a file from Firebase Storage by its full URL */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch (err) {
    throw createAppException('storage/delete-failed', 'Failed to delete file', err)
  }
}

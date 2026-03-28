import { incrementViewCount } from './posts'

/**
 * Track a post view with a 5-second delay to filter bots/bounces.
 * Uses sessionStorage to prevent duplicate counts per session.
 */
export const trackView = (postId: string, slug: string): (() => void) => {
  const key = `viewed_${slug}`
  if (sessionStorage.getItem(key)) return () => {}

  const timer = setTimeout(async () => {
    try {
      await incrementViewCount(postId)
      sessionStorage.setItem(key, 'true')
    } catch {
      // Best-effort — silently fail
    }
  }, 5000)

  return () => clearTimeout(timer)
}

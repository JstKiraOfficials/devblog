import { useState, useEffect } from 'react'

export const useReadingProgress = (containerRef: React.RefObject<HTMLElement | null>) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrolled = -top
      const total = height - windowHeight
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0
      setProgress(pct)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [containerRef])

  return progress
}

import { useMemo, useState, useEffect } from 'react'
import type { TableOfContentsItem } from '@/types'

/** Parse H2/H3/H4 headings from markdown content using regex */
export const useTableOfContents = (content: string) => {
  const items = useMemo<TableOfContentsItem[]>(() => {
    const headingRegex = /^(#{2,4})\s+(.+)$/gm
    const flat: TableOfContentsItem[] = []
    let match: RegExpExecArray | null

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length as 2 | 3 | 4
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      flat.push({ id, text, level, children: [] })
    }

    // Build nested structure
    const root: TableOfContentsItem[] = []
    const stack: TableOfContentsItem[] = []

    for (const item of flat) {
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop()
      }
      if (stack.length === 0) {
        root.push(item)
      } else {
        stack[stack.length - 1].children.push(item)
      }
      stack.push(item)
    }

    return root
  }, [content])

  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )

    const headings = document.querySelectorAll('h2[id], h3[id], h4[id]')
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [content])

  return { items, activeId }
}

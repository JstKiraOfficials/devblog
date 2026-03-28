import { useMemo, useState } from 'react'
import { createPostSearch } from '@/lib/fuse'
import type { Post, SearchResult } from '@/types'

export const useSearch = (posts: Post[]) => {
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => createPostSearch(posts), [posts])

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).map((r) => ({
      item: r.item,
      score: r.score ?? 1,
      matches: r.matches?.map((m) => ({ key: m.key ?? '', value: String(m.value ?? '') })),
    }))
  }, [fuse, query])

  return { query, setQuery, results }
}

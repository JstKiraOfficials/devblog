import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SearchInput } from './SearchInput'
import { SearchResult } from './SearchResult'
import { useUIStore } from '@/store/uiStore'
import { useSearch } from '@/hooks/useSearch'
import { usePublishedPosts } from '@/hooks/usePosts'
import { Clock } from 'lucide-react'

const RECENT_KEY = 'devblog_recent_searches'
const MAX_RECENT = 5

const getRecentSearches = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

const saveRecentSearch = (q: string) => {
  const recent = getRecentSearches().filter((s) => s !== q)
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...recent].slice(0, MAX_RECENT)))
}

export const SearchModal = () => {
  const { searchOpen, setSearchOpen } = useUIStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const { data } = usePublishedPosts()
  const allPosts = data?.pages.flatMap((p) => p.posts) ?? []
  const { query, setQuery, results } = useSearch(allPosts)

  // Debounce query for search
  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (searchOpen) {
      setRecentSearches(getRecentSearches())
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setActiveIndex(0)
    }
  }, [searchOpen, setQuery])

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useUIStore.getState().toggleSearch()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = useCallback(
    (slug: string) => {
      if (debouncedQuery) saveRecentSearch(debouncedQuery)
      setSearchOpen(false)
      navigate(`/blog/${slug}`)
    },
    [debouncedQuery, navigate, setSearchOpen]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      handleSelect(results[activeIndex].item.slug)
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
    }
  }

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-2xl bg-bg-raised border border-border rounded-[var(--radius-xl)] shadow-[var(--shadow-raised)] overflow-hidden"
          >
            <SearchInput
              ref={inputRef}
              value={query}
              onChange={(v) => { setQuery(v); setActiveIndex(0) }}
              onClear={() => setQuery('')}
            />

            <div className="max-h-[60vh] overflow-y-auto">
              {/* Recent searches when empty */}
              {!query && recentSearches.length > 0 && (
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted px-1 mb-2">
                    Recent Searches
                  </p>
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:text-primary hover:bg-bg-surface rounded-[var(--radius-sm)] transition-colors"
                    >
                      <Clock size={13} className="text-text-muted" />
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Results */}
              {debouncedQuery && results.length > 0 && (
                <div className="p-3 space-y-1">
                  {results.map((r, i) => (
                    <SearchResult
                      key={r.item.id}
                      post={r.item}
                      query={debouncedQuery}
                      active={i === activeIndex}
                      onClick={() => handleSelect(r.item.slug)}
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {debouncedQuery && results.length === 0 && (
                <div className="flex flex-col items-center py-12 text-text-muted">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="mb-4 opacity-30">
                    <circle cx="28" cy="28" r="18" stroke="currentColor" strokeWidth="3" />
                    <line x1="41" y1="41" x2="56" y2="56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <line x1="22" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="22" x2="28" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm">No results for <span className="text-text-primary font-medium">"{debouncedQuery}"</span></p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-xs text-text-muted">
              <span><kbd className="px-1.5 py-0.5 bg-bg-surface border border-border rounded text-xs">↑↓</kbd> navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-bg-surface border border-border rounded text-xs">↵</kbd> open</span>
              <span><kbd className="px-1.5 py-0.5 bg-bg-surface border border-border rounded text-xs">Esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

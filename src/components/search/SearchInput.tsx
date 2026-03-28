import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (val: string) => void
  onClear: () => void
  placeholder?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, placeholder = 'Search articles...' }, ref) => (
    <div className="relative flex items-center">
      <Search size={18} className="absolute left-4 text-text-muted pointer-events-none" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="w-full pl-11 pr-10 py-3.5 bg-bg-surface border border-border rounded-[var(--radius-lg)]
                   text-text-primary placeholder:text-text-muted text-base
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-4 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
)
SearchInput.displayName = 'SearchInput'

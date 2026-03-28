import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { Input, Textarea, Button } from '@/components/ui'
import { ImageUploader } from './ImageUploader'
import { useTags } from '@/hooks/useTags'
import type { PostDraft, PostStatus } from '@/types'

interface FrontmatterFormProps {
  value: Partial<PostDraft>
  onChange: (updates: Partial<PostDraft>) => void
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const FrontmatterForm = ({ value, onChange }: FrontmatterFormProps) => {
  const [tagInput, setTagInput] = useState('')
  const [seoOpen, setSeoOpen] = useState(false)
  const { data: existingTags = [] } = useTags()

  // Auto-generate slug from title (only if slug hasn't been manually edited)
  const [slugManual, setSlugManual] = useState(false)
  useEffect(() => {
    if (!slugManual && value.title) {
      onChange({ slug: slugify(value.title) })
    }
  }, [value.title, slugManual]) // eslint-disable-line react-hooks/exhaustive-deps

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase()
    if (!t || value.tags?.includes(t)) return
    onChange({ tags: [...(value.tags ?? []), t] })
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    onChange({ tags: value.tags?.filter((t) => t !== tag) ?? [] })
  }

  const suggestions = existingTags
    .map((t) => t.name)
    .filter((n) => n.includes(tagInput.toLowerCase()) && !value.tags?.includes(n))
    .slice(0, 5)

  return (
    <div className="space-y-5">
      {/* Title */}
      <Input
        id="post-title"
        label="Title *"
        value={value.title ?? ''}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Post title"
        className="text-lg font-heading"
        required
      />

      {/* Slug */}
      <Input
        id="post-slug"
        label="Slug *"
        value={value.slug ?? ''}
        onChange={(e) => { setSlugManual(true); onChange({ slug: slugify(e.target.value) }) }}
        placeholder="post-url-slug"
        required
      />

      {/* Excerpt */}
      <Textarea
        id="post-excerpt"
        label="Excerpt"
        value={value.excerpt ?? ''}
        onChange={(e) => onChange({ excerpt: e.target.value })}
        placeholder="Brief summary (150–200 chars)"
        charCount={value.excerpt?.length ?? 0}
        maxChars={200}
        className="min-h-[80px]"
      />

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-secondary">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {value.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-muted text-primary border border-primary/20 rounded-full text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="hover:text-red-400 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <Input
            id="tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) }
            }}
            placeholder="Type tag and press Enter"
          />
          {tagInput && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-bg-raised border border-border rounded-[var(--radius-md)] z-10 overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag(s)}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-surface hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cover image */}
      <ImageUploader
        onUploadComplete={(url) => onChange({ coverImage: url })}
        currentUrl={value.coverImage}
      />

      {/* Cover image alt */}
      <Input
        id="cover-alt"
        label="Cover Image Alt Text"
        value={value.coverImageAlt ?? ''}
        onChange={(e) => onChange({ coverImageAlt: e.target.value })}
        placeholder="Describe the cover image"
      />

      {/* Status + Featured */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="post-status" className="text-sm font-medium text-text-secondary">Status</label>
          <select
            id="post-status"
            value={value.status ?? 'draft'}
            onChange={(e) => onChange({ status: e.target.value as PostStatus })}
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.featured ?? false}
              onChange={(e) => onChange({ featured: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-text-secondary">Featured post</span>
          </label>
        </div>
      </div>

      {/* SEO section (collapsible) */}
      <div className="border border-border rounded-[var(--radius-md)] overflow-hidden">
        <button
          type="button"
          onClick={() => setSeoOpen((o) => !o)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors"
        >
          SEO Settings
          {seoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {seoOpen && (
          <div className="px-4 pb-4 space-y-4 border-t border-border">
            <Input
              id="seo-title"
              label="SEO Title"
              value={value.seoTitle ?? ''}
              onChange={(e) => onChange({ seoTitle: e.target.value })}
              placeholder="Overrides title in browser tab"
            />
            <Textarea
              id="seo-description"
              label="SEO Description"
              value={value.seoDescription ?? ''}
              onChange={(e) => onChange({ seoDescription: e.target.value })}
              placeholder="Meta description (150–160 chars)"
              className="min-h-[80px]"
            />
            <Input
              id="og-image"
              label="OG Image URL"
              value={value.ogImage ?? ''}
              onChange={(e) => onChange({ ogImage: e.target.value })}
              placeholder="Overrides cover in social shares"
            />
          </div>
        )}
      </div>
    </div>
  )
}

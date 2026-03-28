import { useState } from 'react'
import { Image, X, Link } from 'lucide-react'
import { Input } from '@/components/ui'

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void
  currentUrl?: string
  label?: string
}

export const ImageUploader = ({
  onUploadComplete,
  currentUrl,
  label = 'Cover Image',
}: ImageUploaderProps) => {
  const [url, setUrl] = useState(currentUrl ?? '')
  const [preview, setPreview] = useState(currentUrl ?? '')
  const [error, setError] = useState('')

  const handleApply = () => {
    const trimmed = url.trim()
    if (!trimmed) {
      setPreview('')
      onUploadComplete('')
      return
    }
    try {
      new URL(trimmed)
    } catch {
      setError('Please enter a valid URL')
      return
    }
    setError('')
    setPreview(trimmed)
    onUploadComplete(trimmed)
  }

  const handleClear = () => {
    setUrl('')
    setPreview('')
    setError('')
    onUploadComplete('')
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">{label}</label>

      {/* Preview */}
      {preview && (
        <div className="relative rounded-[var(--radius-lg)] overflow-hidden border border-border">
          <img
            src={preview}
            alt="Cover preview"
            className="w-full aspect-video object-cover"
            onError={(e) => {
              // Don't clear — some hosts block hotlinking but the URL is still valid
              // Just show a broken image placeholder
              (e.target as HTMLImageElement).style.opacity = '0.3'
              setError('Image may not display due to hotlink restrictions, but the URL is saved.')
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            aria-label="Remove image"
            className="absolute top-2 right-2 p-1.5 bg-bg-raised/80 rounded-full text-text-muted hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* URL input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="cover-image-url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApply())}
            placeholder="https://example.com/image.jpg"
            error={error}
          />
        </div>
        <button
          type="button"
          onClick={handleApply}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-[var(--radius-md)] bg-bg-raised border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors text-sm flex-shrink-0"
        >
          <Link size={14} />
          Apply
        </button>
      </div>

      {!preview && (
        <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] border border-dashed border-border bg-bg-raised/50">
          <Image size={14} className="text-text-muted flex-shrink-0" />
          <p className="text-xs text-text-muted">
            Paste an image URL above. Use{' '}
            <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Imgur
            </a>
            {' '}or{' '}
            <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Cloudinary
            </a>
            {' '}to host images for free.
          </p>
        </div>
      )}
    </div>
  )
}

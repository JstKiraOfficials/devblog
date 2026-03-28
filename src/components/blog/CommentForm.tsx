import { useState } from 'react'
import { Input, Textarea, Button } from '@/components/ui'
import { addComment } from '@/api/comments'
import { toast } from '@/components/ui/Toast'

interface CommentFormProps {
  postId: string
  parentId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
}

export const CommentForm = ({ postId, parentId = null, onSuccess, onCancel }: CommentFormProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [content, setContent] = useState('')
  const [honeypot, setHoneypot] = useState('') // spam trap
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return // bot detected

    setSubmitting(true)
    try {
      await addComment(postId, { authorName: name, authorEmail: email, authorWebsite: website, content, parentId })
      setSubmitted(true)
      onSuccess?.()
    } catch {
      toast.error('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-4 rounded-[var(--radius-md)] bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
        Your comment is awaiting moderation. Thank you!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website_url"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none h-0 w-0"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="comment-name"
          label="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
        />
        <Input
          id="comment-email"
          label="Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
        />
      </div>

      <Input
        id="comment-website"
        label="Website"
        type="url"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        placeholder="https://yoursite.com"
      />

      <Textarea
        id="comment-content"
        label="Comment *"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        placeholder="Write your comment... (Markdown supported)"
        className="min-h-[120px]"
      />

      <div className="flex gap-3">
        <Button type="submit" loading={submitting}>
          {parentId ? 'Post Reply' : 'Post Comment'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

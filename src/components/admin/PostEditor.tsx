import { useState, useEffect, useCallback, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { useNavigate } from 'react-router-dom'
import { FrontmatterForm } from './FrontmatterForm'
import { EditorToolbar } from './EditorToolbar'
import { EditorPreview } from './EditorPreview'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import { useCreatePost, useUpdatePost, useDeletePost } from '@/hooks/useAdminPosts'
import { toast } from '@/components/ui/Toast'
import { ROUTES } from '@/constants/routes'
import type { Post, PostDraft } from '@/types'

interface PostEditorProps {
  post?: Post
}

const defaultDraft: Partial<PostDraft> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  coverImageAlt: '',
  tags: [],
  status: 'draft',
  featured: false,
  seoTitle: '',
  seoDescription: '',
  ogImage: '',
}

export const PostEditor = ({ post }: PostEditorProps) => {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<Partial<PostDraft>>(post ? { ...post } : defaultDraft)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { mutateAsync: createPost, isPending: creating } = useCreatePost()
  const { mutateAsync: updatePost, isPending: updating } = useUpdatePost()
  const { mutateAsync: deletePost, isPending: deleting } = useDeletePost()

  const updateDraft = (updates: Partial<PostDraft>) => {
    setDraft((d) => ({ ...d, ...updates }))
  }

  // Auto-save debounce (3s)
  useEffect(() => {
    if (!post?.id || !draft.content) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    setSaveStatus('saving')
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await updatePost({ id: post.id, updates: draft as Partial<PostDraft> })
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch {
        setSaveStatus('idle')
      }
    }, 3000)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [draft]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveDraft = useCallback(async () => {
    try {
      const payload = { ...draft, status: 'draft' as const }
      if (post?.id) {
        await updatePost({ id: post.id, updates: payload })
        toast.success('Draft saved.')
      } else {
        const id = await createPost(payload as PostDraft)
        toast.success('Draft created.')
        navigate(`/admin/posts/${id}/edit`)
      }
    } catch {
      toast.error('Failed to save draft.')
    }
  }, [draft, post, createPost, updatePost, navigate])

  const handlePublish = useCallback(async () => {
    try {
      const payload = { ...draft, status: 'published' as const }
      if (post?.id) {
        await updatePost({ id: post.id, updates: payload })
        toast.success('Post published.')
      } else {
        const id = await createPost(payload as PostDraft)
        toast.success('Post published.')
        navigate(`/admin/posts/${id}/edit`)
      }
    } catch {
      toast.error('Failed to publish post.')
    }
  }, [draft, post, createPost, updatePost, navigate])

  const handleDelete = async () => {
    if (!post?.id) return
    try {
      await deletePost(post.id)
      toast.success('Post deleted.')
      navigate(ROUTES.ADMIN_POSTS)
    } catch {
      toast.error('Failed to delete post.')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-2rem)]">
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDelete={post ? () => setDeleteOpen(true) : undefined}
        saving={creating || updating}
        saveStatus={saveStatus}
        isEdit={!!post}
      />

      {/* Mobile tab switcher */}
      <div className="md:hidden flex border-b border-border bg-bg-surface">
        {(['editor', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={[
              'flex-1 py-2.5 text-sm font-medium capitalize transition-colors',
              mobileTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-secondary',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Editor panel — always visible on desktop, tab-controlled on mobile */}
        <div className={[
          'md:w-[60%] flex flex-col overflow-y-auto md:border-r border-border',
          mobileTab === 'editor' ? 'flex' : 'hidden md:flex',
        ].join(' ')}>
          <div className="p-4 md:p-6 border-b border-border">
            <FrontmatterForm value={draft} onChange={updateDraft} />
          </div>
          <div className="flex-1 p-3 md:p-4 min-h-[300px]" data-color-mode="dark">
            <MDEditor
              value={draft.content ?? ''}
              onChange={(v) => updateDraft({ content: v ?? '' })}
              height="100%"
              preview="edit"
              className="!bg-bg-surface !border-border"
            />
          </div>
        </div>

        {/* Preview panel — always visible on desktop, tab-controlled on mobile */}
        <div className={[
          'md:w-[40%] overflow-y-auto',
          mobileTab === 'preview' ? 'flex flex-col flex-1' : 'hidden md:block',
        ].join(' ')}>
          <EditorPreview content={draft.content ?? ''} />
        </div>
      </div>

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title={post?.title}
        loading={deleting}
      />
    </div>
  )
}

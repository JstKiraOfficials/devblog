import { Save, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'

interface EditorToolbarProps {
  onSaveDraft: () => void
  onPublish: () => void
  onDelete?: () => void
  saving?: boolean
  publishing?: boolean
  saveStatus?: 'saved' | 'saving' | 'idle'
  isEdit?: boolean
}

export const EditorToolbar = ({
  onSaveDraft,
  onPublish,
  onDelete,
  saving,
  publishing,
  saveStatus = 'idle',
  isEdit,
}: EditorToolbarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border bg-bg-surface">
    <div className="flex items-center gap-2 min-w-0">
      {saveStatus === 'saving' && (
        <span className="text-xs text-text-muted flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          Saving...
        </span>
      )}
      {saveStatus === 'saved' && (
        <span className="text-xs text-green-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Saved
        </span>
      )}
    </div>

    <div className="flex items-center gap-2 flex-wrap">
      {isEdit && onDelete && (
        <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={onDelete}>
          <span className="hidden sm:inline">Delete</span>
        </Button>
      )}
      <Button variant="secondary" size="sm" icon={<Save size={14} />} onClick={onSaveDraft} loading={saving}>
        <span className="hidden sm:inline">Save Draft</span>
      </Button>
      <Button size="sm" icon={<Send size={14} />} onClick={onPublish} loading={publishing}>
        Publish
      </Button>
    </div>
  </div>
)

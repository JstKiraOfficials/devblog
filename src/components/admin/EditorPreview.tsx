import { MarkdownRenderer } from '@/components/blog'

interface EditorPreviewProps {
  content: string
}

export const EditorPreview = ({ content }: EditorPreviewProps) => (
  <div className="h-full flex flex-col">
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg-surface">
      <span className="w-2 h-2 rounded-full bg-primary" />
      <span className="text-xs font-semibold uppercase tracking-wider text-primary">Preview</span>
    </div>
    <div className="flex-1 overflow-y-auto p-6">
      {content ? (
        <MarkdownRenderer content={content} />
      ) : (
        <p className="text-text-muted text-sm italic">Start writing to see a preview...</p>
      )}
    </div>
  </div>
)

import { Badge } from '@/components/ui'
import type { PostStatus } from '@/types'

const statusMap: Record<PostStatus, { label: string; variant: 'primary' | 'success' | 'muted' | 'warning' }> = {
  published: { label: 'Published', variant: 'success' },
  draft:     { label: 'Draft',     variant: 'warning' },
  archived:  { label: 'Archived',  variant: 'muted' },
}

export const DraftBadge = ({ status }: { status: PostStatus }) => {
  const { label, variant } = statusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

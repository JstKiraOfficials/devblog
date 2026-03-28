import { TagBadge } from './TagBadge'
import { Skeleton } from '@/components/ui'
import type { Tag } from '@/types'

interface TagCloudProps {
  tags: Tag[]
  loading?: boolean
}

export const TagCloud = ({ tags, loading }: TagCloudProps) => {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagBadge key={tag.name} tag={tag.label || tag.name} color={tag.color} count={tag.postCount} />
      ))}
    </div>
  )
}

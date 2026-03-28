import { format } from 'date-fns'
import { Clock, Eye, Calendar } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { SITE_CONFIG } from '@/constants/site'

interface PostMetaProps {
  publishedAt: Date | null
  readingTime: number
  viewCount: number
  size?: 'sm' | 'md'
}

export const PostMeta = ({ publishedAt, readingTime, viewCount, size = 'md' }: PostMetaProps) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={`flex flex-wrap items-center gap-3 ${textSize} text-text-muted`}>
      <div className="flex items-center gap-2">
        <Avatar src={SITE_CONFIG.authorAvatar} alt={SITE_CONFIG.authorName} size="sm" />
        <span className="text-text-secondary font-medium">{SITE_CONFIG.authorName}</span>
      </div>
      <span className="text-border">·</span>
      {publishedAt && (
        <>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <time dateTime={publishedAt.toISOString()}>
              {format(publishedAt, 'MMM d, yyyy')}
            </time>
          </div>
          <span className="text-border">·</span>
        </>
      )}
      <div className="flex items-center gap-1.5">
        <Clock size={13} />
        <span>{readingTime} min read</span>
      </div>
      <span className="text-border">·</span>
      <div className="flex items-center gap-1.5">
        <Eye size={13} />
        <span>{viewCount.toLocaleString()} views</span>
      </div>
    </div>
  )
}

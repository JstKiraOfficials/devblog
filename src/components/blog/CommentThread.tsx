import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { MarkdownRenderer } from './MarkdownRenderer'
import { CommentForm } from './CommentForm'
import { Avatar } from '@/components/ui'
import { md5 } from '@/lib/md5'
import type { Comment } from '@/types'

interface CommentThreadProps {
  comments: Comment[]
  postId: string
  parentId?: string | null
  depth?: number
}

/** Gravatar URL using MD5 hash of email */
const gravatarUrl = (email: string) => {
  const hash = md5(email.trim().toLowerCase())
  return `https://gravatar.com/avatar/${hash}?d=identicon&s=40`
}

const CommentItem = ({
  comment,
  allComments,
  postId,
  depth,
}: {
  comment: Comment
  allComments: Comment[]
  postId: string
  depth: number
}) => {
  const [replying, setReplying] = useState(false)
  const replies = allComments.filter((c) => c.parentId === comment.id)

  return (
    <div className={depth > 0 ? 'ml-8 border-l border-border pl-4' : ''}>
      <div className="flex gap-3 py-4">
        <Avatar
          src={gravatarUrl(comment.authorEmail)}
          alt={comment.authorName}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-text-primary text-sm">{comment.authorName}</span>
            {comment.authorWebsite && (
              <a
                href={comment.authorWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                {comment.authorWebsite.replace(/^https?:\/\//, '')}
              </a>
            )}
            <time className="text-xs text-text-muted ml-auto">
              {format(comment.createdAt, 'MMM d, yyyy')}
            </time>
          </div>

          <div className="prose prose-devblog prose-sm max-w-none">
            <MarkdownRenderer content={comment.content} />
          </div>

          <button
            onClick={() => setReplying((r) => !r)}
            className="mt-2 text-xs text-text-muted hover:text-primary transition-colors"
          >
            {replying ? 'Cancel' : 'Reply'}
          </button>

          <AnimatePresence>
            {replying && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 overflow-hidden"
              >
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSuccess={() => setReplying(false)}
                  onCancel={() => setReplying(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          allComments={allComments}
          postId={postId}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export const CommentThread = ({ comments, postId }: CommentThreadProps) => {
  const topLevel = comments.filter((c) => c.parentId === null)

  if (topLevel.length === 0) {
    return (
      <p className="text-text-muted text-sm py-4">
        No comments yet. Be the first to share your thoughts!
      </p>
    )
  }

  return (
    <div className="divide-y divide-border">
      {topLevel.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          allComments={comments}
          postId={postId}
          depth={0}
        />
      ))}
    </div>
  )
}

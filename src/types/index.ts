export type PostStatus = 'draft' | 'published' | 'archived'

export type ReactionType = 'like' | 'love' | 'fire' | 'wow'

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  coverImageAlt: string
  tags: string[]
  status: PostStatus
  featured: boolean
  readingTime: number
  viewCount: number
  reactionCounts: Record<ReactionType, number>
  commentCount: number
  publishedAt: Date | null
  updatedAt: Date
  createdAt: Date
  seoTitle: string
  seoDescription: string
  ogImage: string
}

export interface PostDraft
  extends Omit<
    Post,
    'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'reactionCounts' | 'commentCount'
  > {}

export interface Tag {
  name: string
  label: string
  color: string
  postCount: number
}

export interface Comment {
  id: string
  postId: string
  parentId: string | null
  authorName: string
  authorEmail: string
  authorWebsite: string
  content: string
  isApproved: boolean
  createdAt: Date
}

export interface Reaction {
  id: string
  postId: string
  type: ReactionType
  sessionId: string
  createdAt: Date
}

export interface SiteConfig {
  name: string
  tagline: string
  authorName: string
  authorBio: string
  authorAvatar: string
  email: string
  github: string
  twitter: string
  linkedin: string
  postsPerPage: number
}

export interface TableOfContentsItem {
  id: string
  text: string
  level: 2 | 3 | 4
  children: TableOfContentsItem[]
}

export interface SearchResult {
  item: Post
  score: number
  matches?: ReadonlyArray<{ key: string; value: string }>
}

export interface AppException {
  code: string
  message: string
  originalError?: unknown
}

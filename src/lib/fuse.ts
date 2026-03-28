import Fuse from 'fuse.js'
import type { Post } from '@/types'

export const createPostSearch = (posts: Post[]) =>
  new Fuse(posts, {
    keys: [
      { name: 'title',   weight: 0.5 },
      { name: 'excerpt', weight: 0.3 },
      { name: 'tags',    weight: 0.2 },
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  })

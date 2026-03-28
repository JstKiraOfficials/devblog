export const ROUTES = {
  HOME:        '/',
  BLOG:        '/blog',
  POST:        '/blog/:slug',
  TAG:         '/tag/:tag',
  SEARCH:      '/search',
  ABOUT:       '/about',

  ADMIN_LOGIN: '/admin/login',
  ADMIN:       '/admin',
  ADMIN_POSTS: '/admin/posts',
  ADMIN_NEW:   '/admin/posts/new',
  ADMIN_EDIT:  '/admin/posts/:id/edit',
} as const

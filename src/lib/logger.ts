const isDev = import.meta.env.DEV

export const logger = {
  info:  (...args: unknown[]) => { if (isDev) console.info('[DevBlog]', ...args) },
  warn:  (...args: unknown[]) => { if (isDev) console.warn('[DevBlog]', ...args) },
  error: (...args: unknown[]) => { console.error('[DevBlog]', ...args) },
}

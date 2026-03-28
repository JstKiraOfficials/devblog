import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          light:   '#FF8C38',
          dark:    '#D45500',
          muted:   'rgba(255,107,0,0.12)',
        },
        bg: {
          DEFAULT: '#0A0A0A',
          surface: '#111111',
          raised:  '#181818',
        },
        border: {
          DEFAULT: '#242424',
          subtle:  '#1A1A1A',
        },
        text: {
          primary:   '#FFFFFF',
          secondary: '#A0A0A0',
          muted:     '#555555',
        },
      },
      fontFamily: {
        heading: ['Bricolage Grotesque', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      typography: (theme: (arg: string) => string) => ({
        devblog: {
          css: {
            '--tw-prose-body':          theme('colors.text.secondary'),
            '--tw-prose-headings':      theme('colors.text.primary'),
            '--tw-prose-links':         theme('colors.primary.DEFAULT'),
            '--tw-prose-code':          theme('colors.text.primary'),
            '--tw-prose-pre-bg':        '#0F0F0F',
            '--tw-prose-pre-code':      '#E4E4E7',
            '--tw-prose-hr':            theme('colors.border.DEFAULT'),
            '--tw-prose-quotes':        theme('colors.text.secondary'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-bullets':       theme('colors.primary.DEFAULT'),
            '--tw-prose-counters':      theme('colors.primary.DEFAULT'),
            maxWidth: 'none',
            lineHeight: '1.8',
            'h1, h2, h3, h4': { fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: '700' },
            'h2': { fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem' },
            'h3': { fontSize: '1.35rem', marginTop: '2rem' },
            'a': { textDecoration: 'none', borderBottom: '1px solid var(--color-primary)', paddingBottom: '1px' },
            'a:hover': { color: '#FF8C38' },
            'blockquote': {
              borderLeftColor: 'var(--color-primary)',
              borderLeftWidth: '3px',
              background: 'rgba(255,107,0,0.05)',
              borderRadius: '0 8px 8px 0',
              padding: '16px 20px',
              fontStyle: 'normal',
            },
            'code::before': { content: 'none' },
            'code::after':  { content: 'none' },
            'code': {
              background: '#181818',
              border: '1px solid #2A2A2A',
              borderRadius: '5px',
              padding: '2px 7px',
              fontSize: '0.875em',
              fontFamily: 'JetBrains Mono, monospace',
            },
            'pre': {
              background: '#0F0F0F',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config

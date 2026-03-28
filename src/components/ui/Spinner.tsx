interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div
    role="status"
    aria-label="Loading"
    className={[
      'border-2 border-border border-t-primary rounded-full animate-spin',
      sizeMap[size],
      className,
    ].join(' ')}
  />
)

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'muted'
  className?: string
}

const variantClasses = {
  primary: 'bg-primary-muted text-primary border border-primary/20',
  success: 'bg-green-500/10 text-green-400 border border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  error:   'bg-red-500/10 text-red-400 border border-red-500/20',
  muted:   'bg-bg-raised text-text-muted border border-border',
}

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => (
  <span
    className={[
      'inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-full)] text-xs font-medium',
      variantClasses[variant],
      className,
    ].join(' ')}
  >
    {children}
  </span>
)

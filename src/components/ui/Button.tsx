import { forwardRef } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'ghost' | 'danger' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

// Button as <button>
interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: 'button'
  to?: never
}

// Button as <Link>
interface ButtonAsLink extends ButtonBaseProps, Omit<LinkProps, 'children'> {
  as: typeof Link
  to: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantClasses: Record<Variant, string> = {
  primary:   'bg-primary text-text-inverse hover:bg-primary-light active:bg-primary-dark',
  ghost:     'border border-primary text-primary hover:bg-primary-muted',
  danger:    'bg-red-600 text-white hover:bg-red-500',
  secondary: 'bg-bg-raised text-text-secondary border border-border hover:border-primary hover:text-text-primary',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

const baseClass = (variant: Variant, size: Size, className: string) =>
  [
    'inline-flex items-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors duration-200',
    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ')

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const { variant = 'primary', size = 'md', loading, icon, children, className = '' } = props

    const content = (
      <>
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon}
        {children}
      </>
    )

    if (props.as === Link) {
      const { as: _as, variant: _v, size: _s, loading: _l, icon: _i, className: _c, ...linkProps } = props
      return (
        <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
          <Link
            {...(linkProps as LinkProps)}
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={baseClass(variant, size, className)}
          >
            {content}
          </Link>
        </motion.div>
      )
    }

    const { as: _as, variant: _v, size: _s, loading: _l, icon: _i, className: _c, to: _t, ...btnProps } = props as ButtonAsButton & { to?: never }
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileTap={{ scale: 0.97 }}
        disabled={_l || (btnProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled}
        className={baseClass(variant, size, className)}
        {...(btnProps as React.ComponentProps<typeof motion.button>)}
      >
        {content}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'

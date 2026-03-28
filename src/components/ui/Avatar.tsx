interface AvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-12 h-12' }

export const Avatar = ({ src, alt, size = 'md', className = '' }: AvatarProps) => (
  <img
    src={src}
    alt={alt}
    className={[
      'rounded-full object-cover border border-border flex-shrink-0',
      sizeMap[size],
      className,
    ].join(' ')}
    loading="lazy"
  />
)

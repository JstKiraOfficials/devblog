interface DividerProps {
  className?: string
  label?: string
}

export const Divider = ({ className = '', label }: DividerProps) => (
  <div className={['flex items-center gap-4', className].join(' ')}>
    <div className="flex-1 h-px bg-border" />
    {label && <span className="text-xs text-text-muted">{label}</span>}
    <div className="flex-1 h-px bg-border" />
  </div>
)

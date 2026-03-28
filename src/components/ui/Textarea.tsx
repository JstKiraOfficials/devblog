import { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  charCount?: number
  maxChars?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, charCount, maxChars, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex justify-between items-center">
          <label htmlFor={id} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
          {maxChars !== undefined && charCount !== undefined && (
            <span className={`text-xs ${charCount > maxChars ? 'text-red-400' : 'text-text-muted'}`}>
              {charCount}/{maxChars}
            </span>
          )}
        </div>
      )}
      <textarea
        ref={ref}
        id={id}
        className={[
          'w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-bg-surface border text-text-primary',
          'placeholder:text-text-muted text-sm transition-colors duration-200 resize-y min-h-[100px]',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          error ? 'border-red-500' : 'border-border hover:border-primary/50',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

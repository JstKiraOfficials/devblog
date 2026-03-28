import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { Tooltip } from '@/components/ui'

interface ShareButtonsProps {
  title: string
  url: string
}

export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false)

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const btnClass =
    'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm border border-border ' +
    'text-text-secondary hover:border-primary hover:text-primary bg-bg-surface transition-all duration-200'

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
        Share this article
      </p>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter/X"
        className={btnClass}
      >
        <TwitterIcon size={14} />
        <span>Twitter / X</span>
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={btnClass}
      >
        <LinkedinIcon size={14} />
        <span>LinkedIn</span>
      </a>
      <Tooltip content={copied ? 'Copied!' : 'Copy link'} position="bottom">
        <button onClick={copyLink} aria-label="Copy link to clipboard" className={`${btnClass} w-full`}>
          {copied ? <Check size={14} className="text-green-400" /> : <Link2 size={14} />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </Tooltip>
    </div>
  )
}

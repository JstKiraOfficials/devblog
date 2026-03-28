import { useState } from 'react'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button, Input } from '@/components/ui'
import { Mail } from 'lucide-react'

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        subscribedAt: Timestamp.now(),
        isVerified: false,
      })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-2">
        <p className="text-green-400 font-medium">You're subscribed! Thanks for joining.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label="Email address for newsletter"
          className="focus:shadow-[var(--shadow-orange)]"
        />
      </div>
      <Button type="submit" loading={status === 'loading'} icon={<Mail size={15} />}>
        Subscribe
      </Button>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-1">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}

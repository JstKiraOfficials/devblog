import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useUIStore } from '@/store/uiStore'
import { SITE_CONFIG } from '@/constants/site'

/** SearchPage just opens the search modal — the modal handles everything */
const SearchPage = () => {
  const { setSearchOpen } = useUIStore()

  useEffect(() => {
    setSearchOpen(true)
    return () => setSearchOpen(false)
  }, [setSearchOpen])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center"
    >
      <Helmet>
        <title>Search — {SITE_CONFIG.name}</title>
      </Helmet>
      <p className="text-text-muted">Opening search…</p>
    </motion.div>
  )
}

export default SearchPage

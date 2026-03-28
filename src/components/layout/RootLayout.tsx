import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { SearchModal } from '@/components/search'
import { ToastContainer } from '@/components/ui'

export const RootLayout = () => (
  <div className="min-h-screen bg-bg flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <SearchModal />
    <ToastContainer />
  </div>
)

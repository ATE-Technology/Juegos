import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

interface MainLayoutProps {
  children?: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16" id="main-content">
        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

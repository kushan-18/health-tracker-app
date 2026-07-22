'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { useStore } from '@/lib/store'

interface AppLayoutProps {
  children: React.ReactNode
  title: string
}

function AppLayout({ children, title }: AppLayoutProps) {
  const sidebarOpen = useStore((s) => s.sidebarOpen)
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <motion.div
        className="flex flex-col min-h-screen transition-[margin]"
        style={{
          marginLeft: isDesktop ? (sidebarOpen ? 260 : 76) : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pt-16 lg:pt-4">
          {children}
        </main>
      </motion.div>
    </div>
  )
}

export { AppLayout }

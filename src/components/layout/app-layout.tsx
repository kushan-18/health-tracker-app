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

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <motion.div
        className="flex flex-col min-h-screen"
        animate={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024
            ? sidebarOpen ? 260 : 76
            : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </motion.div>
    </div>
  )
}

export { AppLayout }

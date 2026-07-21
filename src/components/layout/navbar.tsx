'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, Sun, Moon, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'

interface NavbarProps {
  title: string
}

function Navbar({ title }: NavbarProps) {
  const [searchFocused, setSearchFocused] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const toggleSidebar = useStore((s) => s.toggleSidebar)
  const sidebarOpen = useStore((s) => s.sidebarOpen)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const user = useStore((s) => s.user)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-gray-950/60 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-gray-400 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Page Title */}
      <h1 className="text-lg font-bold text-white">{title}</h1>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors',
          searchFocused ? 'text-purple-400' : 'text-gray-500'
        )} />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={cn(
            'h-10 w-56 rounded-xl border bg-white/5 px-4 pl-10 pr-4 text-sm text-white placeholder-gray-500',
            'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50',
            searchFocused ? 'w-72 border-purple-500/50 bg-white/10' : 'border-white/10'
          )}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          3
        </span>
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/10 transition-all"
        >
          <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name} size="md" />
        </button>
        {profileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl p-2 shadow-2xl"
            >
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400">
                <span>Level {12}</span>
                <span className="text-purple-400">•</span>
                <span className="text-purple-400">4,500 XP</span>
                <span className="text-yellow-400">•</span>
                <span className="text-yellow-400">320 coins</span>
              </div>
              {['My Profile', 'Settings', 'Help', 'Logout'].map((item) => (
                <button
                  key={item}
                  onClick={() => setProfileOpen(false)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </header>
  )
}

export { Navbar }

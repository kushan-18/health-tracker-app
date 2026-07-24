'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, Settings, User, HelpCircle, Dumbbell, Droplets, Moon as MoonIcon, Trophy, Check, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'

interface NavbarProps {
  title: string
}

function Navbar({ title }: NavbarProps) {
  const [searchFocused, setSearchFocused] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [notifOpen, setNotifOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState([
    { id: 1, icon: Dumbbell, text: 'Time for your workout!', time: '10 min ago', read: false, color: 'text-purple-400' },
    { id: 2, icon: Droplets, text: 'Drink water reminder', time: '30 min ago', read: false, color: 'text-blue-400' },
    { id: 3, icon: Trophy, text: 'You completed a 15-day streak!', time: '1 hour ago', read: false, color: 'text-yellow-400' },
    { id: 4, icon: MoonIcon, text: 'Great sleep score: 8.5/10', time: '8 hours ago', read: true, color: 'text-indigo-400' },
  ])
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const user = useStore((s) => s.user)
  const logout = useStore((s) => s.logout)
  const xp = useStore((s) => s.xp)
  const level = useStore((s) => s.level)
  const coins = useStore((s) => s.coins)

  const handleLogout = () => {
    setProfileOpen(false)
    logout()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-gray-950/60 backdrop-blur-xl px-4 lg:px-6">
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
        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        aria-label="Toggle theme"
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.div>
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>
        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl p-2 shadow-2xl"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <button
                    onClick={() => setNotifications(n => n.map(x => ({ ...x, read: true })))}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Mark all read
                  </button>
                </div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${notif.read ? 'opacity-60' : 'bg-white/5'}`}
                  >
                    <div className={`mt-0.5 ${notif.color}`}>
                      <notif.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{notif.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                    </div>
                    {!notif.read && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
                <div className="border-t border-white/10 mt-1 pt-1">
                  <button className="w-full text-center text-xs text-purple-400 hover:text-purple-300 py-2 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/10 transition-all active:scale-95"
        >
          <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name} size="md" />
          <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform hidden sm:block', profileOpen && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl p-2 shadow-2xl"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">Level {level}</span>
                    <span className="text-xs text-gray-400">{xp.toLocaleString()} XP</span>
                    <span className="text-xs text-yellow-400">{coins} coins</span>
                  </div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export { Navbar }

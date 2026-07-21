'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Brain,
  Dumbbell,
  Trophy,
  Utensils,
  BarChart3,
  Heart,
  Calendar,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Tooltip } from '@/components/ui/tooltip'
import { useStore } from '@/lib/store'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'AI Coach', href: '/ai-coach', icon: Brain },
  { label: 'Workout', href: '/workout', icon: Dumbbell },
  { label: 'Sports', href: '/sports', icon: Trophy },
  { label: 'Nutrition', href: '/nutrition', icon: Utensils },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Health', href: '/health', icon: Heart },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Social', href: '/social', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
]

function Sidebar() {
  const pathname = usePathname()
  const sidebarOpen = useStore((s) => s.sidebarOpen)
  const toggleSidebar = useStore((s) => s.toggleSidebar)
  const user = useStore((s) => s.user)

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen flex-col border-r border-white/10 bg-gray-950/80 backdrop-blur-2xl"
        animate={{ width: sidebarOpen ? 260 : 76 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4 border-b border-white/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              >
                VitalX AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-white/10"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon className={cn('relative z-10 h-5 w-5 shrink-0', isActive && 'text-purple-400')} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="relative z-10 overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )

            if (!sidebarOpen) {
              return (
                <Tooltip key={item.href} content={item.label} side="right">
                  {linkContent}
                </Tooltip>
              )
            }

            return <div key={item.href}>{linkContent}</div>
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-white/10 p-3">
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                fallback={user?.name}
                size="md"
                online
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <Tooltip content="Profile" side="right">
              <div className="flex justify-center">
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  fallback={user?.name}
                  size="md"
                  online
                />
              </div>
            </Tooltip>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleSidebar}
              />
              <motion.aside
                className="fixed left-0 top-0 z-50 h-screen w-72 flex flex-col border-r border-white/10 bg-gray-950/95 backdrop-blur-2xl"
                initial={{ x: -288 }}
                animate={{ x: 0 }}
                exit={{ x: -288 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="flex h-16 items-center gap-3 px-4 border-b border-white/10">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    VitalX AI
                  </span>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={toggleSidebar}
                        className={cn(
                          'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobileSidebarActive"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-white/10"
                          />
                        )}
                        <Icon className={cn('relative z-10 h-5 w-5 shrink-0', isActive && 'text-purple-400')} />
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
                <div className="border-t border-white/10 p-3">
                  <div className="flex items-center gap-3 rounded-xl p-2">
                    <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name} size="md" online />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export { Sidebar }

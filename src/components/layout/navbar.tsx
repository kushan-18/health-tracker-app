"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Bell,
  Menu,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useLogout } from "@/lib/hooks";
import { Avatar } from "@/components/ui/avatar";

interface NavbarProps {
  title: string;
}

function Navbar({ title }: NavbarProps) {
  const { theme, toggleTheme, streaks, level, coins } = useStore();
  const { user } = useAuth();
  const handleLogout = useLogout();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-20 h-16 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => useStore.getState().toggleSidebar()}
            className="rounded-lg p-2 text-zinc-400 hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.div>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative rounded-lg p-2 text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                        <Bell className="h-5 w-5 text-zinc-500" />
                      </div>
                      <p className="text-sm font-medium text-zinc-300">No notifications yet</p>
                      <p className="mt-1 text-xs text-zinc-500">We&apos;ll notify you here when something needs your attention.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <Avatar
                size="sm"
                fallback={user?.user_metadata?.name?.charAt(0) || "U"}
                online
              />
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-64 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="border-b border-white/5 px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      {user?.user_metadata?.name || "User"}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {user?.email || ""}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="text-purple-400">Lv. {level}</span>
                      <span className="text-blue-400">{coins} coins</span>
                      <span className="text-amber-400">🔥 {streaks}d</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/settings"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export { Navbar };

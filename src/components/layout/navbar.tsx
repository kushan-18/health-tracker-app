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
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/avatar";

const supabase = createClient();

interface NavbarProps {
  title: string;
}

const notifications = [
  {
    id: "1",
    title: "Workout Complete!",
    message: "You burned 420 calories in your Push Day session.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Water Reminder",
    message: "Time to drink a glass of water. Stay hydrated!",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Achievement Unlocked",
    message: "You earned the '7-Day Streak' badge!",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    title: "Weekly Goal",
    message: "You're 80% towards your workout goal this week.",
    time: "Yesterday",
    read: true,
  },
];

function Navbar({ title }: NavbarProps) {
  const { theme, toggleTheme, streaks, level, coins } = useStore();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [notifState, setNotifState] = React.useState(notifications);

  const unreadCount = notifState.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifState((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-20 h-16 glass border-b border-border">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => useStore.getState().toggleSidebar()}
            className="rounded-lg p-2 text-zinc-400 hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all"
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
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 glass-strong rounded-xl border border-border shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifState.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "border-b border-border px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                          !n.read && "bg-purple-500/5"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && (
                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {n.title}
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-1">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                  className="absolute right-0 top-12 w-64 glass-strong rounded-xl border border-border shadow-2xl overflow-hidden"
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

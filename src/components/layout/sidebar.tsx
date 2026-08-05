"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Dumbbell,
  Trophy,
  Apple,
  BarChart3,
  Heart,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useLogout } from "@/lib/hooks";
import { Avatar } from "@/components/ui/avatar";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Coach", href: "/coach", icon: Bot },
  { label: "Workout", href: "/workout", icon: Dumbbell },
  { label: "Sports", href: "/sports", icon: Trophy },
  { label: "Nutrition", href: "/nutrition", icon: Apple },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Health", href: "/health", icon: Heart },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Social", href: "/social", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isMobile: boolean;
}

function Sidebar({ isMobile }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useStore();
  const { user } = useAuth();
  const handleLogout = useLogout();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
            <span className="text-sm font-bold text-white">VX</span>
          </div>
          <span className="text-lg font-bold text-gradient">VitalX AI</span>
        </Link>
        {isMobile && (
            <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 min-h-[44px]",
                isActive
                  ? "bg-purple-500/15 text-purple-400"
                  : "text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isMobile && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <Avatar
            size="sm"
            fallback={user?.user_metadata?.name?.charAt(0) || "U"}
            online
          />
          {!isMobile && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.user_metadata?.name || "User"}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/10 transition-all min-h-[44px]"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isMobile && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 bg-background border-r border-border transition-all duration-300 hidden lg:block",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {sidebarContent}
      <button
        onClick={() => useStore.getState().toggleSidebar()}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-zinc-400 hover:text-foreground transition-colors"
      >
        <ChevronLeft
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            !sidebarOpen && "rotate-180"
          )}
        />
      </button>
    </aside>
  );
}

export { Sidebar };

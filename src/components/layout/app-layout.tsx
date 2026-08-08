"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

function AppLayout({ children, title }: AppLayoutProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const { sidebarOpen, theme } = useStore();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.setProperty("--background", "#09090b");
      root.style.setProperty("--foreground", "#fafafa");
      root.style.setProperty("--border", "rgba(255, 255, 255, 0.08)");
      root.style.setProperty("--card", "rgba(255, 255, 255, 0.05)");
      root.style.setProperty("--card-foreground", "#fafafa");
      root.style.setProperty("--muted", "#27272a");
      root.style.setProperty("--muted-foreground", "#a1a1aa");
      root.style.setProperty("--input", "rgba(255, 255, 255, 0.05)");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.style.setProperty("--background", "#f8fafc");
      root.style.setProperty("--foreground", "#0f172a");
      root.style.setProperty("--border", "rgba(0, 0, 0, 0.1)");
      root.style.setProperty("--card", "rgba(0, 0, 0, 0.03)");
      root.style.setProperty("--card-foreground", "#0f172a");
      root.style.setProperty("--muted", "#e2e8f0");
      root.style.setProperty("--muted-foreground", "#64748b");
      root.style.setProperty("--input", "rgba(0, 0, 0, 0.05)");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 z-0 ambient-app" aria-hidden="true" />
      <Sidebar isMobile={isMobile} />
      <div
        className={cn(
          "relative z-10 transition-all duration-300",
          !isMobile && sidebarOpen ? "lg:ml-64" : !isMobile ? "lg:ml-20" : ""
        )}
      >
        <Navbar title={title} />
        <main className="pt-16 min-h-screen px-4 lg:px-6 pb-4 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export { AppLayout };

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within Tabs provider");
  return context;
}

interface TabsRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value: controlledValue, defaultValue = "", onValueChange, children, className }: TabsRootProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const handleChange = React.useCallback(
    (v: string) => {
      setInternalValue(v);
      onValueChange?.(v);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-white/5 p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors min-h-[44px]",
        isActive ? "text-white" : "text-zinc-400 hover:text-white",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="tabs-indicator"
          className="absolute inset-0 rounded-lg bg-white/10"
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  );
}

interface TabPanelProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
}

function TabPanel({ value, activeTab, children }: TabPanelProps) {
  if (value !== activeTab) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabPanel };

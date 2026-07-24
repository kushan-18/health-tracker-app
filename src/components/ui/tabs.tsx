'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

interface TabTriggerProps {
  value: string
  label: string
  className?: string
}

interface TabContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
}>({ activeTab: '', setActiveTab: () => {} })

function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabTriggers({ children, className }: { children: React.ReactNode; className?: string }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  return (
    <div className={cn('flex gap-1 rounded-xl bg-white/5 p-1 backdrop-blur-md border border-white/10', className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        const props = child.props as TabTriggerProps
        return (
          <button
            key={props.value}
            onClick={() => setActiveTab(props.value)}
            className={cn(
              'relative flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200',
              activeTab === props.value ? 'text-white' : 'text-gray-400 hover:text-gray-300',
              props.className
            )}
          >
            {activeTab === props.value && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/50 to-blue-600/50 border border-white/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{props.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function TabTrigger({ value, label, className }: TabTriggerProps) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative px-4 py-2 text-sm font-medium transition-colors duration-200',
        activeTab === value ? 'text-white' : 'text-gray-400 hover:text-gray-300',
        className
      )}
    >
      {activeTab === value && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  )
}

function TabContent({ value, children, className }: TabContentProps) {
  const { activeTab } = React.useContext(TabsContext)
  if (activeTab !== value) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('mt-4', className)}
    >
      {children}
    </motion.div>
  )
}

export { Tabs, TabTriggers, TabTrigger, TabContent }

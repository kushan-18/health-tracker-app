import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/10',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-lg font-semibold text-white', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-gray-400', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

function InteractiveCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/10',
        'transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function StatCard({
  className,
  label,
  value,
  icon,
  change,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  label: string
  value: string | number
  icon?: React.ReactNode
  change?: { value: number; positive: boolean }
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5',
        'transition-all duration-300 hover:bg-white/10 hover:border-white/20',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        {icon && <div className="text-purple-400">{icon}</div>}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change && (
          <span
            className={cn(
              'text-xs font-medium mb-1',
              change.positive ? 'text-green-400' : 'text-red-400'
            )}
          >
            {change.positive ? '+' : ''}{change.value}%
          </span>
        )}
      </div>
    </div>
  )
}

function GradientCard({
  className,
  gradient = 'from-purple-600/20 to-blue-600/20',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  gradient?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 backdrop-blur-xl p-6',
        `bg-gradient-to-br ${gradient}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, InteractiveCard, StatCard, GradientCard }

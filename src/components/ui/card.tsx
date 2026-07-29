"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("glass rounded-2xl p-6", className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold text-white", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-zinc-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  className?: string;
}

function StatCard({ icon, label, value, change, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            {icon}
          </div>
          <div>
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              change >= 0
                ? "bg-green-500/15 text-green-400"
                : "bg-red-500/15 text-red-400"
            )}
          >
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </Card>
  );
}

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {}

function InteractiveCard({ className, children, ...props }: InteractiveCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-200 hover:bg-white/[0.08] hover:scale-[1.02] hover:shadow-lg cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {}

function GradientCard({ className, children, ...props }: GradientCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard, InteractiveCard, GradientCard };

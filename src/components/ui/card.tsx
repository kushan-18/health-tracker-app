"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("app-card relative overflow-hidden p-6 transition-all duration-200 hover:border-white/15 hover:shadow-[0_8px_40px_-12px_rgba(16,185,129,0.25)]", className)}
    {...props}
  >
    <div className="card-glow" aria-hidden="true" />
    {children}
  </div>
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  className?: string;
  tone?: "emerald" | "blue" | "violet" | "amber" | "rose" | "cyan";
}

const toneGradients: Record<NonNullable<StatCardProps["tone"]>, string> = {
  emerald: "icon-tile",
  blue: "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_8px_20px_-8px_rgba(59,130,246,0.55)]",
  violet: "bg-gradient-to-br from-violet-500 to-purple-500 shadow-[0_8px_20px_-8px_rgba(139,92,246,0.55)]",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500 shadow-[0_8px_20px_-8px_rgba(245,158,11,0.55)]",
  rose: "bg-gradient-to-br from-rose-500 to-pink-500 shadow-[0_8px_20px_-8px_rgba(244,63,94,0.55)]",
  cyan: "bg-gradient-to-br from-cyan-500 to-teal-500 shadow-[0_8px_20px_-8px_rgba(34,211,238,0.55)]",
};

function StatCard({ icon, label, value, change, className, tone = "emerald" }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneGradients[tone]} transition-transform duration-200 group-hover:scale-110`}>
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

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

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

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function GradientCard({ className, children, ...props }: GradientCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 bg-gradient-to-br from-emerald-500/15 via-teal-500/5 to-violet-500/15 border border-emerald-500/15 transition-shadow duration-200 hover:shadow-[0_8px_40px_-12px_rgba(16,185,129,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard, InteractiveCard, GradientCard };

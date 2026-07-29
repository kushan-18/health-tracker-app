"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "text",
  width,
  height,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/5",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 w-full rounded",
        variant === "rectangular" && "rounded-xl",
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}

export { Skeleton };

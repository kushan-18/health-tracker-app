"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-xl",
};

const dotSizeClasses = {
  sm: "h-2 w-2 border",
  md: "h-2.5 w-2.5 border",
  lg: "h-3.5 w-3.5 border-2",
  xl: "h-4 w-4 border-2",
};

function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  online,
  className,
  ...props
}: AvatarProps) {
  const initials = fallback || "?";

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className={cn(
            "rounded-full object-cover ring-2 ring-white/10",
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 font-semibold text-white ring-2 ring-white/10",
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-background",
            online ? "bg-green-500" : "bg-zinc-500",
            dotSizeClasses[size]
          )}
        />
      )}
    </div>
  );
}

export { Avatar };

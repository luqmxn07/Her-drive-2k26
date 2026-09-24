"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "violet" | "plum" | "pink" | "lavender" | "green" | "emergency" | "neutral";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "violet",
  size = "md",
  icon,
  className,
}) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide";

  const variants = {
    violet:
      "bg-[#A855F7]/10 text-[#7C3AED] dark:text-[#C084FC] border border-[#A855F7]/25",
    plum:
      "bg-[#0F0524] text-white border border-[#2D1B4E]",
    pink:
      "bg-[#FDE7F3] dark:bg-[#F472B6]/20 text-[#DB2777] dark:text-[#F472B6] border border-[#F472B6]/30",
    lavender:
      "bg-[#EDE9FE] dark:bg-[#2D1B4E] text-[#6B46C1] dark:text-[#C084FC] border border-[#A855F7]/20",
    green:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    emergency:
      "bg-[#E11D48]/10 text-[#E11D48] dark:text-rose-400 border border-[#E11D48]/30",
    neutral:
      "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3.5 py-1 text-xs sm:text-sm font-semibold",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "violet" | "plum" | "green" | "lavender" | "emergency" | "neutral";
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
    violet: "bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#EDE9FE] border border-[#7C3AED]/20",
    plum: "bg-[#211827] text-white border border-white/10",
    green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    lavender: "bg-[#EDE9FE] dark:bg-[#7C3AED]/20 text-[#7C3AED] dark:text-[#EDE9FE] border border-[#7C3AED]/20",
    emergency: "bg-[#DC2626]/10 text-[#DC2626] dark:text-red-400 border border-[#DC2626]/30",
    neutral: "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10",
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

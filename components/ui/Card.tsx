"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "warm" | "lavender" | "plum" | "white" | "gradient";
  hoverEffect?: boolean;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "warm",
      hoverEffect = true,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-2xl p-6 sm:p-8 transition-all duration-300 border relative overflow-hidden";

    const variants = {
      warm: "bg-[#FAF9F7] dark:bg-[#1E0B3D] border-[#F3E8F0] dark:border-[#2D1B4E] text-[#242124] dark:text-[#FFFAFC] shadow-sm",
      white: "bg-white dark:bg-[#1E0B3D] border-gray-200/80 dark:border-[#2D1B4E] text-[#242124] dark:text-[#FFFAFC] shadow-sm",
      lavender: "bg-[#FDE7F3]/50 dark:bg-[#2D1B4E] border-[#F472B6]/25 dark:border-[#A855F7]/30 text-[#211827] dark:text-[#FFFAFC] shadow-sm",
      plum: "bg-[#0F0524] dark:bg-[#0F0524] border-[#2D1B4E] text-white shadow-xl",
      gradient:
        "bg-gradient-to-br from-[#0F0524] via-[#1E0B3D] to-[#2D1B4E] border-[#A855F7]/30 text-white shadow-xl",
    };

    const hoverStyles = hoverEffect
      ? "hover:-translate-y-1 hover:shadow-xl hover:border-[#F472B6]/40"
      : "";

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

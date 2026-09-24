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
      warm: "bg-[#FAF9F7] dark:bg-[#211827] border-[#211827]/10 dark:border-white/10 text-[#242124] dark:text-[#FAF9F7] shadow-sm",
      white: "bg-white dark:bg-[#211827]/80 border-gray-200/80 dark:border-white/10 text-[#242124] dark:text-[#FAF9F7] shadow-sm",
      lavender: "bg-[#EDE9FE]/60 dark:bg-[#2D2235] border-[#7C3AED]/20 dark:border-[#7C3AED]/30 text-[#211827] dark:text-[#FAF9F7] shadow-sm",
      plum: "bg-[#211827] dark:bg-[#1A1322] border-white/10 text-white shadow-xl",
      gradient:
        "bg-gradient-to-br from-[#211827] to-[#2D2235] border-[#7C3AED]/30 text-white shadow-xl",
    };

    const hoverStyles = hoverEffect
      ? "hover:-translate-y-1 hover:shadow-xl hover:border-[#7C3AED]/40"
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

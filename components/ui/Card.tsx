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
      warm: "bg-[#F8F7F5] border-[#17111F]/10 text-[#171717] shadow-sm",
      white: "bg-white border-gray-200/80 text-[#171717] shadow-sm",
      lavender: "bg-[#EDE9FE]/60 border-[#7C3AED]/20 text-[#17111F] shadow-sm",
      plum: "bg-[#17111F] border-white/10 text-white shadow-xl",
      gradient:
        "bg-gradient-to-br from-[#17111F] to-[#241b30] border-[#7C3AED]/30 text-white shadow-xl",
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

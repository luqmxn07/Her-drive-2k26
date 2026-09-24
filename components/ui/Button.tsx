"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "emergency" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED] min-h-[44px] min-w-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none";

    const variants = {
      primary:
        "bg-[#7C3AED] text-white hover:bg-[#6D28D9] hover:-translate-y-0.5 shadow-md hover:shadow-lg active:translate-y-0",
      secondary:
        "bg-transparent border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#EDE9FE] dark:hover:bg-[#7C3AED]/20 hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "bg-white/90 dark:bg-white/10 backdrop-blur-sm border border-[#211827]/15 dark:border-white/15 text-[#242124] dark:text-white hover:bg-[#EDE9FE]/50 dark:hover:bg-white/15 hover:border-[#7C3AED] hover:-translate-y-0.5",
      emergency:
        "bg-[#DC2626] text-white hover:bg-[#B91C1C] hover:-translate-y-0.5 shadow-md shadow-red-900/20 hover:shadow-red-900/40 active:translate-y-0",
      ghost:
        "bg-transparent text-[#242124] dark:text-white hover:bg-[#EDE9FE]/60 dark:hover:bg-white/10 hover:text-[#7C3AED]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base font-semibold",
      lg: "px-8 py-4 text-lg font-bold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

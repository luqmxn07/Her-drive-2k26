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
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F472B6] min-h-[44px] min-w-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#A855F7] via-[#9333EA] to-[#F472B6] hover:from-[#9333EA] hover:via-[#7C3AED] hover:to-[#EC4899] text-white hover:-translate-y-0.5 shadow-md shadow-[#A855F7]/25 hover:shadow-lg hover:shadow-[#F472B6]/30 active:translate-y-0",
      secondary:
        "bg-transparent border-2 border-[#A855F7] text-[#7C3AED] dark:text-[#F472B6] dark:border-[#F472B6] hover:bg-[#FDE7F3] dark:hover:bg-[#1E0B3D] hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "bg-white/90 dark:bg-[#1E0B3D]/80 backdrop-blur-sm border border-gray-200 dark:border-[#2D1B4E] text-[#242124] dark:text-[#FFFAFC] hover:bg-[#FDE7F3]/50 dark:hover:bg-[#2D1B4E] hover:border-[#F472B6] hover:-translate-y-0.5",
      emergency:
        "bg-[#E11D48] text-white hover:bg-[#BE123C] hover:-translate-y-0.5 shadow-md shadow-rose-900/20 hover:shadow-rose-900/40 active:translate-y-0",
      ghost:
        "bg-transparent text-[#242124] dark:text-[#FFFAFC] hover:bg-[#FDE7F3] dark:hover:bg-[#1E0B3D] hover:text-[#7C3AED] dark:hover:text-[#F472B6]",
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

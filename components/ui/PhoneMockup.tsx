"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: React.ReactNode;
  headerTitle?: string;
  theme?: "light" | "dark";
  className?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  headerTitle = "HERDRIVE",
  theme = "light",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[340px] sm:max-w-[380px] rounded-[44px] p-3.5 bg-[#17111F] shadow-2xl shadow-[#17111F]/30 ring-1 ring-white/20 select-none",
        className
      )}
    >
      {/* Outer bezel line */}
      <div className="relative rounded-[36px] overflow-hidden border border-white/10 bg-slate-950 flex flex-col h-[620px] sm:h-[660px]">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-1 ring-slate-700/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-950 border border-indigo-700/60" />
        </div>

        {/* Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-gray-400 z-20 shrink-0 bg-slate-950/80 backdrop-blur-md">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-gray-400 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Mini App Header */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-800/80 bg-slate-900/90 text-white z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="font-bold text-xs tracking-wider text-[#EDE9FE] uppercase">
              {headerTitle}
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#7C3AED]/20 text-[#EDE9FE] border border-[#7C3AED]/30">
            Conceptual UI
          </span>
        </div>

        {/* Phone Content Screen */}
        <div
          className={cn(
            "flex-1 overflow-y-auto relative flex flex-col custom-scrollbar",
            theme === "light" ? "bg-[#F8F7F5] text-[#171717]" : "bg-[#17111F] text-white"
          )}
        >
          {children}
        </div>

        {/* Phone Bottom Home Bar */}
        <div className="py-2 flex justify-center bg-slate-950 z-20 shrink-0">
          <div className="w-28 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

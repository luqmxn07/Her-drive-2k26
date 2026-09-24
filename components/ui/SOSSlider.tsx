"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOSSliderProps {
  className?: string;
}

export const SOSSlider: React.FC<SOSSliderProps> = ({ className }) => {
  const [sliderPosition, setSliderPosition] = useState(0); // 0 to 100
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderPosition(val);
    if (val >= 90) {
      setIsActivated(true);
      setSliderPosition(100);
    }
  };

  const handleReset = () => {
    setIsActivated(false);
    setSliderPosition(0);
    setCountdown(3);
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-4 bg-[#211827] text-white border border-[#DC2626]/40 shadow-xl",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#DC2626]/20 text-[#DC2626]">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency SOS System
            </h4>
            <p className="text-[11px] text-gray-400">
              Slide to trigger immediate response
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DC2626]/20 text-[#DC2626] font-semibold border border-[#DC2626]/40">
          #DC2626 STRICT
        </span>
      </div>

      {!isActivated ? (
        <div className="relative h-12 bg-red-950/60 rounded-xl border border-[#DC2626]/50 flex items-center px-2 overflow-hidden select-none">
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#DC2626]/40 transition-all duration-75"
            style={{ width: `${sliderPosition}%` }}
          />

          {/* Hint text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-bold tracking-wider text-red-200/80 uppercase flex items-center gap-1">
              SLIDE FOR EMERGENCY SOS <ArrowRight className="w-3.5 h-3.5 animate-bounce" />
            </span>
          </div>

          {/* Range Input overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            aria-label="Slide for Emergency SOS"
          />

          {/* Knob representation */}
          <div
            className="absolute top-1 bottom-1 w-10 bg-[#DC2626] rounded-lg shadow-lg flex items-center justify-center text-white transition-all duration-75 z-10 pointer-events-none"
            style={{ left: `calc(${sliderPosition}% * 0.85 + 4px)` }}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      ) : (
        <div className="p-3 bg-red-900/30 border border-[#DC2626] rounded-xl text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#DC2626] text-white animate-pulse">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-red-200 uppercase tracking-wide">
            SOS ALERT TRIGGERED
          </p>
          <p className="text-[11px] text-gray-300 leading-snug">
            Safety Operations Center & Emergency Contacts alerted with Live GPS.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-white underline cursor-pointer mt-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Demo
          </button>
        </div>
      )}
    </div>
  );
};

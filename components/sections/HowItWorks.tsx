"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Car,
  UserCheck,
  Lock,
  Navigation,
  ArrowRight,
} from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Choose Destination",
      detail: "Search your drop-off point safely with real-time route estimates.",
      icon: MapPin,
      snippet: "Koramangala 5th Block",
    },
    {
      number: 2,
      title: "Request Ride",
      detail: "Select your preferred ride category (Standard or Premium).",
      icon: Car,
      snippet: "HERDRIVE Standard",
    },
    {
      number: 3,
      title: "Match With Verified Driver",
      detail: "Algorithmic matching pairs you with a top-rated, background-checked driver.",
      icon: UserCheck,
      snippet: "Priya S. (5★)",
    },
    {
      number: 4,
      title: "Verify Ride PIN",
      detail: "The driver inputs your unique 4-digit PIN before the vehicle can start.",
      icon: Lock,
      snippet: "PIN: 4912",
    },
    {
      number: 5,
      title: "Track Journey & Arrive",
      detail: "Share your live trip with loved ones and enjoy continuous GPS monitoring.",
      icon: Navigation,
      snippet: "Live Route Active",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#FAF9F7] dark:bg-[#17111F] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#7C3AED] dark:text-[#EDE9FE] uppercase bg-[#EDE9FE] dark:bg-[#7C3AED]/20 px-3.5 py-1.5 rounded-full border border-[#7C3AED]/20">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#242124] dark:text-white font-manrope tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280] dark:text-gray-300">
            From destination search to final arrival, every step is engineered for safety, transparency, and ease.
          </p>
        </div>

        {/* Desktop Horizontal Timeline (Hidden on Mobile) */}
        <div className="hidden lg:block relative py-8">
          {/* Horizontal Connecting Line */}
          <div className="absolute top-1/2 left-12 right-12 h-1 bg-[#EDE9FE] dark:bg-white/10 -translate-y-6 z-0" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center space-y-4 group"
                >
                  {/* Step Number Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-[#211827] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:bg-[#7C3AED] group-hover:scale-105 transition-all duration-300 relative border-4 border-[#FAF9F7] dark:border-[#17111F]">
                    <IconComponent className="w-6 h-6 text-[#7C3AED] group-hover:text-white transition-colors" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center border-2 border-[#FAF9F7] dark:border-[#17111F]">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Title & Details */}
                  <div className="space-y-1.5 px-2">
                    <h3 className="font-bold text-base text-[#242124] dark:text-white font-manrope">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-gray-300 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>

                  {/* UI Snippet Tag */}
                  <div className="pt-2">
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#EDE9FE] dark:bg-[#7C3AED]/20 text-[#7C3AED] dark:text-[#EDE9FE] border border-[#7C3AED]/20 shadow-xs">
                      {step.snippet}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline (Visible on Mobile/Tablet) */}
        <div className="lg:hidden relative pl-6 space-y-8 py-4">
          {/* Vertical Line */}
          <div className="absolute top-4 bottom-4 left-[27px] w-1 bg-[#EDE9FE] dark:bg-white/10" />

          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Number Circle */}
                <div className="w-10 h-10 rounded-xl bg-[#211827] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md border-2 border-[#FAF9F7] dark:border-[#17111F] z-10">
                  <IconComponent className="w-5 h-5 text-[#7C3AED]" />
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-[#211827] p-5 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-xs flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7C3AED] dark:text-[#EDE9FE] uppercase">
                      Step {step.number}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EDE9FE] dark:bg-[#7C3AED]/20 text-[#7C3AED] dark:text-[#EDE9FE] font-semibold">
                      {step.snippet}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#242124] dark:text-white font-manrope">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-gray-300 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Radio,
  FileText,
  AlertTriangle,
  UserCheck,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { SOSSlider } from "@/components/ui/SOSSlider";
import { Badge } from "@/components/ui/Badge";

export const Safety: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const stages = [
    {
      stage: "BEFORE THE RIDE",
      title: "Prevention & Verification",
      icon: UserCheck,
      items: [
        "Verified driver identity & commercial documentation screening",
        "Vehicle registration and active safety standards compliance",
        "Mandatory 4-digit Ride PIN before entering the vehicle",
        "Pre-configured emergency contacts setup (up to 5 contacts)",
      ],
    },
    {
      stage: "DURING THE RIDE",
      title: "Continuous Monitoring & Response",
      icon: Radio,
      items: [
        "Continuous GPS route monitoring with live journey updates",
        "Automated route deviation detection and journey alerts",
        "One-tap auto-share live trip links with emergency contacts",
        "Slide-to-activate emergency SOS response trigger",
      ],
    },
    {
      stage: "AFTER THE RIDE",
      title: "Accountability & Review",
      icon: FileText,
      items: [
        "Mandatory mutual community ratings and feedback",
        "Confidential safety reporting channel for riders and drivers",
        "Dedicated safety review team for prompt inquiry resolution",
        "Strict zero-tolerance policy against misconduct",
      ],
    },
  ];

  return (
    <section id="safety" className="py-20 md:py-28 bg-[#0F0524] text-white relative overflow-hidden border-t border-[#2D1B4E]">
      {/* Background ambient glow in deep plum and pink highlights */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#F472B6]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#F472B6] uppercase bg-[#1E0B3D] px-3.5 py-1.5 rounded-full border border-[#2D1B4E]">
            Layered Protection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-manrope tracking-tight">
            Safety Is a System, Not a Single Feature.
          </h2>
          <p className="text-base sm:text-lg text-[#D1C4E9]">
            We don't rely on gimmicks or empty promises. HERDRIVE implements a rigorous 3-stage operational model active throughout the entire ride lifecycle.
          </p>
        </div>

        {/* 2-Column Grid: Left Accordions / Right Interactive Safety Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: 3 Stages Accordion / Stacked Cards */}
          <div className="lg:col-span-7 space-y-4">
            {stages.map((stageItem, index) => {
              const IconComponent = stageItem.icon;
              const isOpen = activeTab === index;
              return (
                <motion.div
                  key={stageItem.stage}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl border border-[#2D1B4E] bg-[#1E0B3D]/70 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#F472B6]/40"
                >
                  <button
                    onClick={() => setActiveTab(isOpen ? -1 : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#F472B6] rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#2D1B4E] text-[#F472B6] flex items-center justify-center font-bold shrink-0 border border-[#F472B6]/30">
                        <IconComponent className="w-6 h-6 text-[#F472B6]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#F472B6] uppercase tracking-wider block">
                          {stageItem.stage}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white font-manrope">
                          {stageItem.title}
                        </h3>
                      </div>
                    </div>

                    <div className="text-gray-400">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#F472B6]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#2D1B4E] space-y-3 animate-in fade-in duration-200">
                      {stageItem.items.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-[#D1C4E9]">
                          <CheckCircle2 className="w-4 h-4 text-[#F472B6] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Disclaimer Box */}
            <div className="p-4 rounded-xl bg-[#1E0B3D]/50 border border-[#2D1B4E] text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Operational & Safety Standards
              </p>
              <p>
                HERDRIVE is designed around multi-layered safety workflows and rigorous driver onboarding, structured in accordance with applicable transportation safety norms and local regulations.
              </p>
            </div>
          </div>

          {/* Right Column: Safety Operations Center UI Container */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 bg-[#1E0B3D] border border-[#2D1B4E] shadow-2xl space-y-6">
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-[#2D1B4E] pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#F472B6]" />
                  <span className="font-bold text-sm text-white font-manrope">
                    Safety Center UI Mockup
                  </span>
                </div>
                <Badge variant="plum">Interactive Preview</Badge>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0F0524] border border-[#2D1B4E] flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400">Route Status</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    On Route
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0F0524] border border-[#2D1B4E] flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400">Emergency Contacts</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-[#F472B6]" /> 2 Synced
                  </span>
                </div>
              </div>

              {/* Interactive Emergency SOS Slider (#E11D48) */}
              <SOSSlider />

              {/* Verified Features Box */}
              <div className="p-4 rounded-xl bg-[#2D1B4E]/60 border border-[#F472B6]/30 space-y-2">
                <span className="text-xs font-bold text-[#F472B6] uppercase tracking-wider block">
                  Safety System Features
                </span>
                <ul className="text-xs text-[#D1C4E9] space-y-1.5">
                  <li>• Mandatory 4-Digit Ride PIN before vehicle moves</li>
                  <li>• Real-time route deviation detection and alerts</li>
                  <li>• Instant emergency escalation and support line</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

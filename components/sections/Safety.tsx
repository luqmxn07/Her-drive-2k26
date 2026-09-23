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
  Lock,
  Star,
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
        "Government ID & Aadhaar/DL verification",
        "Vehicle registration (RC) & commercial insurance checks",
        "Mandatory 4-digit Ride PIN before boarding",
        "Pre-configured emergency contact setup (up to 5 contacts)",
      ],
    },
    {
      stage: "DURING THE RIDE",
      title: "Continuous Monitoring & Response",
      icon: Radio,
      items: [
        "Live GPS spatial tracking (sub-second telemetry)",
        "Automated route deviation alerts (500m threshold)",
        "Auto-share trip links with emergency contacts",
        "Slide-to-activate SOS emergency trigger (#DC2626)",
      ],
    },
    {
      stage: "AFTER THE RIDE",
      title: "Accountability & Review",
      icon: FileText,
      items: [
        "Mandatory mutual star ratings",
        "Confidential safety reporting channel",
        "Dedicated Safety Operations Center (SOC) review",
        "Zero-tolerance policy enforcement",
      ],
    },
  ];

  return (
    <section id="safety" className="py-20 md:py-28 bg-[#17111F] text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#DC2626]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#EDE9FE] uppercase bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            Layered Protection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-manrope tracking-tight">
            Safety Is a System, Not a Single Feature.
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            We don't rely on gimmicks or make unsupported claims. HERDRIVE implements a rigorous 3-stage operational model active throughout the entire ride lifecycle.
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
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveTab(isOpen ? -1 : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 text-[#EDE9FE] flex items-center justify-center font-bold shrink-0 border border-[#7C3AED]/30">
                        <IconComponent className="w-6 h-6 text-[#7C3AED]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider block">
                          {stageItem.stage}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white font-manrope">
                          {stageItem.title}
                        </h3>
                      </div>
                    </div>

                    <div className="text-gray-400">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#7C3AED]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                      {stageItem.items.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-gray-200">
                          <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Disclaimer Box */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Drafting & Legal Standard Notice
              </p>
              <p>
                HERDRIVE plans to support participating drivers with appropriate safety equipment and responsible-use training, subject to applicable local laws and regulations. Safety is presented strictly as a layered operational system.
              </p>
            </div>
          </div>

          {/* Right Column: Safety Operations Center UI Container */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 bg-slate-900 border border-white/15 shadow-2xl space-y-6">
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#7C3AED]" />
                  <span className="font-bold text-sm text-white font-manrope">
                    Safety Center UI Mockup
                  </span>
                </div>
                <Badge variant="plum">Live Demo</Badge>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/60 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400">Route Status</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    On Route
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/60 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400">Emergency Contacts</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-[#7C3AED]" /> 2 Synced
                  </span>
                </div>
              </div>

              {/* Interactive Emergency SOS Slider (#DC2626) */}
              <SOSSlider />

              {/* Verified Features Box */}
              <div className="p-4 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/30 space-y-2">
                <span className="text-xs font-bold text-[#EDE9FE] uppercase tracking-wider block">
                  Safety System Features
                </span>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>• Automatic 4-Digit Ride PIN check before vehicle moves</li>
                  <li>• Sub-second spatial telemetry connected to NestJS backend</li>
                  <li>• Direct hotline to 24/7 Safety Operations Center (SOC)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

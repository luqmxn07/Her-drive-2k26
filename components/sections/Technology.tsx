"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Server,
  ShieldCheck,
  Zap,
  Radio,
  Lock,
  CreditCard,
  HeartHandshake,
  ArrowDown,
} from "lucide-react";

export const Technology: React.FC = () => {
  const platformFeatures = [
    {
      id: "verification",
      title: "Identity & Document Verification",
      desc: "Aadhaar, PAN & government database checks for complete trust",
      icon: ShieldCheck,
    },
    {
      id: "matching",
      title: "Algorithmic Ride Matching",
      desc: "H3 spatial indexing pairs optimal drivers in seconds",
      icon: Zap,
    },
    {
      id: "gps",
      title: "Live Sub-Second GPS Tracking",
      desc: "Continuous spatial telemetry and polyline route monitoring",
      icon: Radio,
    },
    {
      id: "sos",
      title: "Layered Safety & SOS System",
      desc: "Instant escalation matrix to Safety Operations Center (SOC)",
      icon: Lock,
    },
    {
      id: "payments",
      title: "Encrypted Digital Payments",
      desc: "Automated cashless transactions via PCI-DSS compliant gateways",
      icon: CreditCard,
    },
  ];

  return (
    <section id="technology" className="py-20 md:py-28 bg-[#17111F] text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#7C3AED]/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#EDE9FE] uppercase bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            Technology Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-manrope tracking-tight">
            Engineered for Safety & Trust.
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            Technology connects every part of the journey — from verified onboarding and ride matching to live tracking, payments, and safety response.
          </p>
        </div>

        {/* Conceptual Visual Flow Architecture Diagram */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Level: Passenger App & Driver App Client Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-5 rounded-2xl bg-white/5 border border-[#7C3AED]/30 flex items-center gap-4 shadow-lg backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 text-[#EDE9FE] flex items-center justify-center font-bold border border-[#7C3AED]/40 shrink-0">
                <Smartphone className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-manrope">Passenger Application</h3>
                <p className="text-xs text-gray-400">Live booking, Ride PIN, live map & SOS</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-[#7C3AED]/30 flex items-center gap-4 shadow-lg backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 text-[#EDE9FE] flex items-center justify-center font-bold border border-[#7C3AED]/40 shrink-0">
                <Smartphone className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-manrope">Driver Application</h3>
                <p className="text-xs text-gray-400">Dispatch, turn-by-turn navigation & earnings</p>
              </div>
            </motion.div>
          </div>

          {/* Downward Connector Line */}
          <div className="flex justify-center my-2">
            <div className="w-10 h-10 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#EDE9FE] animate-bounce">
              <ArrowDown className="w-5 h-5 text-[#7C3AED]" />
            </div>
          </div>

          {/* Core Level: HERDRIVE Platform Engine Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-[#17111F] border-2 border-[#7C3AED]/50 shadow-2xl space-y-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#7C3AED] text-white">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-white font-manrope">
                    HERDRIVE PLATFORM
                  </h3>
                  <span className="text-xs text-[#EDE9FE]">
                    Real-time Spatial & Safety Orchestration Engine
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#7C3AED]/20 text-[#EDE9FE] border border-[#7C3AED]/30">
                Sub-Second Telemetry
              </span>
            </div>

            {/* Platform Modules List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {platformFeatures.map((feat) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={feat.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#7C3AED]/50 transition-colors space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-[#7C3AED]" />
                      <h4 className="font-bold text-xs text-white">{feat.title}</h4>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Downward Connector Line */}
          <div className="flex justify-center my-2">
            <div className="w-10 h-10 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#EDE9FE]">
              <ArrowDown className="w-5 h-5 text-[#7C3AED]" />
            </div>
          </div>

          {/* Bottom Level: Trust & Support Resolution */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-[#EDE9FE]/10 border border-[#7C3AED]/40 text-center space-y-2 backdrop-blur-md"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#7C3AED] text-white mb-1 shadow-lg">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white font-manrope">
              TRUST, SAFETY & COMMUNITY SUPPORT
            </h3>
            <p className="text-xs text-gray-300 max-w-xl mx-auto">
              Delivering verified participation, 24/7 Safety Operations Center (SOC) oversight, and rapid emergency resolution.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

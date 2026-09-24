"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Route, TrendingUp, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const Solution: React.FC = () => {
  const pillars = [
    {
      id: "safety-first",
      title: "Safety First",
      subtitle: "Verified Ecosystem",
      description:
        "Rigorous background checks, identity screening, Ride PIN verification, live GPS monitoring, and instant SOS escalation.",
      icon: ShieldCheck,
      bullets: [
        "4-digit mandatory Ride PIN",
        "Continuous route polyline tracking",
        "Instant hardware/software SOS",
      ],
    },
    {
      id: "comfort-privacy",
      title: "Comfort & Privacy",
      subtitle: "Women-Driver Options",
      description:
        "Providing women passengers with the choice of traveling with verified women drivers in a quiet, respectful environment.",
      icon: HeartHandshake,
      bullets: [
        "Verified women driver matching",
        "Number masking technology",
        "Preference settings (Quiet Ride)",
      ],
    },
    {
      id: "reliable-mobility",
      title: "Reliable Mobility",
      subtitle: "Predictable Journeys",
      description:
        "A tech-driven ride experience designed for transparent fares, exact ETAs, and high-trust dispatching.",
      icon: Route,
      bullets: [
        "Upfront pricing with zero hidden fees",
        "High-precision spatial matching",
        "24/7 Safety Operations Support",
      ],
    },
    {
      id: "women-empowerment",
      title: "Women Empowerment",
      subtitle: "Economic Growth",
      description:
        "Flexible earning opportunities for female drivers with transparent payouts, training, and equipment support.",
      icon: TrendingUp,
      bullets: [
        "Transparent earnings dashboard",
        "Flexible working hours",
        "Dedicated driver safety gear",
      ],
    },
  ];

  return (
    <section id="solution" className="py-20 md:py-28 bg-gradient-to-b from-[#FFF5F9]/70 via-[#FAF9F7] to-[#FAF9F7] dark:from-[#1E0B3D]/70 dark:via-[#190A2E] dark:to-[#0F0524] relative overflow-hidden transition-colors duration-300">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#F472B6]/15 to-[#A855F7]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#A855F7] dark:text-[#F472B6] uppercase bg-[#FDE7F3] dark:bg-[#1E0B3D] px-3.5 py-1.5 rounded-full border border-[#F472B6]/25 shadow-xs">
            Our Approach
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#242124] dark:text-white font-manrope tracking-tight">
            Built Around What Matters.
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280] dark:text-gray-300">
            HERDRIVE replaces traditional ride-hailing uncertainty with a holistic four-pillar framework designed specifically for women.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card
                  variant="white"
                  className="h-full border-gray-200/80 dark:border-[#2D1B4E] hover:border-[#F472B6]/60 hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#F472B6] text-white flex items-center justify-center font-bold shadow-md">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-[#A855F7] dark:text-[#F472B6] bg-[#FDE7F3] dark:bg-[#2D1B4E] px-3 py-1 rounded-full border border-[#F472B6]/20">
                        {pillar.subtitle}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-[#242124] dark:text-white font-manrope">
                        {pillar.title}
                      </h3>
                      <p className="text-base text-[#6B7280] dark:text-gray-300 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Bullet Highlights */}
                    <div className="pt-2 space-y-2.5">
                      {pillar.bullets.map((bullet, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#242124] dark:text-gray-200">
                          <div className="w-4 h-4 rounded-full bg-[#FDE7F3] dark:bg-[#2D1B4E] text-[#A855F7] dark:text-[#F472B6] flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

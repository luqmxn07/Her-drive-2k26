"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Heart, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const Community: React.FC = () => {
  const values = [
    {
      title: "Mutual Respect",
      desc: "Creating a dignified, courteous environment for passengers and drivers alike.",
      icon: Heart,
    },
    {
      title: "Verified Accountability",
      desc: "Zero tolerance for harassment with clear, transparent feedback loops.",
      icon: Shield,
    },
    {
      title: "Shared Confidence",
      desc: "Empowering women to commute freely at any hour of the day or night.",
      icon: Sparkles,
    },
    {
      title: "Economic Empowerment",
      desc: "Supporting female driver partners with fair compensation and growth tools.",
      icon: Users,
    },
  ];

  return (
    <section id="community" className="py-20 md:py-28 bg-[#F8F7F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase bg-[#EDE9FE] px-3.5 py-1.5 rounded-full border border-[#7C3AED]/20">
            Community & Values
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] font-manrope tracking-tight">
            Built for a Community That Moves Together.
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280]">
            We prioritize respect, accountability, and verified participation to ensure a supportive environment for everyone.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card variant="white" className="h-full space-y-4 border-gray-200/80">
                  <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-[#171717] font-manrope">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {val.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

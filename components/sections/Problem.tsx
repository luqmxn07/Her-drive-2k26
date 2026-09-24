"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, FileCheck2, Eye, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const Problem: React.FC = () => {
  const problems = [
    {
      id: "safety",
      category: "SAFETY",
      question: "Who is driving?",
      description:
        "Standard ride-hailing services often lack specialized verification for late-night travel, leading to safety anxiety for women commuters.",
      icon: ShieldAlert,
      tag: "Uncertainty",
    },
    {
      id: "trust",
      category: "TRUST",
      question: "Can I verify my trip?",
      description:
        "Passengers rarely have foolproof ways to confirm driver identities or vehicle legitimacy before boarding.",
      icon: FileCheck2,
      tag: "Verification Gap",
    },
    {
      id: "control",
      category: "CONTROL",
      question: "Can someone I trust monitor my journey?",
      description:
        "Traditional apps offer limited real-time monitoring tools for families or emergency contacts during solo travel.",
      icon: Eye,
      tag: "Lack of Oversight",
    },
    {
      id: "opportunity",
      category: "OPPORTUNITY",
      question: "Can mobility create flexible earning opportunities?",
      description:
        "Women drivers face unsafe work conditions and rigid schedules, limiting their participation in the gig economy.",
      icon: Briefcase,
      tag: "Economic Barrier",
    },
  ];

  return (
    <section id="problem" className="py-20 md:py-28 bg-[#FAF9F7] dark:bg-[#17111F] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#7C3AED] dark:text-[#EDE9FE] uppercase bg-[#EDE9FE] dark:bg-[#7C3AED]/20 px-3.5 py-1.5 rounded-full border border-[#7C3AED]/20">
            The Mobility Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#242124] dark:text-white font-manrope tracking-tight leading-tight">
            Mobility Is More Than Getting From Point A to Point B.
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280] dark:text-gray-300">
            Every trip should give passengers and drivers complete peace of mind. HERDRIVE solves four foundational issues in everyday transit.
          </p>
        </div>

        {/* 4-Card Problem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  variant="white"
                  className="h-full flex flex-col justify-between hover:border-[#7C3AED]/40 hover:-translate-y-1 transition-all duration-300 border-gray-200/90 dark:border-white/10"
                >
                  <div className="space-y-4">
                    {/* Top Icon & Tag */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] dark:bg-[#7C3AED]/20 text-[#7C3AED] dark:text-[#EDE9FE] flex items-center justify-center font-bold shadow-xs">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-[#7C3AED] dark:text-[#EDE9FE] bg-[#EDE9FE]/60 dark:bg-[#7C3AED]/10 px-2.5 py-1 rounded-md border border-[#7C3AED]/15">
                        {item.tag}
                      </span>
                    </div>

                    {/* Category Label */}
                    <span className="text-xs font-extrabold tracking-wider text-[#7C3AED] dark:text-[#EDE9FE] uppercase block">
                      {item.category}
                    </span>

                    {/* Problem Question */}
                    <h3 className="text-lg font-bold text-[#242124] dark:text-white font-manrope leading-snug">
                      "{item.question}"
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#6B7280] dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-white/10 mt-6">
                    <span className="text-xs font-semibold text-[#211827] dark:text-gray-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                      HERDRIVE Solution below
                    </span>
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

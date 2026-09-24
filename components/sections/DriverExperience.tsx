"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  Check,
  X,
} from "lucide-react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const DriverExperience: React.FC = () => {
  const driverBenefits = [
    "Flexible working hours — drive whenever you choose",
    "Transparent commission structure with instant digital payouts",
    "Enhanced security with verified female passengers & Ride PINs",
    "Dedicated driver safety equipment & responsible-use training",
    "24/7 direct safety support line & emergency assistance",
    "Comprehensive onboarding, vehicle assistance, & career support",
  ];

  return (
    <section id="drivers" className="py-20 md:py-28 bg-[#FFF5F9]/60 dark:bg-[#190A2E] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Driver Dashboard UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 order-2 lg:order-1 relative"
          >
            <PhoneMockup headerTitle="HERDRIVE Partner" theme="dark">
              {/* Driver App Internal View */}
              <div className="p-4 space-y-4 text-white bg-[#0F0524]">
                {/* Online Status Toggle Bar */}
                <div className="p-3 rounded-2xl bg-[#1E0B3D] border border-[#2D1B4E] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-sm text-emerald-400 tracking-wide uppercase">
                      YOU ARE ONLINE
                    </span>
                  </div>
                  <Badge variant="plum">Active Shift</Badge>
                </div>

                {/* Earnings Summary Card with Brand Gradient */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6B46C1] to-[#F472B6] border border-white/20 shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#FFFAFC]">
                    <span>Today's Net Earnings</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold font-manrope tracking-tight text-white">
                    ₹1,240.00
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-200 block">Completed Rides</span>
                      <span className="font-bold text-white">6 Trips</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-200 block">Online Hours</span>
                      <span className="font-bold text-white">4.5 Hrs</span>
                    </div>
                  </div>
                </div>

                {/* New Ride Request Dispatch Card */}
                <div className="p-4 rounded-2xl bg-[#1E0B3D] border-2 border-[#F472B6] shadow-2xl space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F472B6] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#F472B6] animate-pulse" />
                      NEW RIDE REQUEST (12s)
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Est. Earn: ₹180
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Pickup: Koramangala 6th Block (2.1 km away)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#F472B6] shrink-0" />
                      <span>Passenger: Verified Female Rider</span>
                    </div>
                  </div>

                  {/* Accept / Decline Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button className="py-2.5 px-3 rounded-xl bg-white/10 text-gray-300 font-semibold text-xs border border-white/15 hover:bg-white/20 flex items-center justify-center gap-1 cursor-pointer">
                      <X className="w-4 h-4 text-rose-400" /> Decline
                    </button>
                    <button className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#F472B6] text-white font-bold text-xs shadow-md hover:from-[#9333EA] hover:to-[#EC4899] flex items-center justify-center gap-1 cursor-pointer">
                      <Check className="w-4 h-4" /> Accept Ride
                    </button>
                  </div>
                </div>

                {/* Driver Safety Tools Pill */}
                <div className="p-3 rounded-xl bg-[#1E0B3D] border border-[#2D1B4E] flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F472B6]" />
                    Driver Safety Toolkit
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            </PhoneMockup>
          </motion.div>

          {/* Right Column: Text Content & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left"
          >
            <span className="text-xs font-bold tracking-widest text-[#A855F7] dark:text-[#F472B6] uppercase bg-[#FDE7F3] dark:bg-[#1E0B3D] px-3.5 py-1.5 rounded-full border border-[#F472B6]/25 shadow-xs">
              Driver Opportunity
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#242124] dark:text-white font-manrope tracking-tight leading-tight">
              More Than a Ride. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#F472B6]">
                An Earning Opportunity.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#6B7280] dark:text-gray-300 leading-relaxed">
              Join a supportive network of female drivers building financial independence. Drive safely on your own schedule with transparent earnings and dedicated safety tools.
            </p>

            {/* Benefits List */}
            <div className="space-y-3 pt-2">
              {driverBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-[#242124] dark:text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#F472B6] shrink-0 mt-0.5" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a href="#waitlist">
                <Button size="lg" variant="primary" className="gap-2 shadow-lg shadow-[#A855F7]/25">
                  Become a HERDRIVE Driver
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

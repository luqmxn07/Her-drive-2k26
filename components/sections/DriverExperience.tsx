"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  DollarSign,
  Clock,
  ShieldCheck,
  Award,
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
    "24/7 direct access to Safety Operations Center (SOC)",
    "Comprehensive onboarding, vehicle assistance, & career support",
  ];

  return (
    <section id="drivers" className="py-20 md:py-28 bg-[#EDE9FE]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Driver Dashboard UI Mockup (Left aligned per wireframe) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 order-2 lg:order-1 relative"
          >
            <PhoneMockup headerTitle="HERDRIVE Partner" theme="dark">
              {/* Driver App Internal View */}
              <div className="p-4 space-y-4 text-white">
                {/* Online Status Toggle Bar */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-sm text-emerald-400 tracking-wide uppercase">
                      YOU ARE ONLINE
                    </span>
                  </div>
                  <Badge variant="plum">Active Shift</Badge>
                </div>

                {/* Earnings Summary Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] border border-white/20 shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#EDE9FE]">
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
                <div className="p-4 rounded-2xl bg-slate-900 border-2 border-[#7C3AED] shadow-2xl space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
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
                      <ShieldCheck className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      <span>Passenger: Verified Female Rider</span>
                    </div>
                  </div>

                  {/* Accept / Decline Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button className="py-2.5 px-3 rounded-xl bg-slate-800 text-gray-300 font-semibold text-xs border border-slate-700 hover:bg-slate-700 flex items-center justify-center gap-1">
                      <X className="w-4 h-4 text-rose-400" /> Decline
                    </button>
                    <button className="py-2.5 px-3 rounded-xl bg-[#7C3AED] text-white font-bold text-xs shadow-md hover:bg-[#6D28D9] flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> Accept Ride
                    </button>
                  </div>
                </div>

                {/* Driver Safety Tools Pill */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
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
            <span className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase bg-white px-3.5 py-1.5 rounded-full border border-[#7C3AED]/20 shadow-sm">
              Driver Opportunity
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] font-manrope tracking-tight leading-tight">
              More Than a Ride. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]">
                An Earning Opportunity.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
              Join a supportive network of female drivers building financial independence. Drive safely on your own schedule with transparent earnings and dedicated safety tools.
            </p>

            {/* Benefits List */}
            <div className="space-y-3 pt-2">
              {driverBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-[#171717]">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a href="#waitlist">
                <Button size="lg" variant="primary" className="gap-2 shadow-lg shadow-[#7C3AED]/25">
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

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Car,
  Star,
  Lock,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PhoneMockup } from "@/components/ui/PhoneMockup";

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative pt-28 sm:pt-36 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#EDE9FE]/40 via-[#F8F7F5] to-[#F8F7F5]"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C3AED]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            {/* Top Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#7C3AED]/20 shadow-sm text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>Next-Gen Women Mobility Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              <span className="text-[#17111F]">Launching Soon</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#171717] tracking-tight font-manrope leading-[1.15]">
              Move Freely. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]">
                Ride Confidently.
              </span>
            </h1>

            {/* Subhead / Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              A women-focused mobility platform built around safety, comfort, trust, and opportunity.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a href="#waitlist" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" fullWidth className="gap-2 shadow-lg shadow-[#7C3AED]/25">
                  Join the Waitlist
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>

              <a href="#drivers" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" fullWidth className="gap-2">
                  Become a Driver
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
                Launching soon
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
                Technology-enabled safety
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
                Verified women drivers
              </span>
            </div>
          </motion.div>

          {/* Right Column: Hero Conceptual Phone UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Phone Mockup Frame */}
            <PhoneMockup headerTitle="HERDRIVE Ride">
              {/* Map View Canvas (Conceptual SVG Map) */}
              <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
                {/* Simulated Map Grid / Roads SVG */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-35"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7C3AED" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Route Polyline */}
                  <path
                    d="M 50 200 Q 120 120 220 140 T 320 60"
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="4"
                    strokeDasharray="6 4"
                  />
                </svg>

                {/* Live Status Floating Shield */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <Badge variant="plum" icon={<ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />}>
                    Safety System Active
                  </Badge>
                  <Badge variant="violet" icon={<Lock className="w-3.5 h-3.5" />}>
                    PIN: 4912
                  </Badge>
                </div>

                {/* Pickup & Destination Pins */}
                <div className="absolute top-12 left-10 flex items-center gap-1.5 bg-slate-950/90 text-white text-[11px] px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Koramangala 5th Block</span>
                </div>

                <div className="absolute bottom-16 right-8 flex items-center gap-1.5 bg-[#7C3AED] text-white text-[11px] px-2.5 py-1 rounded-full border border-white/20 shadow-lg">
                  <Navigation className="w-3.5 h-3.5 text-white" />
                  <span>Indiranagar Metro</span>
                </div>

                {/* Moving Driver Vehicle Pin */}
                <div className="absolute top-28 left-40 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-[#17111F] border-2 border-[#7C3AED] shadow-xl text-white animate-pulse">
                  <Car className="w-4 h-4 text-[#7C3AED]" />
                </div>
              </div>

              {/* Driver & Ride Details Bottom Drawer */}
              <div className="p-4 bg-white text-[#171717] space-y-3.5 border-t border-gray-100 flex-1">
                {/* Verified Driver Info Card */}
                <div className="p-3 rounded-2xl bg-[#EDE9FE]/50 border border-[#7C3AED]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-[#17111F] text-white flex items-center justify-center font-bold text-sm border-2 border-[#7C3AED]">
                        PS
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white">
                        ✓
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#17111F]">Priya S.</h4>
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 5.0
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7280]">
                        Verified Driver • KA 01 EQ 8829
                      </p>
                    </div>
                  </div>

                  <button className="p-2 rounded-xl bg-white border border-[#7C3AED]/30 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-colors">
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </div>

                {/* Trip Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] text-[#6B7280] block">ETA</span>
                    <span className="font-bold text-[#17111F]">3 mins</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] text-[#6B7280] block">Safety Check</span>
                    <span className="font-bold text-emerald-600">Verified</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] text-[#6B7280] block">Ride PIN</span>
                    <span className="font-mono font-bold text-[#7C3AED]">4912</span>
                  </div>
                </div>

                {/* Live Trip Share indicator */}
                <div className="px-3 py-2 rounded-xl bg-[#17111F] text-white flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Auto-Share Trip: Mom & Roommate
                  </span>
                  <span className="text-[10px] text-[#EDE9FE] underline">ON</span>
                </div>
              </div>
            </PhoneMockup>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

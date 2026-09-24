"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Search,
  MapPin,
  CreditCard,
  Share2,
  Lock,
  Car,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const PassengerExperience: React.FC = () => {
  const benefits = [
    "Verified women drivers with rigorous identity checks",
    "Continuous GPS route monitoring & journey sharing",
    "Mandatory 4-digit Ride PIN before entering vehicle",
    "One-tap auto-share live trip with emergency contacts",
    "Integrated emergency SOS response system",
    "Cashless digital payments via UPI, cards, & wallets",
  ];

  return (
    <section id="passenger" className="py-20 md:py-28 bg-[#FAF9F7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <span className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase bg-[#EDE9FE] px-3.5 py-1.5 rounded-full border border-[#7C3AED]/20">
              Passenger App Experience
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#242124] font-manrope tracking-tight leading-tight">
              Designed Around the Passenger.
            </h2>

            <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
              Experience reliable, stress-free transit with verified women drivers, upfront pricing, Ride PIN verification, and integrated emergency support at your fingertips.
            </p>

            {/* Checkmark List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#242124]">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <a href="#waitlist">
                <Button size="md" variant="primary" className="gap-2 shadow-md shadow-[#7C3AED]/20">
                  Get Priority Passenger Access
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Passenger App Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <PhoneMockup headerTitle="HERDRIVE App">
              {/* App Internal Body */}
              <div className="p-4 space-y-4">
                {/* User Greeting Bar */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#6B7280]">Good evening,</span>
                    <h4 className="text-base font-bold text-[#211827] font-manrope">Sara Sharma</h4>
                  </div>
                  <Badge variant="lavender" icon={<ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />}>
                    Verified User
                  </Badge>
                </div>

                {/* Where to Search Bar */}
                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#EDE9FE] text-[#7C3AED]">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-[#6B7280] block uppercase font-bold">
                      Destination
                    </span>
                    <span className="text-xs font-bold text-[#242124]">
                      Where to? (Search drop-off safely)
                    </span>
                  </div>
                </div>

                {/* Map Polyline Snippet Box */}
                <div className="h-28 rounded-2xl bg-[#211827] relative overflow-hidden flex items-center justify-center p-3 border border-gray-200">
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#7C3AED_1px,transparent_1px)] [background-size:12px_12px]" />
                  <div className="relative z-10 w-full flex items-center justify-between bg-black/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 text-white text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#7C3AED]" />
                      <span className="font-semibold text-[11px]">Koramangala → Indiranagar</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      14 mins • 4.8 km
                    </span>
                  </div>
                </div>

                {/* Ride Options Selection */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
                    Available Ride Options
                  </span>

                  {/* Standard Option */}
                  <div className="p-3 rounded-2xl bg-white border-2 border-[#7C3AED] shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#EDE9FE] text-[#7C3AED]">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#242124]">HERDRIVE Standard</span>
                          <span className="text-[9px] bg-[#7C3AED] text-white px-1.5 py-0.2 rounded font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B7280]">Verified woman driver • 3 mins away</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#211827]">₹240</span>
                  </div>

                  {/* Premium Option */}
                  <div className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gray-100 text-gray-600">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#242124] block">HERDRIVE Premium</span>
                        <span className="text-[10px] text-[#6B7280]">Spacious EV sedan • 5 mins away</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#211827]">₹310</span>
                  </div>
                </div>

                {/* Payment Method & PIN Security Preview */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-[11px] font-medium text-[#242124]">UPI / Cashless</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-[11px] font-medium text-[#242124]">PIN Boarding</span>
                  </div>
                </div>

                {/* Request Ride CTA Button */}
                <Button fullWidth size="md" variant="primary" className="gap-2 shadow-md">
                  Request HERDRIVE Ride
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </PhoneMockup>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

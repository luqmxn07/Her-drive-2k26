"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RoleInterest, WaitlistFormData } from "@/types";

export const Waitlist: React.FC = () => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    name: "",
    email: "",
    phone: "",
    role: "passenger",
    consent: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errs.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!formData.consent) {
      errs.consent = "You must consent to data processing to join the waitlist.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate serverless endpoint request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <section id="waitlist" className="py-20 md:py-28 bg-[#EDE9FE] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#FAF9F7] rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#7C3AED]/20 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-bold uppercase tracking-wider border border-[#7C3AED]/20">
              <Sparkles className="w-3.5 h-3.5" /> Early Access Priority
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#242124] font-manrope tracking-tight">
              Be Part of the Next Generation of Safer Mobility.
            </h2>

            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
              HERDRIVE is being built for women who want to move, work, and earn with greater confidence. Join our priority waitlist today.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto" noValidate>
              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="waitlist-name" className="text-xs font-bold text-[#242124] uppercase tracking-wider block">
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="waitlist-name"
                  type="text"
                  placeholder="e.g. Ananya Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-[#DC2626] ring-1 ring-[#DC2626]" : "border-gray-300 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                  } bg-white text-[#242124] placeholder-gray-400 text-sm outline-none transition-all`}
                />
                {errors.name && (
                  <p className="text-xs text-[#DC2626] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="waitlist-email" className="text-xs font-bold text-[#242124] uppercase tracking-wider block">
                    Email Address <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? "border-[#DC2626] ring-1 ring-[#DC2626]" : "border-gray-300 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                    } bg-white text-[#242124] placeholder-gray-400 text-sm outline-none transition-all`}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#DC2626] font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="waitlist-phone" className="text-xs font-bold text-[#242124] uppercase tracking-wider block">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="waitlist-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 bg-white text-[#242124] placeholder-gray-400 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Role Selection Radio Pill Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#242124] uppercase tracking-wider block">
                  I am interested as:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {(["passenger", "driver", "both"] as RoleInterest[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                        formData.role === r
                          ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-md"
                          : "bg-white text-[#242124] border-gray-200 hover:bg-[#EDE9FE]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* DPDP Consent Checkbox */}
              <div className="space-y-1.5 pt-1">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-[#6B7280] select-none">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#7C3AED] focus:ring-[#7C3AED] border-gray-300 cursor-pointer"
                  />
                  <span>
                    I consent to the processing of my personal data for early access updates in accordance with India's DPDP Act requirements.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs text-[#DC2626] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  variant="primary"
                  fullWidth
                  className="gap-2 shadow-lg shadow-[#7C3AED]/25"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Join the Waitlist"
                  )}
                </Button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" /> Your information is kept strictly private. Zero spam.
                </span>
              </div>
            </form>
          ) : (
            /* Success Replacement Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4 max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#242124] font-manrope">
                Thank You for Joining!
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                You've been added to the priority HERDRIVE waitlist as a{" "}
                <span className="font-bold text-[#7C3AED] capitalize">{formData.role}</span>. We will contact you at <span className="font-semibold text-[#242124]">{formData.email}</span> as soon as early access opens in your city.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", role: "passenger", consent: false });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Submit Another Response
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

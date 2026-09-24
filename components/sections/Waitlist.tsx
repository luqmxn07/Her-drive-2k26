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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/waitlist` : "/api/waitlist";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setErrors({
          email: data.error || "Unable to register on the waitlist. Please try again.",
        });
      }
    } catch (err: any) {
      console.error("Waitlist submission network error:", err);
      // Fallback to relative /api/waitlist in case of CORS or endpoint misconfiguration
      try {
        const fallbackRes = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && fallbackData.success) {
          setIsSubmitted(true);
          return;
        }
      } catch (_) {}

      setErrors({
        email: "Unable to reach registration server. Please check your network and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-20 md:py-28 bg-gradient-to-b from-[#FFF5F9] via-[#FDE7F3]/70 to-[#FFF5F9] dark:from-[#1E0B3D] dark:via-[#190A2E] dark:to-[#0F0524] relative transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#FFFAFC] dark:bg-[#1E0B3D] rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#F472B6]/25 dark:border-[#2D1B4E] relative overflow-hidden transition-colors duration-300"
        >
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDE7F3] dark:bg-[#2D1B4E] text-[#A855F7] dark:text-[#F472B6] text-xs font-bold uppercase tracking-wider border border-[#F472B6]/25">
              <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" /> Early Access Priority
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#242124] dark:text-white font-manrope tracking-tight">
              Be Part of the Next Generation of Safer Mobility.
            </h2>

            <p className="text-sm sm:text-base text-[#6B7280] dark:text-gray-300 leading-relaxed">
              HERDRIVE is being built for women who want to move, work, and earn with greater confidence. Join our priority waitlist today.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto" noValidate>
              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="waitlist-name" className="text-xs font-bold text-[#242124] dark:text-gray-200 uppercase tracking-wider block">
                  Full Name <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="waitlist-name"
                  type="text"
                  placeholder="e.g. Ananya Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-[#E11D48] ring-1 ring-[#E11D48]" : "border-gray-300 dark:border-[#2D1B4E] focus:border-[#F472B6] focus:ring-2 focus:ring-[#F472B6]/20"
                  } bg-white dark:bg-[#0F0524] text-[#242124] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none transition-all`}
                />
                {errors.name && (
                  <p className="text-xs text-[#E11D48] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="waitlist-email" className="text-xs font-bold text-[#242124] dark:text-gray-200 uppercase tracking-wider block">
                    Email Address <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? "border-[#E11D48] ring-1 ring-[#E11D48]" : "border-gray-300 dark:border-[#2D1B4E] focus:border-[#F472B6] focus:ring-2 focus:ring-[#F472B6]/20"
                    } bg-white dark:bg-[#0F0524] text-[#242124] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none transition-all`}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#E11D48] font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="waitlist-phone" className="text-xs font-bold text-[#242124] dark:text-gray-200 uppercase tracking-wider block">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="waitlist-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#2D1B4E] focus:border-[#F472B6] focus:ring-2 focus:ring-[#F472B6]/20 bg-white dark:bg-[#0F0524] text-[#242124] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Role Selection Radio Pill Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#242124] dark:text-gray-200 uppercase tracking-wider block">
                  I am interested as:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {(["passenger", "driver", "both"] as RoleInterest[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                        formData.role === r
                          ? "bg-gradient-to-r from-[#A855F7] to-[#F472B6] text-white border-transparent shadow-md"
                          : "bg-white dark:bg-[#0F0524] text-[#242124] dark:text-gray-200 border-gray-200 dark:border-[#2D1B4E] hover:bg-[#FDE7F3] dark:hover:bg-[#2D1B4E]"
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
                    className="mt-0.5 w-4 h-4 rounded text-[#F472B6] focus:ring-[#F472B6] border-gray-300 cursor-pointer accent-[#F472B6]"
                  />
                  <span>
                    I consent to the processing of my personal data for early access updates in accordance with India's DPDP Act requirements.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs text-[#E11D48] font-medium flex items-center gap-1">
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
                  className="gap-2 shadow-lg shadow-[#A855F7]/25"
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
              <h3 className="text-2xl font-bold text-[#242124] dark:text-white font-manrope">
                Thank You for Joining!
              </h3>
              <p className="text-sm text-[#6B7280] dark:text-gray-300 leading-relaxed">
                You've been added to the priority HERDRIVE waitlist as a{" "}
                <span className="font-bold text-[#A855F7] dark:text-[#F472B6] capitalize">{formData.role}</span>. We will contact you at <span className="font-semibold text-[#242124] dark:text-white">{formData.email}</span> as soon as early access opens in your city.
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

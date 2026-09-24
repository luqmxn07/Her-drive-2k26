"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-[#211827] dark:bg-[#17111F] text-white pt-16 pb-12 border-t border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info with Official App Icon */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="#hero" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-1 ring-[#7C3AED]/40 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Image
                  src={theme === "dark" ? "/brand/herdrive icon dark.png" : "/brand/herdrive icon light.png"}
                  alt="HERDRIVE Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-manrope">
                HERDRIVE
              </span>
            </Link>

            <p className="text-sm font-semibold text-[#EDE9FE] font-manrope">
              Move Freely. Ride Confidently.
            </p>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              A women-focused mobility platform built around safety, comfort, trust, and flexible economic opportunity.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#7C3AED] hover:border-[#7C3AED] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#7C3AED] hover:border-[#7C3AED] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#7C3AED] hover:border-[#7C3AED] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#EDE9FE] uppercase tracking-wider font-manrope">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-white transition-colors">
                  Safety System
                </a>
              </li>
              <li>
                <a href="#passenger" className="hover:text-white transition-colors">
                  For Passengers
                </a>
              </li>
              <li>
                <a href="#drivers" className="hover:text-white transition-colors">
                  For Drivers
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Trust Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#EDE9FE] uppercase tracking-wider font-manrope">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#technology" className="hover:text-white transition-colors">
                  Technology & Trust
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white transition-colors">
                  Community Values
                </a>
              </li>
              <li>
                <a href="#waitlist" className="hover:text-white transition-colors">
                  Priority Waitlist
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#EDE9FE] uppercase tracking-wider font-manrope">
              Legal & Policy
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy (DPDP Act)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Driver Guidelines & Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Safety Operations Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 HERDRIVE Platform. All rights reserved.</p>
          <p className="text-[11px] text-gray-400">
            HERDRIVE is a registered mobility trademark. Conceptual UI representations.
          </p>
        </div>
      </div>
    </footer>
  );
};

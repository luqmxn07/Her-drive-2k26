"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Safety", href: "#safety" },
    { name: "For Drivers", href: "#drivers" },
    { name: "About", href: "#community" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#FAF9F7]/90 backdrop-blur-md shadow-sm border-b border-[#211827]/10 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Official App Icon */}
          <Link
            href="#hero"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded-xl p-1"
            aria-label="HERDRIVE Home"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-1 ring-[#7C3AED]/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Image
                src="/brand/herdrive icon dark.png"
                alt="HERDRIVE"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#211827] font-manrope">
                HERDRIVE
              </span>
              <span className="text-[10px] font-bold text-[#7C3AED] tracking-wider uppercase -mt-1">
                Women Mobility
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-[#242124]/80 hover:text-[#7C3AED] transition-colors py-1 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded-md"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#waitlist">
              <Button size="sm" variant="primary" className="gap-2 shadow-md shadow-[#7C3AED]/20">
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#211827] hover:bg-[#EDE9FE] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#7C3AED]" />
              ) : (
                <Menu className="w-6 h-6 text-[#211827]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#211827] text-white border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-5 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-gray-200 hover:text-[#EDE9FE] py-2 border-b border-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-3">
            <a href="#waitlist" onClick={() => setMobileMenuOpen(false)}>
              <Button fullWidth size="md" variant="primary">
                Join the Waitlist
              </Button>
            </a>
            <a href="#drivers" onClick={() => setMobileMenuOpen(false)}>
              <Button fullWidth size="md" variant="secondary" className="border-white/30 text-white hover:bg-white/10">
                Become a Driver
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

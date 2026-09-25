"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
          ? "bg-[#FAF9F7]/90 dark:bg-[#0F0524]/90 backdrop-blur-md shadow-sm border-b border-[#F3E8F0] dark:border-[#2D1B4E] py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Dynamic Light/Dark App Icon */}
          <Link
            href="#hero"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#F472B6] rounded-xl p-1"
            aria-label="HERDRIVE Home"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-1 ring-[#F472B6]/40 group-hover:scale-105 transition-transform duration-200 shrink-0 bg-transparent">
              <Image
                src={theme === "dark" ? "/brand/her-drive-dark.png" : "/brand/webpage-logo.png"}
                alt="HERDRIVE Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain p-0.5 transition-opacity duration-300"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#242124] dark:text-[#FFFAFC] font-manrope">
                HERDRIVE
              </span>
              <span className="text-[10px] font-bold text-[#A855F7] dark:text-[#F472B6] tracking-wider uppercase -mt-1">
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
                className="text-sm font-semibold text-[#242124]/80 dark:text-gray-300 hover:text-[#A855F7] dark:hover:text-[#F472B6] transition-colors py-1 focus:outline-none focus:ring-2 focus:ring-[#F472B6] rounded-md"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action CTA & Theme Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-[#2D1B4E] bg-white/80 dark:bg-[#1E0B3D]/80 text-[#242124] dark:text-[#F472B6] hover:bg-[#FDE7F3] dark:hover:bg-[#2D1B4E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F472B6] cursor-pointer"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-[#A855F7]" />
              )}
            </button>

            <a href="#waitlist">
              <Button size="sm" variant="primary" className="gap-2 shadow-md">
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>

          {/* Mobile Actions: Theme Switcher & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-[#2D1B4E] bg-white/80 dark:bg-[#1E0B3D]/80 text-[#242124] dark:text-[#F472B6] hover:bg-[#FDE7F3] dark:hover:bg-[#2D1B4E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F472B6] min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-300" />
              ) : (
                <Moon className="w-5 h-5 text-[#A855F7]" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#1E0B3D] border border-gray-200 dark:border-[#2D1B4E] text-[#242124] dark:text-white hover:bg-[#FDE7F3] dark:hover:bg-[#2D1B4E] focus:outline-none focus:ring-2 focus:ring-[#F472B6] min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#F472B6]" />
              ) : (
                <Menu className="w-6 h-6 text-[#242124] dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0524] text-white border-b border-[#2D1B4E] px-6 py-6 space-y-4 animate-in slide-in-from-top-5 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-gray-200 hover:text-[#F472B6] py-2 border-b border-[#2D1B4E]/50 transition-colors"
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
              <Button fullWidth size="md" variant="secondary" className="border-[#F472B6]/40 text-white hover:bg-[#1E0B3D]">
                Become a Driver
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

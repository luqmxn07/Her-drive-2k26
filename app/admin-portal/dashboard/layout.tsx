"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { AdminUser } from "@/types/admin";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
          } else {
            router.push("/admin-portal/login");
          }
        } else {
          router.push("/admin-portal/login");
        }
      } catch {
        router.push("/admin-portal/login");
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin-portal/login");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0524] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#F472B6]" />
          <p className="text-xs text-gray-400 font-mono">Authenticating session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Overview",
      href: "/admin-portal/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Waitlist Records",
      href: "/admin-portal/dashboard/waitlist",
      icon: Users,
      exact: false,
    },
    {
      name: "Audit Logs",
      href: "/admin-portal/dashboard/audit-logs",
      icon: FileText,
      exact: false,
    },
    ...(currentUser?.role === "SUPER_ADMIN"
      ? [
          {
            name: "Admin Operators",
            href: "/admin-portal/dashboard/users",
            icon: ShieldCheck,
            exact: false,
          },
        ]
      : []),
    {
      name: "Security & System",
      href: "/admin-portal/dashboard/settings",
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0524] text-[#FFFAFC] flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-[#2D1B4E] bg-[#1E0B3D]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin-portal/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow ring-1 ring-[#F472B6]/40 p-0.5 bg-[#0F0524] shrink-0">
              <Image
                src="/brand/her-drive-dark.png"
                alt="HERDRIVE Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight font-manrope text-[#FFFAFC]">
                HERDRIVE
              </span>
              <span className="ml-2 text-[10px] font-bold text-[#F472B6] tracking-wider uppercase px-2 py-0.5 rounded bg-[#F472B6]/15 border border-[#F472B6]/30">
                Console
              </span>
            </div>
          </Link>
        </div>

        {/* Right User Bar */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-[#2D1B4E]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#F472B6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.first_name[0]}
                {currentUser.last_name[0]}
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-tight">
                  {currentUser.first_name} {currentUser.last_name}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {currentUser.email}
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#F472B6]/20 text-[#F472B6] border border-[#F472B6]/35">
                {currentUser.role}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2D1B4E] bg-white/5 hover:bg-rose-950/60 hover:border-[#E11D48]/40 hover:text-rose-200 text-xs text-gray-300 transition-colors cursor-pointer"
            title="Sign out of Admin Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-[#1E0B3D]/50 border-r border-[#2D1B4E] hidden md:flex flex-col justify-between p-4 shrink-0">
          <nav className="space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
              Navigation
            </div>
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#A855F7] to-[#F472B6] text-white shadow-md shadow-[#A855F7]/25"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? "text-white" : "text-[#F472B6]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 rounded-2xl bg-[#0F0524] border border-[#2D1B4E] text-[11px] text-gray-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Production RBAC Guard
            </div>
            <p className="text-[10px] text-gray-500">
              Authenticated via HttpOnly JWT session.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
            <div className="bg-[#1E0B3D] border-b border-[#2D1B4E] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold font-manrope text-white">HERDRIVE Admin</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F472B6]/20 text-[#F472B6]">
                  {currentUser?.role}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2 flex-1 overflow-y-auto bg-[#0F0524]">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#A855F7] to-[#F472B6] text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <IconComp className="w-5 h-5 text-[#F472B6]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-950/60 border border-[#E11D48]/40 text-rose-200 text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

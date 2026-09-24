"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin-portal/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful authentication: redirect to dashboard
        router.push(redirectTarget);
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch {
      setError("Authentication service temporarily unavailable. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F0524] relative overflow-hidden select-none">
      {/* Subtle brand ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-[#7C3AED]/15 to-[#F472B6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Main Card */}
        <div className="bg-[#1E0B3D] border border-[#2D1B4E] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 backdrop-blur-md">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg ring-1 ring-[#F472B6]/40 p-0.5 bg-[#0F0524] shrink-0">
              <Image
                src="/brand/her-drive-dark.png"
                alt="HERDRIVE Logo"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-[#FFFAFC] font-manrope">
                HERDRIVE
              </h1>
              <p className="text-[11px] font-bold text-[#F472B6] tracking-widest uppercase mt-0.5">
                ADMIN CONSOLE
              </p>
            </div>

            <p className="text-xs text-gray-400">
              Secure administrative access
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-[#E11D48]/40 text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-150">
              <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="admin-identifier"
                className="text-xs font-bold text-gray-300 uppercase tracking-wider block"
              >
                Username / Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-identifier"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="admin@herdrive.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#2D1B4E] bg-[#0F0524] text-[#FFFAFC] placeholder-gray-500 text-sm outline-none focus:border-[#F472B6] focus:ring-2 focus:ring-[#F472B6]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="text-xs font-bold text-gray-300 uppercase tracking-wider block"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#2D1B4E] bg-[#0F0524] text-[#FFFAFC] placeholder-gray-500 text-sm outline-none focus:border-[#F472B6] focus:ring-2 focus:ring-[#F472B6]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#A855F7] via-[#9333EA] to-[#F472B6] hover:from-[#9333EA] hover:to-[#EC4899] shadow-lg shadow-[#A855F7]/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Perimeter Notice */}
          <div className="pt-2 border-t border-[#2D1B4E]/60 text-center">
            <span className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              Protected by RBAC & Upstash brute-force guard
            </span>
          </div>
        </div>

        {/* Bottom System Identity */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2026 HERDRIVE Platform • Internal Administration Only</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0F0524]">
          <Loader2 className="w-8 h-8 animate-spin text-[#F472B6]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

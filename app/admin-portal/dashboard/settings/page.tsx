"use client";

import React, { useEffect, useState } from "react";
import {
  Shield,
  Database,
  Zap,
  Lock,
  Key,
  CheckCircle2,
  AlertTriangle,
  Server,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [dbConfigured, setDbConfigured] = useState<boolean>(true);
  const [redisConfigured, setRedisConfigured] = useState<boolean>(true);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-manrope tracking-tight">
          Security & System Telemetry
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Zero-trust infrastructure parameters, encryption standards, and RBAC matrix
        </p>
      </div>

      {/* Infrastructure Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Neon PostgreSQL */}
        <div className="p-6 rounded-3xl bg-[#1E0B3D] border border-[#2D1B4E] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#7C3AED]/20 text-[#F472B6]">
              <Database className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Store
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Neon PostgreSQL</h3>
            <p className="text-xs text-gray-400 mt-1">
              ACID-compliant serverless relational database. Primary source of truth for waitlist applicants, hashed admin credentials, and immutable audit logs.
            </p>
          </div>
          <div className="pt-2 border-t border-[#2D1B4E] text-[10px] text-gray-500 font-mono">
            SSL Mode: Required • PgBouncer Pooling
          </div>
        </div>

        {/* Upstash Redis */}
        <div className="p-6 rounded-3xl bg-[#1E0B3D] border border-[#2D1B4E] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#F472B6]/20 text-[#F472B6]">
              <Zap className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Guarded
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Upstash Redis Guard</h3>
            <p className="text-xs text-gray-400 mt-1">
              In-memory sliding window rate limiting. Protects against brute-force password guessing, credential stuffing, and waitlist bot spam.
            </p>
          </div>
          <div className="pt-2 border-t border-[#2D1B4E] text-[10px] text-gray-500 font-mono">
            Lockout: 5 failed attempts / 15m window
          </div>
        </div>

        {/* Session Security */}
        <div className="p-6 rounded-3xl bg-[#1E0B3D] border border-[#2D1B4E] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              HttpOnly JWT
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Session Security</h3>
            <p className="text-xs text-gray-400 mt-1">
              Signed with HS256 algorithm. Delivered exclusively over HTTPS with SameSite=Lax and HttpOnly flags to mitigate XSS and CSRF token extraction.
            </p>
          </div>
          <div className="pt-2 border-t border-[#2D1B4E] text-[10px] text-gray-500 font-mono">
            Session TTL: 8 Hours • Auto-Rotation
          </div>
        </div>
      </div>

      {/* RBAC Matrix Card */}
      <div className="p-6 rounded-3xl bg-[#1E0B3D] border border-[#2D1B4E] shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white font-manrope">
          Role-Based Access Control (RBAC) Matrix
        </h2>
        <p className="text-xs text-gray-400">
          Backend security guards enforce authorization server-side on every request
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2D1B4E] text-gray-400 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">View Metrics & Trends</th>
                <th className="py-2.5 px-3">Inspect Waitlist</th>
                <th className="py-2.5 px-3">Update Applicant Status</th>
                <th className="py-2.5 px-3">View Audit Logs</th>
                <th className="py-2.5 px-3">Manage Operators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D1B4E]/60 text-gray-200">
              <tr>
                <td className="py-3 px-3 font-bold text-[#F472B6]">SUPER_ADMIN</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#A855F7]">ADMIN</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-gray-500 font-mono">✕ Blocked (403)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-gray-300">VIEWER</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Read-Only</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Read-Only</td>
                <td className="py-3 px-3 text-gray-500 font-mono">✕ Blocked (403)</td>
                <td className="py-3 px-3 text-gray-500 font-mono">✕ Blocked (403)</td>
                <td className="py-3 px-3 text-gray-500 font-mono">✕ Blocked (403)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

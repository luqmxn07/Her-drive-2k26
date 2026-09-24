"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  Calendar,
  Clock,
  Terminal,
  AlertCircle,
  Loader2,
  RefreshCw,
  Lock,
} from "lucide-react";
import { AdminUser } from "@/types/admin";

export default function AdminOperatorsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || "Failed to load admin operators.");
        }
      } else if (res.status === 403) {
        setError("Access Denied: Requires SUPER_ADMIN permissions.");
      } else {
        setError("Failed to fetch admin users.");
      }
    } catch {
      setError("Network error fetching admin operators.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-manrope tracking-tight">
            Administrative Operators & RBAC
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Super-Admin management tier: active accounts, roles, and credential verification
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-[#2D1B4E] hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#F472B6]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Security Instruction Callout */}
      <div className="p-5 rounded-2xl bg-[#1E0B3D] border border-[#F472B6]/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F472B6]">
          <Lock className="w-4 h-4" />
          Zero Public Registration Policy
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          In accordance with HERDRIVE security requirements, admin accounts cannot be created through any public registration or frontend webpage. New administrative operators must be provisioned securely via the server-side CLI tool directly against Neon PostgreSQL:
        </p>
        <div className="p-3 rounded-xl bg-[#0F0524] border border-[#2D1B4E] flex items-center justify-between font-mono text-xs text-[#FFFAFC] overflow-x-auto">
          <code>node scripts/create-admin.mjs &lt;email&gt; &lt;password&gt; &lt;firstName&gt; &lt;lastName&gt; [SUPER_ADMIN|ADMIN|VIEWER]</code>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[#1E0B3D] border border-[#2D1B4E] shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#F472B6]" />
            <p className="text-xs text-gray-400 font-mono">Loading operators...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-300 space-y-2">
            <AlertCircle className="w-6 h-6 text-[#E11D48] mx-auto" />
            <p>{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#F472B6]/40 mx-auto" />
            <p className="text-sm font-semibold text-white">No administrative operators provisioned yet.</p>
            <p>Run the administrative creation script to seed your first operator.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2D1B4E] bg-[#0F0524]/60 text-gray-400 uppercase font-mono text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Operator</th>
                  <th className="py-3.5 px-4 font-bold">Role</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Last Login</th>
                  <th className="py-3.5 px-4 font-bold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D1B4E]/60 text-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#F472B6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.first_name[0]}{u.last_name[0]}
                        </div>
                        <div>
                          <span className="font-bold text-white block">
                            {u.first_name} {u.last_name}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono block">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F472B6]/15 text-[#F472B6] border border-[#F472B6]/30">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.is_active
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                            : "bg-rose-500/15 text-rose-300 border border-rose-500/25"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-emerald-400" : "bg-rose-400"}`} />
                        {u.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                      {u.last_login_at
                        ? new Date(u.last_login_at).toLocaleString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never logged in"}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                      {new Date(u.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

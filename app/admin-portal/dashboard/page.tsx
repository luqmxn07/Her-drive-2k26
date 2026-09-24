"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Car,
  HeartHandshake,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  RefreshCw,
  Loader2,
  UserCheck,
} from "lucide-react";
import { AdminDashboardStats, AdminWaitlistEntry } from "@/types/admin";

export default function AdminDashboardOverviewPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentEntries, setRecentEntries] = useState<AdminWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, waitlistRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/waitlist?page=1&limit=5"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }

      if (waitlistRes.ok) {
        const waitlistData = await waitlistRes.json();
        if (waitlistData.success) setRecentEntries(waitlistData.entries);
      }
    } catch (e) {
      console.error("[Dashboard Fetch Error]", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F472B6]" />
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Registrations",
      value: stats?.total ?? 0,
      icon: Users,
      trend: `+${stats?.last24Hours ?? 0} in last 24h`,
      color: "from-[#7C3AED] to-[#A855F7]",
      subtext: "Cumulative waitlist signups",
    },
    {
      title: "Passengers",
      value: stats?.passengers ?? 0,
      icon: UserCheck,
      trend: stats?.total ? `${Math.round(((stats?.passengers || 0) / stats.total) * 100)}% of total` : "0%",
      color: "from-[#A855F7] to-[#F472B6]",
      subtext: "Prospective riders",
    },
    {
      title: "Drivers",
      value: stats?.drivers ?? 0,
      icon: Car,
      trend: stats?.total ? `${Math.round(((stats?.drivers || 0) / stats.total) * 100)}% of total` : "0%",
      color: "from-[#F472B6] to-[#FB7185]",
      subtext: "Prospective driver partners",
    },
    {
      title: "Dual Interest",
      value: stats?.both ?? 0,
      icon: HeartHandshake,
      trend: stats?.total ? `${Math.round(((stats?.both || 0) / stats.total) * 100)}% of total` : "0%",
      color: "from-[#6B46C1] to-[#7C3AED]",
      subtext: "Passenger + Driver interest",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-manrope tracking-tight">
            Administrative Overview
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time telemetry, applicant counts, and operational waitlist metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-[#2D1B4E] hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#F472B6]" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin-portal/dashboard/waitlist"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#F472B6] text-white text-xs font-bold shadow-md shadow-[#A855F7]/25 hover:from-[#9333EA] hover:to-[#EC4899] transition-all"
          >
            Manage Waitlist
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-5 rounded-2xl bg-[#1E0B3D] border border-[#2D1B4E] shadow-xl flex flex-col justify-between space-y-4 hover:border-[#F472B6]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                  {kpi.title}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-xs`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-white font-manrope">
                  {kpi.value.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpi.trend}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2D1B4E]/60 text-[10px] text-gray-500">
                {kpi.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Breakdown & Velocity Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1E0B3D]/80 border border-[#2D1B4E] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
              Waitlisted (Pending)
            </span>
            <span className="text-xl font-extrabold text-white">
              {stats?.waitlisted ?? 0}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E0B3D]/80 border border-[#2D1B4E] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
              Contacted
            </span>
            <span className="text-xl font-extrabold text-white">
              {stats?.contacted ?? 0}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E0B3D]/80 border border-[#2D1B4E] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
              Converted
            </span>
            <span className="text-xl font-extrabold text-white">
              {stats?.converted ?? 0}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E0B3D]/80 border border-[#2D1B4E] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-[#C084FC] border border-purple-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
              Velocity (Last 7 Days)
            </span>
            <span className="text-xl font-extrabold text-white">
              {stats?.last7Days ?? 0} entries
            </span>
          </div>
        </div>
      </div>

      {/* Trend & Recent Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Trend Histogram Visualization */}
        <div className="lg:col-span-7 bg-[#1E0B3D] border border-[#2D1B4E] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#2D1B4E] pb-4">
            <div>
              <h2 className="text-base font-bold text-white font-manrope">
                14-Day Registration Trend
              </h2>
              <p className="text-xs text-gray-400">
                Daily application velocity over the last two weeks
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#F472B6] px-2.5 py-1 rounded-md bg-[#F472B6]/10 border border-[#F472B6]/25">
              Neon Relational Telemetry
            </span>
          </div>

          {stats?.trend && stats.trend.length > 0 ? (
            <div className="space-y-3">
              <div className="h-44 flex items-end gap-2 pt-6 px-2">
                {stats.trend.map((point) => {
                  const maxVal = Math.max(...stats.trend.map((t) => t.count), 1);
                  const heightPercent = Math.max(12, Math.round((point.count / maxVal) * 100));

                  return (
                    <div
                      key={point.date}
                      className="flex-1 flex flex-col items-center gap-1.5 group relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20">
                        {point.count} signups
                      </div>

                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#7C3AED] to-[#F472B6] group-hover:from-[#9333EA] group-hover:to-[#EC4899] transition-all shadow-xs"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] text-gray-400 font-mono rotate-45 sm:rotate-0 origin-left mt-1">
                        {point.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs text-gray-400 border border-dashed border-[#2D1B4E] rounded-2xl">
              No registration trend records yet in the current observation window.
            </div>
          )}
        </div>

        {/* Recent Registrations Table */}
        <div className="lg:col-span-5 bg-[#1E0B3D] border border-[#2D1B4E] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D1B4E] pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-manrope">
                Recent Signups
              </h2>
              <p className="text-xs text-gray-400">Latest applicants across roles</p>
            </div>
            <Link
              href="/admin-portal/dashboard/waitlist"
              className="text-xs text-[#F472B6] hover:underline font-semibold flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#2D1B4E]/60">
            {recentEntries.length > 0 ? (
              recentEntries.map((entry) => (
                <div key={entry.id} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-white block truncate">
                      {entry.full_name}
                    </span>
                    <span className="text-gray-400 text-[11px] truncate block font-mono">
                      {entry.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F472B6]/15 text-[#F472B6] border border-[#F472B6]/25">
                      {entry.interest_type}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      entry.status === "waitlisted"
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        : entry.status === "contacted"
                        ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">
                No applicants recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

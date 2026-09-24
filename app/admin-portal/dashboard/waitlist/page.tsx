"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Calendar,
  X,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { AdminWaitlistEntry, WaitlistStatus } from "@/types/admin";

export default function AdminWaitlistManagementPage() {
  const [entries, setEntries] = useState<AdminWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Entry for Status Edit Modal & Details Drawer
  const [selectedEntry, setSelectedEntry] = useState<AdminWaitlistEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<WaitlistStatus>("waitlisted");
  const [editNotes, setEditNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchWaitlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        search: search.trim(),
        role: roleFilter,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/waitlist?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setEntries(data.entries);
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.total);
        } else {
          setError(data.error || "Failed to load waitlist.");
        }
      } else {
        setError("Failed to load waitlist entries.");
      }
    } catch {
      setError("Network error fetching waitlist entries.");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchWaitlist();
  }, [fetchWaitlist]);

  // Handle Status Update Submission
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/waitlist/${selectedEntry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, notes: editNotes }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Update local list state
        setEntries((prev) =>
          prev.map((item) => (item.id === selectedEntry.id ? data.entry : item))
        );
        setIsEditModalOpen(false);
        setSelectedEntry(null);
      } else {
        alert(data.error || "Failed to update waitlist entry status.");
      }
    } catch {
      alert("Network error updating status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Edit Modal Helper
  const openEditModal = (entry: AdminWaitlistEntry) => {
    setSelectedEntry(entry);
    setEditStatus(entry.status);
    setEditNotes(entry.notes || "");
    setIsEditModalOpen(true);
  };

  // Export visible/filtered waitlist to CSV
  const handleExportCsv = () => {
    if (entries.length === 0) return;

    const headers = ["ID", "Full Name", "Email", "Phone", "Role", "Status", "Consent", "Created At", "Notes"];
    const rows = entries.map((e) => [
      e.id,
      `"${e.full_name.replace(/"/g, '""')}"`,
      `"${e.email.replace(/"/g, '""')}"`,
      `"${(e.phone || "").replace(/"/g, '""')}"`,
      e.interest_type,
      e.status,
      e.consent ? "Yes" : "No",
      e.created_at,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `herdrive_waitlist_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-manrope tracking-tight">
            Waitlist Records Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Displaying {totalCount} total applicant registrations in Neon PostgreSQL
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-[#2D1B4E] hover:bg-white/15 text-xs font-bold text-white transition-all cursor-pointer shadow-sm w-fit"
        >
          <Download className="w-4 h-4 text-[#F472B6]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="p-4 rounded-2xl bg-[#1E0B3D] border border-[#2D1B4E] shadow-xl flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2D1B4E] bg-[#0F0524] text-[#FFFAFC] placeholder-gray-500 text-xs outline-none focus:border-[#F472B6] focus:ring-2 focus:ring-[#F472B6]/20 transition-all"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="py-2.5 px-3 rounded-xl border border-[#2D1B4E] bg-[#0F0524] text-xs text-white outline-none focus:border-[#F472B6] cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="passenger">Passengers</option>
            <option value="driver">Drivers</option>
            <option value="both">Both (Passenger & Driver)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="py-2.5 px-3 rounded-xl border border-[#2D1B4E] bg-[#0F0524] text-xs text-white outline-none focus:border-[#F472B6] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-3xl bg-[#1E0B3D] border border-[#2D1B4E] shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#F472B6]" />
            <p className="text-xs text-gray-400 font-mono">Loading waitlist entries...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-300 space-y-2">
            <AlertCircle className="w-6 h-6 text-[#E11D48] mx-auto" />
            <p>{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 space-y-2">
            <Users className="w-8 h-8 text-[#F472B6]/40 mx-auto" />
            <p className="text-sm font-semibold text-white">No waitlist applicants matched.</p>
            <p>Try modifying your search or clearing the active filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2D1B4E] bg-[#0F0524]/60 text-gray-400 uppercase font-mono text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Applicant</th>
                  <th className="py-3.5 px-4 font-bold">Contact</th>
                  <th className="py-3.5 px-4 font-bold">Role</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Consent</th>
                  <th className="py-3.5 px-4 font-bold">Date Registered</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D1B4E]/60 text-gray-200">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Applicant Name */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">
                        {entry.full_name}
                      </span>
                      {entry.notes && (
                        <span className="text-[10px] text-amber-300 font-medium block truncate max-w-[180px]">
                          Note: {entry.notes}
                        </span>
                      )}
                    </td>

                    {/* Contact (Email + Phone) */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-300">
                        <Mail className="w-3 h-3 text-[#F472B6] shrink-0" />
                        <span className="truncate max-w-[200px]">{entry.email}</span>
                      </div>
                      {entry.phone && (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400">
                          <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{entry.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Role Pill */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F472B6]/15 text-[#F472B6] border border-[#F472B6]/30">
                        {entry.interest_type}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          entry.status === "waitlisted"
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/25"
                            : entry.status === "contacted"
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/25"
                            : entry.status === "converted"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/25"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>

                    {/* DPDP Consent */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> DPDP
                      </span>
                    </td>

                    {/* Date Registered */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                      {new Date(entry.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Actions Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditModal(entry)}
                        className="px-3 py-1.5 rounded-lg border border-[#2D1B4E] bg-white/5 hover:bg-[#F472B6]/20 hover:border-[#F472B6]/40 text-[#F472B6] text-xs font-semibold transition-all cursor-pointer"
                      >
                        Edit Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="py-3.5 px-6 border-t border-[#2D1B4E] bg-[#0F0524]/60 flex items-center justify-between text-xs text-gray-400">
          <span>
            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong> ({totalCount} total entries)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-[#2D1B4E] bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-[#2D1B4E] bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {isEditModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E0B3D] border border-[#2D1B4E] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2D1B4E] pb-3">
              <div>
                <h3 className="font-bold text-base text-white font-manrope">
                  Update Applicant Record
                </h3>
                <p className="text-xs text-gray-400">
                  {selectedEntry.full_name} ({selectedEntry.email})
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                  Workflow Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as WaitlistStatus)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-[#2D1B4E] bg-[#0F0524] text-sm text-white outline-none focus:border-[#F472B6]"
                >
                  <option value="waitlisted">WAITLISTED (Initial Entry)</option>
                  <option value="contacted">CONTACTED (Outreach Initiated)</option>
                  <option value="converted">CONVERTED (Onboarded to Pilot)</option>
                  <option value="archived">ARCHIVED (Inactive / Closed)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Contacted via phone on 24 Sep for Bengaluru early access pilot..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#2D1B4E] bg-[#0F0524] text-xs text-white placeholder-gray-500 outline-none focus:border-[#F472B6]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 border border-[#2D1B4E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#A855F7] to-[#F472B6] hover:from-[#9333EA] hover:to-[#EC4899] shadow-md shadow-[#A855F7]/25 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { AdminAuditLog } from "@/types/admin";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/audit-logs?page=${page}&limit=25`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs);
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.total);
        } else {
          setError(data.error || "Failed to load audit logs.");
        }
      } else {
        setError("Failed to fetch audit logs.");
      }
    } catch {
      setError("Network error fetching audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-manrope tracking-tight">
            Security & Operational Audit Logs
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Immutable log stream recording administrative operations, logins, and status mutations ({totalCount} total events)
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-[#2D1B4E] hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#F472B6]" : ""}`} />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Audit Log Table Container */}
      <div className="rounded-3xl bg-[#1E0B3D] border border-[#2D1B4E] shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#F472B6]" />
            <p className="text-xs text-gray-400 font-mono">Loading audit stream...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-300 space-y-2">
            <AlertCircle className="w-6 h-6 text-[#E11D48] mx-auto" />
            <p>{error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 space-y-2">
            <FileText className="w-8 h-8 text-[#F472B6]/40 mx-auto" />
            <p className="text-sm font-semibold text-white">No audit records logged yet.</p>
            <p>Administrative logins and mutations will be streamed here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2D1B4E] bg-[#0F0524]/60 text-gray-400 uppercase font-mono text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Timestamp</th>
                  <th className="py-3.5 px-4 font-bold">Operator</th>
                  <th className="py-3.5 px-4 font-bold">Action</th>
                  <th className="py-3.5 px-4 font-bold">Resource</th>
                  <th className="py-3.5 px-4 font-bold">IP Address</th>
                  <th className="py-3.5 px-4 font-bold">Sanitized Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D1B4E]/60 text-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    {/* Operator Email */}
                    <td className="py-3 px-4 font-mono text-[11px] text-[#F472B6] font-semibold whitespace-nowrap">
                      {log.admin_email}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          log.action.includes("SUCCESS")
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                            : log.action.includes("FAILURE")
                            ? "bg-rose-500/15 text-rose-300 border border-rose-500/25"
                            : "bg-[#7C3AED]/15 text-[#C084FC] border border-[#7C3AED]/25"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Resource */}
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-300">
                      {log.resource_type}
                      {log.resource_id && (
                        <span className="text-[10px] text-gray-500 ml-1">
                          ({log.resource_id.slice(0, 8)}...)
                        </span>
                      )}
                    </td>

                    {/* IP Address */}
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                      {log.ip_address || "internal"}
                    </td>

                    {/* Details Payload */}
                    <td className="py-3 px-4">
                      {log.details ? (
                        <pre className="text-[10px] font-mono bg-[#0F0524] p-1.5 rounded border border-[#2D1B4E] max-w-xs truncate text-gray-300">
                          {JSON.stringify(log.details)}
                        </pre>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
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
            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-[#2D1B4E] bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-[#2D1B4E] bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

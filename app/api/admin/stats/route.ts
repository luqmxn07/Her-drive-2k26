import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import { AdminDashboardStats } from "@/types/admin";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req, ["SUPER_ADMIN", "ADMIN", "VIEWER"]);
  if ("errorResponse" in authResult) return authResult.errorResponse;

  const sql = getDb();
  if (!sql) {
    return NextResponse.json(
      { success: false, error: "Database unavailable" },
      { status: 503 }
    );
  }

  try {
    await initDb();

    // 1. Overall Aggregations
    const agg = await sql`
      SELECT
        COUNT(*)::int as total,
        COUNT(CASE WHEN interest_type = 'passenger' THEN 1 END)::int as passengers,
        COUNT(CASE WHEN interest_type = 'driver' THEN 1 END)::int as drivers,
        COUNT(CASE WHEN interest_type = 'both' THEN 1 END)::int as both,
        COUNT(CASE WHEN status = 'waitlisted' THEN 1 END)::int as waitlisted,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END)::int as contacted,
        COUNT(CASE WHEN status = 'converted' THEN 1 END)::int as converted,
        COUNT(CASE WHEN status = 'archived' THEN 1 END)::int as archived,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END)::int as last_24h,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END)::int as last_7d
      FROM waitlist_entries;
    `;

    // 2. 14-day Daily Trend
    const trendRows = await sql`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM-DD') as date,
        COUNT(*)::int as count
      FROM waitlist_entries
      WHERE created_at >= NOW() - INTERVAL '14 days'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
      ORDER BY date ASC;
    `;

    const summary = agg[0] || {};

    const stats: AdminDashboardStats = {
      total: summary.total || 0,
      passengers: summary.passengers || 0,
      drivers: summary.drivers || 0,
      both: summary.both || 0,
      waitlisted: summary.waitlisted || 0,
      contacted: summary.contacted || 0,
      converted: summary.converted || 0,
      archived: summary.archived || 0,
      last24Hours: summary.last_24h || 0,
      last7Days: summary.last_7d || 0,
      trend: trendRows.map((r: any) => ({ date: r.date, count: r.count })),
    };

    return NextResponse.json({ success: true, stats }, { status: 200 });
  } catch (error: any) {
    console.error("[Admin Stats API Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to generate dashboard statistics" }, { status: 500 });
  }
}

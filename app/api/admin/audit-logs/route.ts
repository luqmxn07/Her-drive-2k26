import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import { AdminAuditLog } from "@/types/admin";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req, ["SUPER_ADMIN", "ADMIN"]);
  if ("errorResponse" in authResult) return authResult.errorResponse;

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({
      success: true,
      data: [],
      pagination: { total: 0, page: 1, limit: 25, totalPages: 1 },
    });
  }

  try {
    await initDb();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const offset = (page - 1) * limit;

    const countRows = await sql`SELECT COUNT(*)::int as total FROM admin_audit_logs;`;
    const total = countRows[0]?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    const logs = await sql`
      SELECT id, admin_id, admin_email, action, resource_type, resource_id, details, ip_address, user_agent, created_at
      FROM admin_audit_logs
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    return NextResponse.json(
      {
        success: true,
        logs: logs as AdminAuditLog[],
        pagination: { total, page, limit, totalPages },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Audit Logs GET Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve audit logs" }, { status: 500 });
  }
}

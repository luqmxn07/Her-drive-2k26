import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import { AdminUser } from "@/types/admin";

export async function GET(req: NextRequest) {
  // Only SUPER_ADMIN can view and manage admin operator accounts
  const authResult = await requireAuth(req, ["SUPER_ADMIN"]);
  if ("errorResponse" in authResult) return authResult.errorResponse;

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 503 });
  }

  try {
    await initDb();
    const rows = await sql`
      SELECT id, email, first_name, last_name, role, is_active, last_login_at, created_at, updated_at
      FROM admin_users
      ORDER BY created_at ASC;
    `;

    return NextResponse.json(
      {
        success: true,
        users: rows as AdminUser[],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Users GET Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve admin operators" }, { status: 500 });
  }
}

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
    return NextResponse.json({
      success: true,
      users: [
        {
          id: "00000000-0000-0000-0000-000000000001",
          email: (process.env.INITIAL_ADMIN_EMAIL || "admin@herdrive.com").toLowerCase(),
          first_name: "HERDRIVE",
          last_name: "Administrator",
          role: "SUPER_ADMIN",
          is_active: true,
          last_login_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
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

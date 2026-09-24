import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { WaitlistStatus } from "@/types/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req, ["SUPER_ADMIN", "ADMIN", "VIEWER"]);
  if ("errorResponse" in authResult) return authResult.errorResponse;

  const { id } = await params;
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 503 });
  }

  try {
    await initDb();
    const rows = await sql`
      SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
      FROM waitlist_entries
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: "Waitlist entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry: rows[0] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch waitlist entry" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only SUPER_ADMIN and ADMIN can update waitlist entries. VIEWER is rejected with 403.
  const authResult = await requireAuth(req, ["SUPER_ADMIN", "ADMIN"]);
  if ("errorResponse" in authResult) return authResult.errorResponse;

  const { id } = await params;
  const { user } = authResult;
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 503 });
  }

  try {
    await initDb();
    const body = await req.json();
    const { status, notes } = body;

    const allowedStatuses: WaitlistStatus[] = ["waitlisted", "contacted", "converted", "archived"];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of [${allowedStatuses.join(", ")}]` },
        { status: 400 }
      );
    }

    // Retrieve previous state for audit diff
    const current = await sql`
      SELECT id, full_name, email, status, notes FROM waitlist_entries WHERE id = ${id} LIMIT 1;
    `;

    if (!current || current.length === 0) {
      return NextResponse.json({ success: false, error: "Waitlist entry not found" }, { status: 404 });
    }

    const prev = current[0];
    const newStatus = status || prev.status;
    const newNotes = notes !== undefined ? notes : prev.notes;

    const updated = await sql`
      UPDATE waitlist_entries
      SET status = ${newStatus}, notes = ${newNotes}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at;
    `;

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await logAuditEvent({
      adminId: user.id,
      adminEmail: user.email,
      action: "WAITLIST_STATUS_UPDATE",
      resourceType: "waitlist_entries",
      resourceId: id,
      details: {
        applicantEmail: prev.email,
        oldStatus: prev.status,
        newStatus,
        notesUpdated: notes !== undefined,
      },
      ipAddress: ip,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Waitlist record updated successfully.",
        entry: updated[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Waitlist PATCH Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to update waitlist entry" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import { AdminWaitlistEntry } from "@/types/admin";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req, ["SUPER_ADMIN", "ADMIN", "VIEWER"]);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({
      success: true,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 15,
        totalPages: 1,
      },
    });
  }

  try {
    await initDb();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
    const offset = (page - 1) * limit;

    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const role = (searchParams.get("role") || "all").trim().toLowerCase();
    const status = (searchParams.get("status") || "all").trim().toLowerCase();
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "ASC" : "DESC";

    // Build filter expressions
    let countQuery;
    let dataQuery;

    // Use parameterized filters
    const searchPattern = search ? `%${search}%` : null;

    if (search && role !== "all" && status !== "all") {
      countQuery = await sql`
        SELECT COUNT(*)::int as total FROM waitlist_entries
        WHERE (LOWER(full_name) LIKE ${searchPattern} OR LOWER(email) LIKE ${searchPattern} OR phone LIKE ${searchPattern})
          AND interest_type = ${role}
          AND status = ${status};
      `;
      dataQuery = await sql`
        SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
        FROM waitlist_entries
        WHERE (LOWER(full_name) LIKE ${searchPattern} OR LOWER(email) LIKE ${searchPattern} OR phone LIKE ${searchPattern})
          AND interest_type = ${role}
          AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else if (search && role !== "all") {
      countQuery = await sql`
        SELECT COUNT(*)::int as total FROM waitlist_entries
        WHERE (LOWER(full_name) LIKE ${searchPattern} OR LOWER(email) LIKE ${searchPattern} OR phone LIKE ${searchPattern})
          AND interest_type = ${role};
      `;
      dataQuery = await sql`
        SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
        FROM waitlist_entries
        WHERE (LOWER(full_name) LIKE ${searchPattern} OR LOWER(email) LIKE ${searchPattern} OR phone LIKE ${searchPattern})
          AND interest_type = ${role}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else if (search && status !== "all") {
      countQuery = await sql`
        SELECT COUNT(*)::int as total FROM waitlist_entries
        WHERE (LOWER(full_name) LIKE ${searchPattern} OR LOWER(email) LIKE ${searchPattern} OR phone LIKE ${searchPattern})
          AND status = ${status};
      `;
      dataQuery = await sql`
        SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
        FROM waitlist_entries
        WHERE (LOWER(full_name) LIKE ${searchPattern} OR LOWER(email) LIKE ${searchPattern} OR phone LIKE ${searchPattern})
          AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else if (search) {
      countQuery = await sql`
        SELECT COUNT(*)::int as total FROM waitlist_entries
        WHERE (LOWER(full_name) LIKE ${searchPattern} OR LOWER(email) LIKE ${searchPattern} OR phone LIKE ${searchPattern});
      `;
      dataQuery = await sql`
        SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
        FROM waitlist_entries
        WHERE (LOWER(full_name) LIKE ${searchPattern} OR LOWER(email) LIKE ${searchPattern} OR phone LIKE ${searchPattern})
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else if (role !== "all" && status !== "all") {
      countQuery = await sql`
        SELECT COUNT(*)::int as total FROM waitlist_entries
        WHERE interest_type = ${role} AND status = ${status};
      `;
      dataQuery = await sql`
        SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
        FROM waitlist_entries
        WHERE interest_type = ${role} AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else if (role !== "all") {
      countQuery = await sql`
        SELECT COUNT(*)::int as total FROM waitlist_entries
        WHERE interest_type = ${role};
      `;
      dataQuery = await sql`
        SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
        FROM waitlist_entries
        WHERE interest_type = ${role}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else if (status !== "all") {
      countQuery = await sql`
        SELECT COUNT(*)::int as total FROM waitlist_entries
        WHERE status = ${status};
      `;
      dataQuery = await sql`
        SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
        FROM waitlist_entries
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else {
      countQuery = await sql`SELECT COUNT(*)::int as total FROM waitlist_entries;`;
      dataQuery = await sql`
        SELECT id, full_name, email, phone, interest_type, status, consent, consent_timestamp, ip_hash, notes, created_at, updated_at
        FROM waitlist_entries
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    }

    const total = countQuery[0]?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        entries: dataQuery as AdminWaitlistEntry[],
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Waitlist GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve waitlist entries." },
      { status: 500 }
    );
  }
}

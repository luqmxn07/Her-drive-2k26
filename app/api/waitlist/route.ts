import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { checkRateLimit, getRedis } from "@/lib/redis";

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [
    "https://herdrive-2k26.vercel.app",
    "http://localhost:3000",
    process.env.FRONTEND_URL || "",
  ].filter(Boolean);

  const isAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed));
  const allowOrigin = isAllowed ? origin : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  const sql = getDb();
  if (!sql) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503, headers: corsHeaders }
    );
  }

  try {
    await initDb();
    const rows = await sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN interest_type = 'passenger' THEN 1 END)::int as passengers,
        COUNT(CASE WHEN interest_type = 'driver' THEN 1 END)::int as drivers,
        COUNT(CASE WHEN interest_type = 'both' THEN 1 END)::int as both
      FROM waitlist_entries;
    `;

    return NextResponse.json(
      { success: true, stats: rows[0] || { total: 0, passengers: 0, drivers: 0, both: 0 } },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);

  try {
    // 1. IP & Rate Limiting check via Upstash Redis
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const rlResult = await checkRateLimit(`rl:waitlist:${ip}`, 10, 3600); // 10 submissions/hr per IP

    if (!rlResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submission attempts. Please try again later.",
        },
        { status: 429, headers: corsHeaders }
      );
    }

    // 2. Body parsing and validation
    const body = await req.json();
    const { name, email, phone, role, consent } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full name is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { success: false, error: "Consent to data processing is required to join the waitlist." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone && typeof phone === "string" ? phone.trim() : null;
    const cleanRole = ["passenger", "driver", "both"].includes(role) ? role : "passenger";

    // 3. Connect to Neon PostgreSQL
    const sql = getDb();
    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          error: "Database configuration missing. Please verify DATABASE_URL in environment.",
        },
        { status: 503, headers: corsHeaders }
      );
    }

    // Auto-initialize schema if not yet present
    await initDb();

    // Check for existing duplicate email
    const existing = await sql`
      SELECT id, status, created_at FROM waitlist_entries WHERE LOWER(email) = ${cleanEmail} LIMIT 1;
    `;

    if (existing && existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This email address is already registered on our priority waitlist.",
          alreadyRegistered: true,
        },
        { status: 409, headers: corsHeaders }
      );
    }

    // Insert new entry into Neon PostgreSQL
    const result = await sql`
      INSERT INTO waitlist_entries (
        full_name,
        email,
        phone,
        interest_type,
        status,
        consent,
        consent_timestamp
      ) VALUES (
        ${cleanName},
        ${cleanEmail},
        ${cleanPhone},
        ${cleanRole},
        ${Boolean(consent)},
        NOW()
      )
      RETURNING id, status, created_at;
    `;

    // 4. Update stats in Upstash Redis
    try {
      const redis = getRedis();
      if (redis) {
        if (redis.status === "wait") await redis.connect();
        await redis.incr("stats:waitlist:total");
        await redis.incr(`stats:waitlist:role:${cleanRole}`);
      }
    } catch (e) {
      // Redis analytics failure is non-blocking
      console.warn("[Redis stats update]", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully registered on the HERDRIVE waitlist!",
        data: {
          id: result[0]?.id,
          role: cleanRole,
          email: cleanEmail,
        },
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[Waitlist API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while saving your entry.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

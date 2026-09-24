import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { isLoginLocked, recordFailedLogin, resetFailedLogins, checkRateLimit } from "@/lib/redis";
import { verifyPassword, createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { AdminUser } from "@/types/admin";

export async function POST(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    // 1. IP Rate Limiting (max 15 requests per 5 minutes per IP on login endpoint)
    const ipLimit = await checkRateLimit(`rl:admin:login:${ip}`, 15, 300);
    if (!ipLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts from this network. Please wait." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, email, password } = body;
    const identifier = (email || username || "").toString().trim().toLowerCase();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Username/Email and password are required." },
        { status: 400 }
      );
    }

    // 2. Check if account/IP is locked out from repeated failed attempts
    const isLocked = await isLoginLocked(identifier);
    if (isLocked) {
      return NextResponse.json(
        {
          success: false,
          error: "Account access temporarily locked due to multiple failed attempts. Please try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    // 3. Look up user in Neon PostgreSQL
    const sql = getDb();
    if (!sql) {
      return NextResponse.json(
        { success: false, error: "Database service unavailable." },
        { status: 503 }
      );
    }

    await initDb();

    const users = await sql`
      SELECT id, email, password_hash, first_name, last_name, role, is_active, last_login_at, created_at, updated_at
      FROM admin_users
      WHERE LOWER(email) = ${identifier}
      LIMIT 1;
    `;

    // Generic failure helper
    const handleAuthFailure = async (reason: string) => {
      const attempts = await recordFailedLogin(identifier);
      await logAuditEvent({
        adminEmail: identifier,
        action: "ADMIN_LOGIN_FAILURE",
        resourceType: "auth",
        details: { reason, failedAttempts: attempts },
        ipAddress: ip,
        userAgent,
      });

      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    };

    if (!users || users.length === 0) {
      return handleAuthFailure("user_not_found");
    }

    const userRecord = users[0];

    // Check if account is active
    if (!userRecord.is_active) {
      await logAuditEvent({
        adminId: userRecord.id,
        adminEmail: userRecord.email,
        action: "ADMIN_LOGIN_FAILURE",
        resourceType: "auth",
        details: { reason: "account_disabled" },
        ipAddress: ip,
        userAgent,
      });

      return NextResponse.json(
        { success: false, error: "This administrative account is disabled." },
        { status: 403 }
      );
    }

    // 4. Verify password hash using constant-time bcrypt compare
    const isValid = await verifyPassword(password, userRecord.password_hash);
    if (!isValid) {
      return handleAuthFailure("invalid_password");
    }

    // 5. Successful Login
    await resetFailedLogins(identifier);

    // Update last_login_at in Neon
    await sql`
      UPDATE admin_users 
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = ${userRecord.id};
    `;

    // Issue signed JWT
    const token = await createSessionToken({
      sub: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      first_name: userRecord.first_name,
      last_name: userRecord.last_name,
    });

    // Record audit event
    await logAuditEvent({
      adminId: userRecord.id,
      adminEmail: userRecord.email,
      action: "ADMIN_LOGIN_SUCCESS",
      resourceType: "auth",
      details: { role: userRecord.role },
      ipAddress: ip,
      userAgent,
    });

    // Safe user profile (NEVER expose password_hash)
    const safeUser: AdminUser = {
      id: userRecord.id,
      email: userRecord.email,
      first_name: userRecord.first_name,
      last_name: userRecord.last_name,
      role: userRecord.role,
      is_active: userRecord.is_active,
      last_login_at: new Date().toISOString(),
      created_at: userRecord.created_at,
      updated_at: userRecord.updated_at,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Authentication successful.",
        user: safeUser,
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error: any) {
    console.error("[Admin Login Route Error]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}

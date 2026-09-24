import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { isLoginLocked, recordFailedLogin, resetFailedLogins, checkRateLimit } from "@/lib/redis";
import { verifyPassword, hashPassword, createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
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
        { success: false, error: "Username/email and password are required." },
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

    const defaultAdminEmail = (process.env.INITIAL_ADMIN_EMAIL || "admin@herdrive.com").toLowerCase();
    const defaultAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || "HerDrive@Admin2026!";

    // 3. Look up user in Neon PostgreSQL or fallback
    const sql = getDb();

    let userRecord: AdminUser | null = null;

    if (!sql) {
      // Database URL not configured yet: allow bootstrap login with default credentials
      if (identifier === defaultAdminEmail && password === defaultAdminPassword) {
        userRecord = {
          id: "00000000-0000-0000-0000-000000000001",
          email: defaultAdminEmail,
          first_name: "HERDRIVE",
          last_name: "Administrator",
          role: "SUPER_ADMIN",
          is_active: true,
          last_login_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      } else {
        return handleAuthFailure("invalid_credentials_offline_db");
      }
    } else {
      await initDb();

      let users = await sql`
        SELECT id, email, password_hash, first_name, last_name, role, is_active, last_login_at, created_at, updated_at
        FROM admin_users
        WHERE LOWER(email) = ${identifier}
        LIMIT 1;
      `;

      // If user doesn't exist yet, check if logging in with initial default admin credentials
      if ((!users || users.length === 0) && identifier === defaultAdminEmail && password === defaultAdminPassword) {
        const hash = await hashPassword(defaultAdminPassword);
        const inserted = await sql`
          INSERT INTO admin_users (email, password_hash, first_name, last_name, role, is_active)
          VALUES (${defaultAdminEmail}, ${hash}, 'HERDRIVE', 'Administrator', 'SUPER_ADMIN', true)
          ON CONFLICT (email) DO UPDATE SET password_hash = ${hash}
          RETURNING id, email, password_hash, first_name, last_name, role, is_active, last_login_at, created_at, updated_at;
        `;
        users = inserted;
      }

      if (!users || users.length === 0) {
        return handleAuthFailure("user_not_found");
      }

      const found = users[0];

      // Check if account is active
      if (!found.is_active) {
        await logAuditEvent({
          adminId: found.id,
          adminEmail: found.email,
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

      // Verify password hash
      const isValid = await verifyPassword(password, found.password_hash);
      if (!isValid) {
        return handleAuthFailure("invalid_password");
      }

      // Update last_login_at in Neon
      await sql`
        UPDATE admin_users 
        SET last_login_at = NOW(), updated_at = NOW()
        WHERE id = ${found.id};
      `;

      userRecord = found as AdminUser;
    }

    if (!userRecord) {
      return handleAuthFailure("user_not_found");
    }

    // 4. Successful Login
    await resetFailedLogins(identifier);

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

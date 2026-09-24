import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { AdminJWTPayload, AdminRole, AdminUser } from "@/types/admin";
import { getDb, initDb } from "@/lib/db";

export const ADMIN_COOKIE_NAME = "herdrive_admin_session";
const SESSION_EXPIRATION_SECONDS = 8 * 60 * 60; // 8 hours

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || process.env.SESSION_SECRET || "herdrive_admin_secret_key_must_be_changed_in_production_min_32_chars";
  return new TextEncoder().encode(secret);
}

/**
 * Strong password hashing using bcrypt with cost factor 12.
 * Plaintext passwords are NEVER stored.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plaintext, salt);
}

/**
 * Constant-time comparison between plaintext attempt and stored hash.
 */
export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

/**
 * Issue a cryptographically signed JWT session token.
 */
export async function createSessionToken(payload: Omit<AdminJWTPayload, "iat" | "exp" | "jti">): Promise<string> {
  const secretKey = getSecretKey();
  const jti = crypto.randomUUID();

  return new SignJWT({
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    first_name: payload.first_name,
    last_name: payload.last_name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRATION_SECONDS}s`)
    .sign(secretKey);
}

/**
 * Verify JWT signature and expiration.
 */
export async function verifySessionToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify session token from incoming request cookies.
 */
export async function getAdminSession(req: NextRequest | Request): Promise<AdminJWTPayload | null> {
  let token: string | undefined;

  if ("cookies" in req && typeof (req as NextRequest).cookies?.get === "function") {
    token = (req as NextRequest).cookies.get(ADMIN_COOKIE_NAME)?.value;
  } else {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`(?:^|; )${ADMIN_COOKIE_NAME}=([^;]*)`));
    token = match ? decodeURIComponent(match[1]) : undefined;
  }

  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Server-side RBAC Guard for API Route Handlers.
 * Verifies session, verifies database status, and enforces role authorization.
 */
export async function requireAuth(
  req: NextRequest,
  allowedRoles?: AdminRole[]
): Promise<
  | { user: AdminUser; session: AdminJWTPayload }
  | { errorResponse: NextResponse }
> {
  const session = await getAdminSession(req);

  if (!session || !session.sub) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: "Unauthorized. Authentication required." },
        { status: 401 }
      ),
    };
  }

  // Double check account in Neon PostgreSQL
  const sql = getDb();
  if (sql) {
    try {
      await initDb();
      const rows = await sql`
        SELECT id, email, first_name, last_name, role, is_active, last_login_at, created_at, updated_at
        FROM admin_users
        WHERE id = ${session.sub} LIMIT 1;
      `;

      if (!rows || rows.length === 0) {
        return {
          errorResponse: NextResponse.json(
            { success: false, error: "Account not found or revoked." },
            { status: 401 }
          ),
        };
      }

      const user = rows[0] as AdminUser;

      if (!user.is_active) {
        return {
          errorResponse: NextResponse.json(
            { success: false, error: "This admin account is disabled." },
            { status: 403 }
          ),
        };
      }

      // Check Role Permissions
      if (allowedRoles && allowedRoles.length > 0) {
        const hasPermission = allowedRoles.includes(user.role);
        if (!hasPermission) {
          return {
            errorResponse: NextResponse.json(
              {
                success: false,
                error: `Forbidden. Requires one of [${allowedRoles.join(", ")}] permissions.`,
              },
              { status: 403 }
            ),
          };
        }
      }

      return { user, session };
    } catch (e: any) {
      console.error("[requireAuth Database Check Error]", e);
    }
  }

  // Fallback in case of database unavailability during dev
  const mockUser: AdminUser = {
    id: session.sub,
    email: session.email,
    first_name: session.first_name,
    last_name: session.last_name,
    role: session.role,
    is_active: true,
    last_login_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: "Forbidden. Insufficient permissions." },
        { status: 403 }
      ),
    };
  }

  return { user: mockUser, session };
}

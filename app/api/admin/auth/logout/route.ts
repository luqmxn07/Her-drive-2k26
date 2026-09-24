import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSession } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "unknown";

  if (session) {
    await logAuditEvent({
      adminId: session.sub,
      adminEmail: session.email,
      action: "ADMIN_LOGOUT",
      resourceType: "auth",
      ipAddress: ip,
      userAgent,
    });
  }

  const response = NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );

  // Invalidate cookie
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE_NAME = "herdrive_admin_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || process.env.SESSION_SECRET || "herdrive_admin_secret_key_must_be_changed_in_production_min_32_chars";
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";
  const isAdminSubdomain = host.startsWith("admin.");

  // Handle Subdomain Mapping: admin.herdrive.com -> /admin-portal
  if (isAdminSubdomain && !pathname.startsWith("/admin-portal") && !pathname.startsWith("/api/admin")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/admin-portal/dashboard" : `/admin-portal${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Admin Portal Route Protection
  const isDashboardRoute = pathname.startsWith("/admin-portal/dashboard");
  const isLoginRoute = pathname === "/admin-portal/login";

  if (isDashboardRoute || isLoginRoute) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    let isAuthenticated = false;

    if (token) {
      try {
        await jwtVerify(token, getSecretKey());
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // 1. Unauthenticated trying to access Dashboard -> Redirect to Login
    if (isDashboardRoute && !isAuthenticated) {
      const loginUrl = new URL("/admin-portal/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      // Clean invalid cookie if present
      if (token) {
        res.cookies.delete(ADMIN_COOKIE_NAME);
      }
      return res;
    }

    // 2. Authenticated user visiting Login page -> Redirect to Dashboard
    if (isLoginRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin-portal/dashboard", req.url));
    }
  }

  // Apply strict security headers on all Admin Portal and Admin API responses
  const res = NextResponse.next();

  if (pathname.startsWith("/admin-portal") || pathname.startsWith("/api/admin")) {
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    // Prevent browser and proxy caching of sensitive administrative records
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
  }

  return res;
}

export const config = {
  matcher: [
    "/admin-portal/:path*",
    "/api/admin/:path*",
    // Also match root if coming from admin subdomain
    "/",
  ],
};

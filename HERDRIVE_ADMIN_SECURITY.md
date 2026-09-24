# HERDRIVE — Secure Admin Portal Architecture & Security Specification

Document Version: 1.0.0  
Date: 2026-09-24  
Project: HERDRIVE  
Security Boundary: Internal Administrative Portal  

---

## 1. Executive Security Architecture

The HERDRIVE Admin Portal is architected as an isolated internal control plane for administrative operations, telemetry, and waitlist management. In accordance with zero-trust principles, the administrative interface is strictly decoupled from the public marketing website:

```
                            INTERNET
                               │
                      ┌────────┴────────┐
                      │                 │
                      ▼                 ▼
                HERDRIVE SITE      ADMIN PORTAL
                  (Vercel)         (admin.herdrive.com)
                      │                 │
                      │ HTTPS           │ HTTPS (HttpOnly Session)
                      ▼                 ▼
                   ┌─────────────────────────┐
                   │     RENDER BACKEND      │
                   │                         │
                   │ Authentication          │
                   │ Authorization / RBAC    │
                   │ Validation & Throttling │
                   └───────────┬─────────────┘
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
                NEON POSTGRES        UPSTASH REDIS
                ─────────────        ─────────────
                Admin accounts       Rate limiting
                Password hashes      Brute-force protection
                Waitlist records     Failed attempt tracking
                Audit logs           Temporary state
                Persistent data      Short-lived cache
```

### Zero Direct Client Access Rule
- The client browser (both public users and admin operators) **never** establishes direct connections to Neon PostgreSQL or Upstash Redis.
- Database connection strings (`DATABASE_URL`) and Redis credentials (`UPSTASH_REDIS_REST_TOKEN` / `REDIS_URL`) reside solely in the server environment.
- The Render backend acts as the sole security boundary.

---

## 2. Admin Portal Location & Isolation

- **Domain Isolation**: Deployed via dedicated subdomain (`admin.herdrive.com`) or isolated route tier (`/admin-portal`).
- **No Public Linkage**: The Admin Portal is **never** linked from the public website, navbar, footer, sitemap, or marketing collateral.
- **Middleware Interception**: Next.js `middleware.ts` enforces authentication on all `/admin-portal/dashboard/*` routes. Unauthenticated requests are rejected and redirected to `/admin-portal/login`.
- **Search Engine Blocking**: Protected by strict `robots.txt` and `<meta name="robots" content="noindex, nofollow, nocache" />` headers.

---

## 3. Authentication & Credential Architecture

### A. Minimal Login Screen
The admin login screen is intentionally minimal:
- HERDRIVE Admin Console branding
- Username / Email input
- Password input
- Sign In button
- **Strict Exclusions**: No public registration, no "Create Account", no "Forgot Password", no password reset self-service, no social or guest logins.

### B. Password Hashing
- **Algorithm**: `bcrypt` with work factor 12 (or Argon2id).
- **Plaintext Passwords**: Never written to disk, database, Redis, logs, cookies, or API responses.
- **Hash Storage**: Stored exclusively in the persistent `admin_users` table in Neon PostgreSQL.

### C. Session & Token Management
- **Token Delivery**: Cryptographically signed JSON Web Tokens (HS256) delivered exclusively via `HttpOnly`, `Secure` (production), `SameSite=Lax` cookies named `herdrive_admin_session`.
- **Storage Location**: Cookies are never accessible to client-side JavaScript (`document.cookie`), mitigating Cross-Site Scripting (XSS) credential theft.
- **Expiration Policy**: Tokens expire after 8 hours (`Max-Age=28800`).
- **Logout Flow**: Upon invoking `POST /api/admin/auth/logout`, the server sets `Max-Age=0` to immediately discard the cookie and records an immutable `ADMIN_LOGOUT` audit event.

---

## 4. Brute-Force & Credential Stuffing Defense (Upstash Redis)

Upstash Redis is utilized for high-throughput, ephemeral security operations:
1. **IP Rate Limiting**: Maximum 15 login requests per 5-minute window per IP.
2. **Account Lockout**: After 5 consecutive failed login attempts on a specific username or IP, access is temporarily locked for 15 minutes (`LOCKOUT_WINDOW_SECONDS = 900`).
3. **Account Enumeration Prevention**: The backend emits an identical generic failure message (`"Invalid credentials."`) whether the email does not exist, the account is disabled, or the password was incorrect.
4. **Successful Login Reset**: Once valid credentials are provided, the failed login counter for that identifier is reset to zero.

---

## 5. Database Schema (Neon PostgreSQL)

### Table: `admin_users`
Primary source of truth for administrative credentials and role assignments.
```sql
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'VIEWER', -- 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_email_lower ON admin_users (LOWER(email));
```

### Table: `admin_audit_logs`
Immutable compliance and security event ledger.
```sql
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON admin_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON admin_audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_email ON admin_audit_logs (admin_email);
```

### Table: `waitlist_entries`
Waitlist data store including status workflows and internal notes.
```sql
CREATE TABLE IF NOT EXISTS waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    interest_type VARCHAR(20) NOT NULL DEFAULT 'passenger',
    status VARCHAR(20) NOT NULL DEFAULT 'waitlisted', -- 'waitlisted' | 'contacted' | 'converted' | 'archived'
    consent BOOLEAN NOT NULL DEFAULT false,
    consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_hash VARCHAR(64),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_entries_email_lower ON waitlist_entries (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created_at ON waitlist_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_status ON waitlist_entries (status);
```

---

## 6. Role-Based Access Control (RBAC) Matrix

Every protected API endpoint independently validates the admin session and verifies role permissions server-side.

| Action / Endpoint | Required Role | SUPER_ADMIN | ADMIN | VIEWER |
| :--- | :--- | :---: | :---: | :---: |
| **Inspect Dashboard Telemetry** (`GET /api/admin/stats`) | VIEWER+ | **Allowed** | **Allowed** | **Allowed** |
| **Search & View Waitlist** (`GET /api/admin/waitlist`) | VIEWER+ | **Allowed** | **Allowed** | **Allowed** |
| **Update Applicant Status** (`PATCH /api/admin/waitlist/:id`) | ADMIN+ | **Allowed** | **Allowed** | **403 Forbidden** |
| **Export Waitlist Data (CSV)** | ADMIN+ | **Allowed** | **Allowed** | **403 Forbidden** |
| **Inspect Audit Logs** (`GET /api/admin/audit-logs`) | ADMIN+ | **Allowed** | **Allowed** | **403 Forbidden** |
| **List Admin Operators** (`GET /api/admin/users`) | SUPER_ADMIN | **Allowed** | **403 Forbidden** | **403 Forbidden** |
| **Create / Revoke Operators** (CLI Tool) | Server-Side CLI | **Allowed** | **N/A** | **N/A** |

---

## 7. Admin Account Provisioning (No Public Registration)

Admin accounts are created strictly through the secure server-side provisioning script.

### Running the Creation Script
From the backend deployment server or administrative CLI:
```bash
node scripts/create-admin.mjs <email> <password> <firstName> <lastName> [role]
```

### Example:
```bash
DATABASE_URL="postgresql://..." node scripts/create-admin.mjs \
  admin@herdrive.com \
  "YourSecurePassword@2026!" \
  Priya \
  Sharma \
  SUPER_ADMIN
```

### Password Recovery Policy
There is intentionally **no "Forgot Password" or self-service password reset flow**. If an operator loses their credentials:
1. The project owner or system administrator logs into the secure server environment.
2. The administrator re-runs the provisioning script with the operator's email and a new temporary high-entropy password.
3. The script hashes the password and writes an immutable audit record (`ADMIN_UPDATED_VIA_CLI`).

---

## 8. HTTP Security Headers

The following response headers are enforced by `middleware.ts` across all admin routes:
- `X-Frame-Options: DENY`: Mitigates clickjacking.
- `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin`: Restricts cross-origin referrer leakage.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Disables unneeded browser APIs.
- `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`: Prevents caching of sensitive PII in browser histories or intermediate proxies.

---

## 9. Environment Variables Configuration

| Variable Name | Scope | Security Level | Purpose |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Server Only | **Secret** | Neon PostgreSQL pooled connection URI |
| `REDIS_URL` / `UPSTASH_REDIS_REST_URL` | Server Only | **Secret** | Upstash Redis connection string for throttling |
| `AUTH_SECRET` / `SESSION_SECRET` | Server Only | **Secret** | High-entropy key (min 32 bytes) for JWT signatures |
| `NEXT_PUBLIC_API_URL` | Client / Server | Standard | Public backend base URL |

*CRITICAL: Secret variables must never be prefixed with `NEXT_PUBLIC_` or committed to version control.*

---

## 10. Future Extensibility Architecture

The foundational Admin Console is architected to seamlessly accommodate future operational tiers:
1. **Driver Verification Workflow**: Document review, commercial license verification, and background check audits.
2. **Safety Incident Desk**: Direct tie-in with SOS slider activations, live ride polyline replay, and escalation resolution.
3. **Trip Telemetry & Dispatch**: Spatial monitoring and active driver shift management.
4. **Payouts & Financials**: Driver partner weekly earnings reconciliation.

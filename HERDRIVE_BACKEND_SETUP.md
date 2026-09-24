# HERDRIVE — Backend, Database & Admin Infrastructure Architecture Audit & Setup Plan (Phase 1)

Document Version: 1.0.0  
Date: 2026-09-24  
Project: HERDRIVE  
Repository: `luqmxn07/Her-drive-2k26`  
Status: Planning & Architecture Phase (Zero production code changes executed)

---

## 1. Existing Project Audit

A rigorous inspection of the current workspace filesystem, configuration files, source code, and dependencies was conducted. Below is the verified audit record:

### Inspected Files & Directories
- `package.json`: Contains strictly frontend client packages (`next` 16.3.6, `react` 19.2.8, `react-dom` 19.2.8, `framer-motion` 13.4.2, `lucide-react` 1.47.0, Tailwind CSS v4). No backend frameworks, no database drivers, no ORMs, and no Redis clients are installed.
- `app/`: Contains only `layout.tsx`, `page.tsx`, `globals.css`, and `favicon.ico`. There is no `app/api/` directory or server route handler.
- `components/sections/Waitlist.tsx`: Contains form state handling with client-side regex validation and an artificial `setTimeout` callback (`// Simulate serverless endpoint request`). It does not send HTTP requests or persist data.
- `lib/utils.ts`: Contains only a Tailwind CSS utility helper (`cn`).
- `types/`: Contains only UI prop types and form interface definitions (`RoleInterest`, `WaitlistFormData`, etc.).
- `.gitignore`: Correctly ignores `node_modules/`, `.next/`, `.env*`, and build outputs.
- Root directory: No `.env` or `.env.local` files exist. No `render.yaml`, `vercel.json`, `Dockerfile`, or database configuration files exist.

### Explicit Audit Determination (Items A – J)
| Question | Audit Finding | Status |
| :--- | :--- | :--- |
| **A. What is actually frontend-only?** | The entire codebase is 100% client-side React/Next.js. Every section (Navbar, Hero, Problem, Solution, How It Works, Safety, Passenger Experience, Driver Experience, Technology, Community, Waitlist, Footer) is client-rendered UI. | **Verified Frontend-Only** |
| **B. What backend functionality already exists?** | No backend process, API server, or serverless functions exist. | **Not currently implemented.** |
| **C. Is any data currently being stored?** | No user submissions or persistent data are stored. Only user theme preference (`herdrive-theme`) is stored in browser `localStorage`. | **Not currently implemented.** |
| **D. Is the waitlist form sending data anywhere?** | The form executes a simulated 800ms timer via `setTimeout` and toggles a boolean `isSubmitted` state. Zero network calls occur. | **Not currently implemented.** |
| **E. Is any database currently connected?** | No database client, connection pool, or ORM exists in the repository. | **Not currently implemented.** |
| **F. Is Upstash currently connected?** | No Redis client (`@upstash/redis` or `ioredis`) or environment variable exists. | **Not currently implemented.** |
| **G. Is Neon currently connected?** | No PostgreSQL driver (`pg`, `@neondatabase/serverless`) or connection string exists. | **Not currently implemented.** |
| **H. Is Render currently hosting an API/backend?** | There is no existing Render service, build script, or deployment pipeline for a backend in this repository. | **Not currently implemented.** |
| **I. Are there any existing API endpoints?** | The directory `app/api/` does not exist. There are zero API routes. | **Not currently implemented.** |
| **J. Are there any existing authentication mechanisms?** | No authentication library, password hasher, session manager, or JWT logic exists. | **Not currently implemented.** |

---

## 2. Target Architecture

```
                             PUBLIC USERS
                                  │
                                  ▼
                   ┌───────────────────────────────┐
                   │    HERDRIVE Public Website    │
                   │      (Hosted on Vercel)       │
                   └──────────────┬────────────────┘
                                  │
                                  │ HTTPS REST (CORS Restricted)
                                  ▼
                   ┌───────────────────────────────┐
                   │        Render Backend         │
                   │       (NestJS REST API)       │
                   │                               │
                   │  ┌─────────────────────────┐  │
                   │  │ Validation & Sanitizer  │  │
                   │  │ Rate Limiter (Throttler)│  │
                   │  │ Auth & RBAC Guards      │  │
                   │  └─────────────────────────┘  │
                   └───────┬───────────────┬───────┘
                           │               │
        Private SSL / TLS  │               │ HTTPS REST / TCP
                           ▼               ▼
          ┌─────────────────────┐     ┌─────────────────────┐
          │   Neon PostgreSQL   │     │    Upstash Redis    │
          │  (Persistent Store) │     │ (Fast Ephemeral/RL) │
          └─────────────────────┘     └─────────────────────┘
                           ▲               ▲
                           │               │
                           └───────┬───────┘
                                   │ Authenticated Privileged Calls
                   ┌───────────────┴───────────────┐
                   │     Render API Admin Tier     │
                   │     (RBAC Protected APIs)     │
                   └───────────────▲───────────────┘
                                   │
                                   │ Secure HTTPS (HttpOnly Cookie / JWT)
                                   │
                   ┌───────────────┴───────────────┐
                   │     HERDRIVE Admin Console    │
                   │  (Isolated Web App / Portal)  │
                   └───────────────────────────────┘
                                   ▲
                                   │
                           AUTHORIZED ADMINS
```

### Zero-Trust Client Boundary Rule
1. The client browser (both public users and admin users) **never** receives Neon database credentials, Upstash tokens, JWT secret keys, or internal environment configurations.
2. All SQL queries and Redis operations execute strictly inside the Render Node.js runtime.
3. Client communication with the backend is mediated solely over HTTPS with strict schema validation.

---

## 3. Database Responsibilities (Neon vs. Upstash)

| Responsibility Category | Neon PostgreSQL | Upstash Redis |
| :--- | :--- | :--- |
| **Data Nature** | Permanent, relational, ACID-compliant persistent records | Ephemeral, high-throughput, key-value data with TTL |
| **Waitlist Records** | Primary source of truth: applicant name, email, phone, role, timestamp | **Never** used for permanent waitlist storage |
| **Rate Limiting** | **Not used** (avoids database connection exhaustion) | Sliding window counters per IP to prevent spam & DDoS |
| **User & Admin Accounts**| Admin user credentials (argon2/bcrypt hashed), role definitions | **Not used** for primary user credentials |
| **Session & Token Revocation** | Long-term audit trail of login events | Active JWT blocklists, temporary session keys with auto-expiry |
| **Verification & OTP (Future)**| Verified phone status flag, verification log | Temporary 6-digit OTP codes with 5-minute TTL |
| **Audit Logs** | Immutable system activity records with indexed timestamps | **Not used** for permanent compliance logs |

---

## 4. Backend Architecture & Framework Recommendation

Consistent with the HERDRIVE Product Requirements Document (PRD), the backend is designed using **NestJS (TypeScript)**.

### Why NestJS Fits HERDRIVE:
- **Modular Enterprise Architecture**: Native dependency injection, modular controllers, services, and repository layers prevent monolithic spaghetti code.
- **Built-in Security Guards**: Native support for `@nestjs/throttler` (Redis-backed rate limiting), Passport JWT guards, and class-validator execution pipes.
- **Clean Migration Path**: Built-in support for TypeORM or Prisma for structured database migrations against Neon PostgreSQL.
- **Future Real-Time Capabilities**: When HERDRIVE expands to live driver GPS tracking, NestJS has native WebSockets (`@nestjs/websockets`) support using the same shared server process.

### Repository Organization Options
- **Recommended (Clean Monorepo Subdirectory)**: Add a `/backend` directory at the repository root containing the NestJS application with its own `package.json`, `tsconfig.json`, and build scripts.
  - Vercel root directory stays configured to `./` (frontend Next.js).
  - Render root directory is configured to `./backend`.
  - Both frontend and backend share one synchronized Git history without multi-repo drift.

### Core API Structure
```
PUBLIC ENDPOINTS (Unauthenticated, Heavily Rate-Limited):
  GET   /health                   → Safe process & subsystem health check
  POST  /api/v1/waitlist          → Public waitlist intake

ADMIN ENDPOINTS (Authenticated, RBAC Guarded):
  POST  /api/v1/admin/auth/login   → Credentials verification, issues HttpOnly cookie
  POST  /api/v1/admin/auth/logout  → Invalidate session, clear cookie
  GET   /api/v1/admin/auth/me      → Retrieve authenticated admin profile
  GET   /api/v1/admin/waitlist     → Paginated, filterable waitlist records
  GET   /api/v1/admin/waitlist/:id → Single applicant detail view
  PATCH /api/v1/admin/waitlist/:id → Update status (WAITLISTED, CONTACTED, CONVERTED, ARCHIVED)
  GET   /api/v1/admin/stats        → Aggregate KPI counters (role breakdown, velocity)
  GET   /api/v1/admin/audit-logs   → Read-only audit log stream
```

---

## 5. Waitlist Data Flow

```
1. USER SUBMISSION (Browser)
   - User completes form (Name, Email, optional Phone, Role, DPDP Consent).
   - Client validates fields and sends: POST https://api.herdrive.com/api/v1/waitlist
   
2. RENDER BACKEND (Edge Gateway & Pipeline)
   - CORS validation (Origin must match approved Vercel production domain).
   - Global Rate Limiter: Upstash Redis checks IP sliding window (e.g. max 5 submissions/hr per IP).
     * If exceeded: Return 429 Too Many Requests.
   - Validation Pipe (class-validator):
     * full_name: string, 2-100 characters, sanitized.
     * email: trimmed, normalized lowercase, valid RFC-5322 format.
     * phone: optional, E.164 international format regex.
     * interest_type: enum ('PASSENGER', 'DRIVER', 'BOTH').
     * consent: boolean, must be strictly true.

3. DUPLICATE CHECK & DATABASE PERSISTENCE (Neon PostgreSQL)
   - Backend queries Neon: SELECT id FROM waitlist_entries WHERE email = $1;
   - If exists: Return 409 Conflict ("Email already registered on priority waitlist").
   - If new: INSERT INTO waitlist_entries (...) VALUES (...) RETURNING id, status, created_at;

4. RESPONSE
   - Backend returns 201 Created: { success: true, message: "Registered successfully" }.
   - Frontend displays celebratory success card with submitted email and role.
```

---

## 6. Neon PostgreSQL Database Schema

### Table: `waitlist_entries`
```sql
CREATE TYPE waitlist_role AS ENUM ('PASSENGER', 'DRIVER', 'BOTH');
CREATE TYPE waitlist_status AS ENUM ('WAITLISTED', 'CONTACTED', 'CONVERTED', 'ARCHIVED');

CREATE TABLE waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NULL,
    interest_type waitlist_role NOT NULL DEFAULT 'PASSENGER',
    status waitlist_status NOT NULL DEFAULT 'WAITLISTED',
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_hash VARCHAR(64) NULL, -- SHA-256 hash of IP for abuse prevention without storing raw PII
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint on lowercase email to prevent case-variant duplication
CREATE UNIQUE INDEX idx_waitlist_entries_email_lower ON waitlist_entries (LOWER(email));

-- Fast filtering indexes for Admin Console
CREATE INDEX idx_waitlist_entries_status ON waitlist_entries (status);
CREATE INDEX idx_waitlist_entries_role ON waitlist_entries (interest_type);
CREATE INDEX idx_waitlist_entries_created_at ON waitlist_entries (created_at DESC);
```

### Table: `admin_users`
```sql
CREATE TYPE admin_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'VIEWER');

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    role admin_role NOT NULL DEFAULT 'VIEWER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_admin_users_email ON admin_users (LOWER(email));
```

### Table: `admin_audit_logs`
```sql
CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    action VARCHAR(64) NOT NULL, -- e.g., 'ADMIN_LOGIN', 'WAITLIST_STATUS_UPDATE'
    target_resource VARCHAR(64) NOT NULL, -- e.g., 'waitlist_entries'
    target_id UUID NULL,
    details JSONB NULL, -- Diff or contextual payload (strictly sans passwords)
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_admin_id ON admin_audit_logs (admin_id);
CREATE INDEX idx_audit_logs_action ON admin_audit_logs (action);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs (created_at DESC);
```

---

## 7. Security Architecture

1. **Password Hashing**: Uses Argon2id (or bcrypt with work factor 12). Plaintext passwords never touch logs or databases.
2. **Session & Token Management**:
   - Authentication tokens are delivered strictly via **`HttpOnly`, `Secure`, `SameSite=Strict` cookies**.
   - Tokens are **never** stored in browser `localStorage` or `sessionStorage` (mitigating XSS extraction attacks).
3. **Role-Based Access Control (RBAC)**:
   - `SUPER_ADMIN`: User management, status mutation, data export, system configuration.
   - `ADMIN`: View, search, update waitlist status, add internal notes.
   - `VIEWER`: Read-only aggregate stats and list inspection.
4. **Brute Force & Credential Stuffing Defense**:
   - Upstash Redis tracks failed login attempts per email/IP (max 5 failed attempts per 15 minutes before temporary lockout).
5. **HTTP Security Headers**:
   - Strict-Transport-Security (HSTS: max-age=31536000; includeSubDomains)
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Content-Security-Policy (CSP) tailored for the API.

---

## 8. Admin Console Architecture

### Separation of Concerns
The Admin Console is treated as a separate security perimeter:
- **Public Domain**: `herdrive.com` (Vercel)
- **Admin Domain / Route**: Subdomain `admin.herdrive.com` (or protected routing tier)
- **API Domain**: `api.herdrive.com` (Render)

### Access Pattern
```
ADMIN OPERATOR
     │
     ▼
Admin Web App (admin.herdrive.com)
     │
     │ 1. POST /api/v1/admin/auth/login
     ▼
Render Backend API
     │ 2. Verifies Argon2 password against Neon
     │ 3. Sets HttpOnly session cookie
     ▼
Subsequent Requests (GET /api/v1/admin/waitlist)
     │ Cookie automatically attached via HTTPS
     ▼
Render Backend verifies session + role permissions
     ▼
Fetches filtered dataset from Neon PostgreSQL
```

---

## 9. CORS (Cross-Origin Resource Sharing)

The backend explicitly prohibits wildcard (`*`) origins.

### Production Policy
```typescript
const allowedOrigins = [
  'https://herdrive.com',
  'https://www.herdrive.com',
  'https://admin.herdrive.com',
];

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
```

### Development Policy
- Allows `http://localhost:3000` (Next.js frontend) and `http://localhost:3001` (Admin dev port).

---

## 10. Environment Variables Specification

### Frontend (`.env.local` / Vercel Environment Variables)
| Variable Name | Environment | Description | Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Production | Base URL of deployed Render backend | `https://herdrive-api.onrender.com` |
| `NEXT_PUBLIC_API_URL` | Development | Local backend URL | `http://localhost:4000` |

### Backend (`.env` / Render Secret Environment Variables)
| Variable Name | Security Level | Description | Example |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Standard | Runtime environment | `production` / `development` |
| `PORT` | Standard | Port for HTTP listener | `4000` (Render overrides to 10000) |
| `DATABASE_URL` | **Confidential** | Neon PostgreSQL pooled connection string | `postgresql://user:pass@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | **Confidential** | Neon non-pooled connection (for migrations) | `postgresql://user:pass@ep-xyz.region.neon.tech/neondb?sslmode=require` |
| `UPSTASH_REDIS_REST_URL`| **Confidential** | Upstash Redis HTTPS REST endpoint | `https://rapid-fox-1234.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN`| **Confidential** | Upstash Redis authentication bearer token | *(Hidden)* |
| `JWT_SECRET` | **Confidential** | High-entropy secret for signing admin tokens | *(64-char hex string)* |
| `COOKIE_SECRET` | **Confidential** | Secret for signing secure session cookies | *(64-char hex string)* |
| `FRONTEND_URL` | Standard | Origin for CORS validation | `https://herdrive-2k26.vercel.app` |

---

## 11. Step-by-Step Neon PostgreSQL Setup Plan

1. **Project Creation**: Log in to [Neon Console](https://console.neon.tech/) and click **Create Project**. Name the project `herdrive-prod`.
2. **Database Provisioning**: Ensure PostgreSQL version 16 is selected in the AWS region closest to users (e.g., `ap-south-1` Mumbai or `ap-southeast-1` Singapore).
3. **Connection Strings Acquisition**:
   - Copy the **Pooled connection string** (uses Neon's built-in PgBouncer on port 5432 or 6543) for runtime queries (`DATABASE_URL`).
   - Copy the **Direct connection string** for database migrations (`DIRECT_URL`).
4. **Render Secret Configuration**: Navigate to the Render Dashboard → Backend Web Service → **Environment**, and paste `DATABASE_URL` and `DIRECT_URL`.
5. **ORM & Migration Tool Selection**: Use Prisma or TypeORM in `/backend`.
6. **Migration Execution**:
   - Run `npx prisma migrate deploy` (or TypeORM migration runner) as part of the Render build command.
7. **Connection Verification**: Execute health check query (`SELECT 1;`) on backend boot.
8. **Indexes & Constraints Check**: Verify `idx_waitlist_entries_email_lower` enforces case-insensitive uniqueness.

---

## 12. Step-by-Step Upstash Redis Setup Plan

1. **Database Creation**: Log in to [Upstash Console](https://console.upstash.io/) and create a Redis database named `herdrive-cache`.
2. **Region Matching**: Select the same cloud region as Render/Neon to minimize round-trip latency (<15ms).
3. **Credentials Collection**:
   - Copy `UPSTASH_REDIS_REST_URL`.
   - Copy `UPSTASH_REDIS_REST_TOKEN`.
4. **Render Secret Storage**: Store both credentials in Render's Environment settings.
5. **Client Configuration**:
   - Install `@upstash/redis` in `/backend`.
   - Instantiate Redis client using native HTTPS REST protocol, which avoids persistent connection limits on serverless and container restarts.
6. **Rate Limiter Initialization**: Attach `@upstash/ratelimit` to the `/api/v1/waitlist` and `/api/v1/admin/auth/login` route guards.
7. **Connection Test**: Perform a ping test (`redis.ping()`) on backend startup.

---

## 13. Step-by-Step Render Deployment Plan

1. **Repository Link**: In the [Render Dashboard](https://dashboard.render.com/), click **New +** → **Web Service** and connect repository `luqmxn07/Her-drive-2k26`.
2. **Service Configuration**:
   - **Name**: `herdrive-api`
   - **Region**: Matching database region (e.g., Singapore / Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `backend` (or root if scripts are configured at top-level)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
3. **Environment Variables**: Add all variables documented in Section 10.
4. **Health Check Path**: Configure `/health` as the Health Check Path in Render settings so zero-downtime rolling deploys only switch traffic once the health check passes.
5. **Auto-Deploy**: Enabled on pushes to `main`.

---

## 14. Vercel → Render Connection Plan

1. **Render Public URL**: Once Render finishes deployment, note the public API domain (e.g., `https://herdrive-api.onrender.com`).
2. **Vercel Environment Setup**:
   - In Vercel Project Settings → **Environment Variables**, create:
     - `NEXT_PUBLIC_API_URL` = `https://herdrive-api.onrender.com`
     - Environment targets: **Production**, **Preview**, and **Development**.
3. **Frontend Integration**:
   - Update `components/sections/Waitlist.tsx` to read `process.env.NEXT_PUBLIC_API_URL`.
   - Replace the mock `setTimeout` with a fetch request:
     ```typescript
     const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
     const response = await fetch(`${apiUrl}/api/v1/waitlist`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData),
     });
     ```
   - Handle response status codes (201 Created, 409 Conflict, 429 Rate Limit, 400 Validation Error).

---

## 15. Health Check Design (`GET /health`)

The health endpoint provides observability without exposing sensitive configuration:

### Public Response (`GET /health`)
```json
{
  "status": "ok",
  "timestamp": "2026-09-24T17:15:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "cache": "connected"
  }
}
```
*HTTP Status 200 returned if all services are operational; HTTP Status 503 Service Unavailable returned if Neon or Redis fails.*

---

## 16. Logging & Monitoring Strategy

1. **PII & Credential Scrubbing**: Interceptor automatically scrubs fields labeled `password`, `token`, `authorization`, `cookie`, and masks credit cards or full phone numbers in standard logs.
2. **Structured JSON Logs**:
   ```json
   {
     "level": "info",
     "timestamp": "2026-09-24T17:15:02.124Z",
     "requestId": "req_8f9e12ab",
     "method": "POST",
     "path": "/api/v1/waitlist",
     "statusCode": 201,
     "durationMs": 42,
     "ipHash": "a1b2c3..."
   }
   ```
3. **Log Ingestion**: Monitored via Render standard log streams, with optional integration to Datadog or BetterStack as user volume scales.

---

## 17. Admin Dashboard Capabilities & Workflow

The Admin Console interface will offer:
- **Executive KPI Cards**: Total Registrations, New (Last 24h), Passengers Count, Drivers Count, Conversion Ratio.
- **Searchable Waitlist Table**: Real-time filtering by role, status, and search by name/email.
- **Status Lifecycle Control**: Transitions between `WAITLISTED` → `CONTACTED` → `CONVERTED` / `ARCHIVED`.
- **Export Data**: Secure CSV export restricted to `SUPER_ADMIN` and `ADMIN` roles.
- **Audit History**: Complete stream of administrative actions showing who modified which submission.

---

## 18. Future Transactional Email Notification Design

When email capabilities are activated in a subsequent phase:
- **Provider**: Dedicated transactional email API (e.g. Resend, Amazon SES, or SendGrid) using domain-verified DKIM/SPF (`no-reply@herdrive.com`).
- **Policy**: Personal Gmail passwords or SMTP credentials will **never** be used in backend code.
- **Workflow**: Asynchronous background dispatch triggered upon successful database write.

---

## 19. Implementation Phases

```
[Phase 1] Architecture Audit & Setup Plan (Completed & Documented)
    │
    ▼
[Phase 2] Backend Project Foundation (NestJS scaffold in /backend, TypeScript, Scripts)
    │
    ▼
[Phase 3] Neon PostgreSQL Integration (Connection Pool, Prisma/TypeORM, Migrations)
    │
    ▼
[Phase 4] Upstash Redis Integration (REST client, Rate Limiter Guards)
    │
    ▼
[Phase 5] Waitlist REST API (Validation, Duplication check, Safe error responses)
    │
    ▼
[Phase 6] Vercel ↔ Render Integration (NEXT_PUBLIC_API_URL, Live form connection)
    │
    ▼
[Phase 7] Admin Authentication Foundation (Argon2, HttpOnly Secure JWT Cookies, RBAC)
    │
    ▼
[Phase 8] Admin Management APIs (Waitlist CRUD, Metrics, Audit Log streaming)
    │
    ▼
[Phase 9] Admin Console Web Interface (Protected Next.js portal or secure dashboard)
    │
    ▼
[Phase 10] Transactional Notifications (Resend / SES Integration)
```

---

## 20. Human Action Checklist (Manual Steps Required Outside IDE)

To maintain absolute security, **never paste real credentials into chat or source code**. You will only need to configure them directly in your cloud dashboards:

1. **Neon Dashboard**:
   - [ ] Create free tier project `herdrive-prod` at [console.neon.tech](https://console.neon.tech/).
   - [ ] Copy the pooled connection string into a secure password manager.
2. **Upstash Dashboard**:
   - [ ] Create free tier Redis database `herdrive-cache` at [console.upstash.io](https://console.upstash.io/).
   - [ ] Copy the REST URL and REST Token into a secure password manager.
3. **Render Dashboard**:
   - [ ] Create account at [render.com](https://render.com/).
   - [ ] Connect your GitHub repository `luqmxn07/Her-drive-2k26`.
   - [ ] In the service's Environment settings, insert the secrets (`DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `JWT_SECRET`).
4. **Vercel Dashboard**:
   - [ ] Under your existing HERDRIVE project settings → **Environment Variables**, add `NEXT_PUBLIC_API_URL` pointing to your Render service once live.

---

*This document serves as the formal architectural specification for HERDRIVE's backend infrastructure. Implementation will begin with Phase 2 upon human review and approval.*

# HERDRIVE — ANTIGRAVITY PROJECT CONTEXT

Last Updated: 2026-09-24
Current Development Status: Secure Admin Portal + Full-Stack Backend Foundation Completed

---

# 1. PROJECT IDENTITY

Project:
HERDRIVE

Purpose:
A ride-sharing platform focused on empowering women on the move, prioritizing safety, community, and tailored experiences for female drivers and passengers.

Current Goal:
Operate public marketing landing page to acquire waitlist registrations, backed by Neon PostgreSQL and Upstash Redis, alongside a completely isolated, secure internal Admin Portal with RBAC, session management, and waitlist management.

Project Stage:
Production-Ready Landing Page + Secure Admin Console Foundation (RBAC, JWT HttpOnly sessions, Upstash brute-force guard, Neon persistent audit logs and admin credentials, zero public links)

---

# 2. CURRENT DEVELOPMENT STATE

Overall Status:
The public HERDRIVE website is visually finalized and live with Neon PostgreSQL waitlist persistence and Upstash Redis rate limiting. A separate, secure internal Admin Portal (`/admin-portal` with `admin.<domain>` subdomain routing support) has been implemented and tested.

Working Features:
- **Public Landing Page**:
  - Fully responsive Next.js landing page (12 sections)
  - V3 Visual Brand Identity (Light / Dark theme support, official assets)
  - Live waitlist signup via `/api/waitlist` with Neon PostgreSQL persistence and duplicate protection
  - Upstash Redis rate limiting and real-time counter tracking
  - DPDP Act consent compliance
  - Zero admin references in public navbar, footer, or sitemap
- **Secure Admin Portal**:
  - Isolated Admin Console at `/admin-portal` (supporting dedicated `admin.<domain>` routing via `middleware.ts`)
  - Minimal, security-hardened Admin Login (no sign-up, no forgot password, generic 401 errors)
  - Password hashing with bcryptjs (cost factor 12)
  - Authenticated sessions using signed JWTs in `HttpOnly`, `Secure`, `SameSite=Lax` cookies
  - Upstash Redis brute-force protection (5 failed attempts trigger 15-minute IP/account lockout)
  - Server-side Role-Based Access Control (RBAC: `SUPER_ADMIN`, `ADMIN`, `VIEWER`)
  - Neon PostgreSQL persistent admin storage (`admin_users`, `admin_audit_logs`, `waitlist_entries`)
  - Admin APIs: `/api/admin/auth/*`, `/api/admin/waitlist/*`, `/api/admin/stats`, `/api/admin/audit-logs`, `/api/admin/users`
  - Admin Dashboard Console with aggregate metrics, status charts, 14-day histogram, and waitlist table with search, filter, pagination, notes, and status updates
  - Immutable Audit Logging for administrative actions with password/credential redaction
  - Server-side CLI provisioning script (`scripts/create-admin.mjs`) for manual admin creation
  - Strict security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`)

Incomplete Features:
- Live driver ride dispatch / mobile apps (Future Roadmap)

Currently In Progress:
- Admin Portal deployment and initial SUPER_ADMIN provisioning

Blocked Items:
- None

Known Problems:
- None

---

# 3. TECHNOLOGY STACK

Frontend:
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion (Animations)
- Lucide React (Icons)
- TypeScript

Backend & Security:
- Next.js Server Components & Route Handlers
- bcryptjs (Work factor 12)
- jose (Signed JWT authentication)
- Security Middleware (Subdomain rewriting, session validation, route guards)

Database:
- Neon (Serverless PostgreSQL) — Admin accounts, password hashes, waitlist records, audit logs
- Upstash (Serverless Redis) — Login rate limiting, brute-force lockout, temporary caches

Hosting:
- Vercel (Public website / Admin Portal)
- Render (API backend services / alternative full-stack host)

---

# 4. PROJECT STRUCTURE

```text
c:\Users\wwwar\Documents\herdrive landing page\
├── app/                  # Next.js App Router pages and global layouts
│   ├── globals.css       # Global styles and Tailwind configuration
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main landing page assembly
├── components/
│   ├── sections/         # Major landing page sections (Hero, Safety, Waitlist, etc.)
│   └── ui/               # Reusable UI components (Button, Card, PhoneMockup, etc.)
├── lib/                  # Utility functions (utils.ts)
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── package.json          # Project dependencies
```

---

# 5. ARCHITECTURE

The current architecture is a statically generated frontend application using Next.js App Router.
Data flow is purely internal state (React) at this time. 
Future architecture will involve Next.js API routes or a separate backend on Render communicating with Neon and Upstash databases.

---

# 6. DESIGN SYSTEM / UI RULES

- **Typography**: Modern, clean sans-serif (Inter/system default via Tailwind).
- **Color System**: Curated, harmonious palettes (not default red/blue). Dark mode support and premium aesthetics.
- **Micro-animations**: Widespread use of Framer Motion for scroll reveals, hover states, and dynamic interactive elements (like the SOS slider).
- **Glassmorphism**: Utilized for premium feel on cards and overlays.
- **Responsiveness**: Mobile-first design principles using Tailwind breakpoints.

---

# 7. IMPORTANT PROJECT DECISIONS

### Decision: Vercel for Frontend Deployment
Date: 2026-09-24
Reason: Native Next.js support, zero-config deployment.
Decision: Deploy the frontend repository directly to Vercel.
Impact: CI/CD is automatically handled by Vercel upon pushing to the `main` branch.

### Decision: Proprietary License
Date: 2026-09-23
Reason: HERDRIVE is a proprietary startup product.
Decision: Added an "All Rights Reserved" license to protect source code.
Impact: Repository is kept private and source code is restricted.

### Decision: V2 Brand Color Palette & Official Logo Asset Integration
Date: 2026-09-24
Reason: Transition from prototype to distinctive, premium mobility-tech brand identity.
Decision: Adopted Deep Plum (#211827), Electric Violet (#7C3AED), Soft Lavender (#EDE9FE), Warm White (#FAF9F7), Charcoal (#242124), Emergency (#DC2626). Integrated official rounded road-H app icon.
Impact: Unified brand presentation across all touchpoints without stereotypical pink aesthetics.

---

# 8. COMPLETED WORK

### 2026-09-23 — Initial Commit: HERDRIVE Landing Page MVP
Status: COMPLETED
Summary:
- Built the complete frontend static landing page with 12 sections.
Files/Areas:
- `app/*`, `components/sections/*`, `components/ui/*`
Validation:
- Build: PASS
- Lint: PASS
Git Commit:
48ee86f

### 2026-09-23 — Add Proprietary License
Status: COMPLETED
Summary:
- Added LICENSE file.
Files/Areas:
- `LICENSE`
Git Commit:
3f5d94e

### 2026-09-24 — Frontend V2 Visual Update & Polish
Status: COMPLETED
Summary:
- Replaced color system with Deep Plum (#211827), Electric Violet (#7C3AED), Warm White (#FAF9F7), Charcoal (#242124).
- Added official HERDRIVE logo app icon across Navbar, Footer, and Phone Mockups.
- Refined conceptual passenger & driver app mockups.
- Responsibly framed technical and safety claims.
- Tested interactive SOS slider state transitions in browser.
- Deployed frontend to Vercel.
Files/Areas:
- `app/globals.css`, `app/layout.tsx`, `components/sections/*`, `components/ui/*`, `public/brand/*`
Validation:
- Build: PASS
- Lint: PASS
- Browser Verification: PASS

---

# 9. CURRENT TASK

Current Objective:
Deliver Frontend V2 visual polish and record release management changes.

Current Task:
Commit and push V2 frontend updates to GitHub (triggering automatic Vercel deployment).

Progress:
- V2 design and color tokens applied across all components.
- Browser test passed with zero errors.
- Documentation (CHANGELOG.md, commit-history.json) updated.

Next Steps:
1. Stage and commit V2 changes cleanly.
2. Push to GitHub remote `origin main`.
3. Proceed with backend & database planning (Neon/Upstash/Render).

---

# 10. NEXT PRIORITIES

Priority 1:
Commit and push V2 frontend to trigger live Vercel production update.

Priority 2:
Plan database schema and connection for Neon (PostgreSQL) and Upstash (Redis).

Priority 3:
Implement waitlist submission API endpoint.

---

# 11. KNOWN BUGS

None currently identified. All components render cleanly with zero console errors.

---

# 12. TECHNICAL DEBT

- Waitlist form currently operates in frontend simulation mode (no persistent database storage yet).

---

# 13. EXTERNAL SERVICES / APIs

Service: Vercel
Purpose: Frontend hosting & continuous deployment
Current Status: Active (Connected to `luqmxn07/Her-drive-2k26`)

Service: GitHub
Purpose: Version control
Current Status: Active (`luqmxn07/Her-drive-2k26`)

---

# 14. ENVIRONMENT VARIABLES

No environment variables are currently required for the static frontend.

---

# 15. SECURITY NOTES

- The codebase is proprietary; repository must remain private.
- No secrets or API keys are currently present in the codebase.
- Future database credentials must strictly use `.env` files and never be committed.

---

# 16. GIT / VERSION HISTORY

### Initial MVP (Pre-release)
Date: 2026-09-24
Commit: 3f5d94e
Purpose: Static landing page baseline.
Stable State: Yes (Frontend UI only)

---

# 17. DEPLOYMENT

Current Hosting: None (Planned: Vercel)
Production URL: TBD
Deployment Method: GitHub Integration

---

# 18. IMPORTANT USER REQUIREMENTS

- Treat `ANTIGRAVITY_CONTEXT.md` as the source of truth for AI sessions.
- Maintain a strictly clean Git history (no force pushes unless explicitly authorized).
- Pre-commit checklist required (Build, Lint, Secret Scan).
- Design aesthetics must remain premium and dynamic (no generic/basic UIs).
- Record machine-readable history in `docs/commit-history.json`.

---

# 19. THINGS THAT MUST NOT BE CHANGED WITHOUT REVIEW

- Established premium UI/UX design system and Framer Motion animations.
- Proprietary licensing.

---

# 20. CURRENT SESSION SUMMARY

Date: 2026-09-24
Session Objective: Establish Git rules and create project context file.

Completed:
- Acknowledged strict Git and release-management rules.
- Created `ANTIGRAVITY_CONTEXT.md`.

Changed:
- Added `ANTIGRAVITY_CONTEXT.md` to root.

Next Recommended Step:
- Create `docs/CHANGELOG.md` and `docs/commit-history.json`, then commit the documentation setup.

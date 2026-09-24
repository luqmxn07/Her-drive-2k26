# HERDRIVE Changelog

All notable changes to the HERDRIVE platform are documented in this file.

## 2026-09-24

### feat: add secure HERDRIVE admin portal foundation

Time: 23:25 IST

Changes:
- **Architecture & Isolation**:
  - Isolated Admin Portal foundation at `/admin-portal` with native subdomain rewrite support (`admin.<domain>`) via `middleware.ts`.
  - Zero links or mentions on public HERDRIVE website, navbar, footer, marketing sections, or public sitemaps.
  - Browser-to-database direct access strictly forbidden; all traffic flows through authenticated API guards.
- **Authentication & RBAC Foundation**:
  - Server-side password hashing using `bcryptjs` (cost factor 12) with zero plaintext credential persistence.
  - No public registration, sign-up, or forgot password endpoints.
  - Generic authentication errors (`"Invalid credentials."`) preventing user enumeration.
  - Secure signed session tokens via `jose` stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies.
  - 3-tier Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `VIEWER`) enforced server-side on all admin API routes.
- **Brute-Force & Attack Protection**:
  - Upstash Redis login rate limiting and failed attempt tracking (5 failed attempts trigger 15-minute lockout).
  - Memory-safe fallbacks for resilient development.
  - Automatic IP and account lockouts with generic error feedback.
- **Neon PostgreSQL Schemas & Storage**:
  - `admin_users`: ID, email, password_hash, first_name, last_name, role, is_active, last_login_at, created_at, updated_at.
  - `admin_audit_logs`: ID, admin_id, admin_email, action, resource_type, resource_id, metadata (auto-sanitized, passwords/tokens redacted), ip_address, user_agent, created_at.
  - `waitlist_entries`: Enhanced with optional `notes` column for operational follow-ups.
- **Admin APIs & Management**:
  - `POST /api/admin/auth/login`: Throttled authentication, JWT issuance, audit event.
  - `POST /api/admin/auth/logout`: Session cookie revocation, audit event.
  - `GET /api/admin/auth/me`: Current session inspection (passwords/hashes stripped).
  - `GET /api/admin/waitlist`: RBAC-protected waitlist query with search, role filter, status filter, and pagination.
  - `GET` & `PATCH /api/admin/waitlist/[id]`: Status and internal notes updates (SUPER_ADMIN and ADMIN only; VIEWER gets 403).
  - `GET /api/admin/stats`: Aggregate KPIs (passengers, drivers, conversion rates, 14-day histogram).
  - `GET /api/admin/audit-logs`: Paginated audit log stream with metadata inspector.
  - `GET /api/admin/users`: Operator management for SUPER_ADMIN.
- **Admin Console UI**:
  - Minimal, distraction-free Admin Login screen matching enterprise HERDRIVE brand tokens.
  - Admin Dashboard Overview with live stat cards, status breakdown chart, and 14-day velocity graph.
  - Waitlist Management Console with search, multi-filter pills, CSV export, and status update drawer.
  - Audit Log Explorer with raw JSON event metadata inspector.
  - Role-protected System Settings & RBAC hierarchy matrix.
- **CLI Provisioning Tool**:
  - `scripts/create-admin.mjs`: Server-side script for initial project owner operator provisioning with secure prompts.
- **Documentation**:
  - Created `HERDRIVE_ADMIN_SECURITY.md` covering architecture, security boundary, schema diagrams, RBAC policies, and runbooks.

### feat: update HERDRIVE frontend with new brand identity

Time: 22:42 IST

Changes:
- **New Brand Asset Integration**: Replaced legacy shield and purple-only icons with the official HERDRIVE brand assets from `icons/`:
  - `public/brand/her-drive-light.png`: Light theme emblem badge (stylized woman silhouette "H", curved road to "D", pink pin marker, heart accent, "Safe Rides • Women First")
  - `public/brand/her-drive-dark.png`: Dark theme counterpart with glowing rim and deep plum backdrop
  - `public/brand/her-drive-banner.png`: Social share banner & brand reference guide
  - Synced `favicon.png` and `apple-touch-icon.png` with official new brand asset
- **Centralized Brand Token System**: Derived and configured the complete color system in `app/globals.css`:
  - Soft Pink (`#F472B6`, `#FBCFE8`, `#FDE7F3`)
  - Rose Pink (`#FB7185`, `#F43F5E`)
  - Purple & Mauve (`#7C3AED`, `#A855F7`, `#6B46C1`)
  - Lavender (`#C084FC`, `#EDE9FE`)
  - Deep Plum Background & Surfaces (`#0F0524`, `#1E0B3D`, `#2D1B4E`)
  - Warm White Surfaces (`#FFFAFC`, `#FAF9F7`)
  - Dedicated Emergency Red (`#E11D48`, `#DC2626`)
- **Full Landing Page Section Refresh**:
  - **Navbar**: Light/Dark dynamic logo switching, refined glassmorphism, pink-purple gradient CTA.
  - **Hero**: Gradient headline on *"Ride Confidently."*, soft pink/lavender backdrop, pink route mockup.
  - **Problem**: Warm white surfaces with pink/lavender category pills and mauve icons.
  - **Solution**: 4 pillars redesigned with gradient icon badges and subtle pink accents.
  - **How It Works**: 5-step numbered indicators with pink gradient connecting timeline.
  - **Safety**: Deep plum & deep violet operational safety suite with `#E11D48` SOS slider.
  - **Passenger App Mockup**: Cohesive in-app experience featuring pink route, standard/premium tiers, and PIN security.
  - **Driver App Mockup**: Dark plum ecosystem app with multi-stop dispatch, earnings card, and safety controls.
  - **Technology**: Deep plum & violet architecture flow diagram with refined platform engine card.
  - **Community**: Value cards aligned with pink/lavender brand accents.
  - **Waitlist**: Soft blush backdrop, warm white form card, gradient role pills, and DPDP consent.
  - **Footer**: Deep plum footer with official dark logo, pink tagline, and social links.
- **QA & Testing**: Verified clean production build (`npm run build`) with Turbopack, and conducted browser testing across light/dark themes and desktop/mobile viewports.


Time: 20:48 IST

Changes:
- Added `@neondatabase/serverless` and `ioredis` drivers
- Created `lib/db.ts` with automated Neon database schema initialization (auto-creates `waitlist_entries` table and unique lowercase email index)
- Created `lib/redis.ts` for Upstash Redis rate limiting and real-time submission counters
- Implemented `app/api/waitlist/route.ts` with CORS handling, duplicate validation, and data persistence
- Replaced simulated waitlist timeout in `components/sections/Waitlist.tsx` with live `fetch` calls to `/api/waitlist`
- Verified end-to-end build (Turbopack) and route generation

### feat: add light and dark theme mode with dynamic logo switching

Time: 17:05 IST

Changes:
- Added `ThemeProvider` and `ThemeContext` supporting light and dark themes with localStorage persistence
- Set Light Theme as default per user request
- Configured dynamic logo switching:
  - Default Light Theme uses `/brand/herdrive icon light.png`
  - Dark Theme uses `/brand/herdrive icon dark.png`
- Added Sun/Moon theme switcher button in desktop navigation and mobile navigation drawer
- Applied complementary rich dark palette styling across all landing page sections (Hero, Problem, Solution, HowItWorks, PassengerExperience, DriverExperience, Community, Waitlist, and UI cards/badges)
- Verified build and visual toggle behavior in browser

### feat: refresh HERDRIVE frontend with new brand palette and V2 polish

Time: 16:30 IST

Changes:
- Integrated official HERDRIVE logo app icon across Navbar, Footer, and Phone Mockups
- Updated color system to Deep Plum (#211827), Electric Violet (#7C3AED), Soft Lavender (#EDE9FE), Warm White (#FAF9F7), Charcoal (#242124), Emergency (#DC2626)
- Refined typography and spacing on Hero, Problem, Solution, Safety, Passenger, Driver, and Waitlist sections
- Formatted technical and safety claims responsibly (continuous GPS route monitoring, route deviation alerts, dedicated incident support)
- Enhanced interactive phone mockups for Passenger and Driver applications
- Verified interactive SOS slider state transition
- Retained waitlist form in simulated frontend-only mode with DPDP Act consent
- Added favicon.png and apple-touch-icon.png with OpenGraph social metadata

Affected:
- app/globals.css
- app/layout.tsx
- components/sections/Navbar.tsx
- components/sections/Hero.tsx
- components/sections/Problem.tsx
- components/sections/Solution.tsx
- components/sections/HowItWorks.tsx
- components/sections/Safety.tsx
- components/sections/PassengerExperience.tsx
- components/sections/DriverExperience.tsx
- components/sections/Technology.tsx
- components/sections/Community.tsx
- components/sections/Waitlist.tsx
- components/sections/Footer.tsx
- components/ui/Button.tsx
- components/ui/Card.tsx
- components/ui/Badge.tsx
- components/ui/PhoneMockup.tsx
- components/ui/SOSSlider.tsx
- public/brand/*
- public/favicon.png
- public/apple-touch-icon.png

Validation:
- Build: PASS (Next.js 16 Turbopack)
- Lint: PASS
- Browser Visual Verification: PASS

Security:
- Secret scan: PASS (Zero secrets or credentials committed)
- No .env files or API keys

Stability:
- Stable checkpoint: YES

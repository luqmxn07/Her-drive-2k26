# HERDRIVE Changelog

All notable changes to the HERDRIVE platform are documented in this file.

## 2026-09-24

### feat: implement live Neon PostgreSQL and Upstash Redis waitlist API integration

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

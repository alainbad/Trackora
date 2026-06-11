# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 5173
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Serve production build locally
```

## Stack

- **React 19 + TypeScript** via Vite 8
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.js`; theme tokens live in `src/index.css` under `@theme`
- **React Router v7** for client-side routing (all routes in `src/App.tsx`)
- **Supabase** for auth + database (`src/lib/supabase.ts`); client is null-safe (returns `null` when env vars missing)
- **Lucide React v1.16** for icons — brand icons (GitHub, Twitter, LinkedIn) do NOT exist; use generic alternatives
- **Framer Motion** installed and available

## Styling convention

All components use **inline styles only** — never Tailwind utility classes inside components. Tailwind `@layer utilities` in `index.css` defines shared helpers (`.glass`, `.glass-strong`, `.glow-indigo`, `.text-gradient`, `.bg-mesh`, `.grid-lines`, keyframes).

Design tokens:
- Background: `#0a0f1e`
- Primary: `#6366f1` / `#4f46e5` (indigo)
- Accent: `#22d3ee` (cyan)
- Text: `#f8fafc`
- Cards: `rgba(255,255,255,0.03–0.08)` with `border: 1px solid rgba(255,255,255,0.07–0.12)`
- Dropdown/select background: `#0f1629` (solid, required for browser dropdown lists)

## Architecture

### Routing (`src/App.tsx`)
All routes are lazy-loaded via `React.lazy`. Key route groups:
- `/` Home, `/track/:trackingId?`, `/dashboard`, `/rates`, `/plans`
- `/tools`, `/customs-duty`, `/detention-calculator`, `/profit-calculator`, `/document-generator`
- `/ports/:slug`, `/airports/:slug` — both handled by `PortLandingPage` with `type` + `slug` props
- `/track/dhl`, `/track/container`, etc. — SEO landing pages via `FreightLandingPage`
- `/carriers/:slug`, `/blog/:slug` — parameterized pages

### Auth & Profile (`src/contexts/`)
- `AuthContext` — wraps Supabase auth, exposes `user`, `session`, `signIn`, `signOut`
- `ProfileContext` — fetches `profiles` table row, exposes `profile`, `planTier` (`'free' | 'pro' | 'business'`), `updateProfile`, `uploadAvatar`. On login, automatically applies any pending Gumroad upgrade from `pending_plan_upgrades` table.

### Plan gating
- `planTier` from `useProfile()` is the source of truth
- Pro/Business features check `planTier === 'free'` and show `<UpgradeModal>` (`src/components/ui/UpgradeModal.tsx`)
- All Gumroad upgrade URLs must include `?offer_code=LAUNCH`: `https://badranalain.gumroad.com/l/impejho?offer_code=LAUNCH` (Pro), `https://badranalain.gumroad.com/l/rconap` (Business/Enterprise)

### Data layer
- `src/data/mockShipments.ts` — static demo shipments for `/track`. Demo IDs: `1Z999AA10123456784`, `MAD3456789`, `MAWB001-12345678`, `CNTR8872341`
- `src/data/shippingRates.ts` — express courier rate tables + `COUNTRIES` array (ISO + name)
- `src/data/shippingCities.ts` — `getCities(iso)` returns airport options per country
- `src/data/customsRates.ts` — `DUTY_RATES[countryIso][category]` → `{ dutyPct, vatPct, notes }`; 15 countries
- `src/data/detentionRates.ts` — `DETENTION_RATES[carrier][region][containerType]` → tiered daily rates
- `src/data/airFreightRates.ts` — air carrier rate tables
- `src/data/portData.ts` / `airportData.ts` — content for port/airport SEO pages

### Reusable UI components
- `src/components/ui/SearchSelect.tsx` — dark-themed searchable dropdown (replaces native `<select>`); used in Rates, CustomsDuty, DetentionCalc
- `src/components/ui/UpgradeModal.tsx` — plan upgrade prompt
- `src/components/ui/AdUnit.tsx` — Google AdSense unit that collapses margin/padding when no ad loads

### SEO
- `src/hooks/useSEO.ts` — sets `<title>`, `<meta>`, canonical, and optionally injects `<script type="application/ld+json">` via `jsonLd` prop. Always use this instead of plain `useEffect` for meta tags.

### Rates calculator (`src/pages/Rates.tsx`)
Complex page with Express + Air freight tabs. Key internals:
- `localStorage` caches form state under key `trackora_rates_v1`; cached packages get fresh IDs on load to prevent React key collisions
- Postal code → city auto-fill uses an **offline prefix table** (`POSTAL_PREFIX_AIRPORT`) for 20 countries — no external API needed for most cases; falls back to `zippopotam.us` for others

### Map (`src/components/tracking/WorldMap.tsx`)
Pure SVG world map, no external library. Equirectangular projection via `toSVG(lat, lng)`.

### Supabase Edge Functions (`supabase/functions/`)
- `gumroad-webhook` — receives Gumroad sale/refund events; updates `profiles.plan_tier`; stores pending upgrades in `pending_plan_upgrades` for users not yet signed up. JWT verification must be **OFF** (external webhook). Secured via `?secret=WEBHOOK_SECRET` query param.
- `notify-new-signup`, `notify-status-changes`, `track-shipment` — other edge functions

### Key database tables
- `profiles` — `id` (= auth.users.id), `full_name`, `mobile`, `dob`, `avatar_url`, `plan_tier`
- `pending_plan_upgrades` — `email`, `plan_tier`; consumed on first login

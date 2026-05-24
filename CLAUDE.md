# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 5173
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Serve production build locally
```

The preview server is registered in `C:\Users\ASUS\.claude\launch.json` as **"ShipTrack"** (port 5173). Use `preview_start` with that name to launch it in the Claude Code preview tool.

## Stack

- **React 19 + TypeScript** via Vite 8
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js` — config lives in `src/index.css` under `@theme`)
- **React Router v7** for client-side routing
- **Framer Motion** (installed, available for animation)
- **Lucide React v1.16** for icons — brand icons (Github, Twitter, Linkedin) do NOT exist; use generic alternatives

## Architecture

### Routing (`src/App.tsx`)
Three routes: `/` (Home), `/track/:trackingId?` (Track), `/dashboard` (Dashboard). Navbar and Footer wrap all routes.

### Data layer (`src/data/mockShipments.ts`)
All shipment data is mock/static. `getShipment(id)` does case-insensitive lookup against four hardcoded demo IDs: `1Z999AA10123456784`, `MAD3456789`, `MAWB001-12345678`, `CNTR8872341`. No real API calls — simulate async with `setTimeout` in the Track page.

### Styling convention
All components use **inline styles** (not Tailwind utility classes) for layout and component-specific styles. Tailwind `@layer utilities` in `index.css` defines shared helpers (`.glass`, `.glass-strong`, `.glow-indigo`, `.text-gradient`, `.bg-mesh`, `.grid-lines`, animation keyframes). The design system uses:
- Background: `#0a0f1e`
- Primary: `#6366f1` / `#4f46e5` (indigo)
- Accent: `#22d3ee` (cyan)
- Text: `#f8fafc`
- Cards: `rgba(255,255,255,0.03–0.08)` with `border: 1px solid rgba(255,255,255,0.07–0.12)`

### Map (`src/components/tracking/WorldMap.tsx`)
Pure SVG, no external map library. Uses equirectangular projection (`toSVG(lat, lng)`). Animated routes use SVG `animateMotion`. Demo routes are hardcoded in `DEMO_ROUTES`.

### Monetization gates
The dashboard has a locked "Advanced Analytics" section as a Pro upsell. The Pro banner sits at the top of Dashboard. Feature cards in `FeaturesSection` carry `badge: 'Pro' | 'Enterprise'` labels.

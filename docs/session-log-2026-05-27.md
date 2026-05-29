# Trackora Development Session Log
**Date:** 2026-05-27 → 2026-05-28  
**Project:** [Trackora](https://www.track-ora.com) — Global Shipment Tracking SaaS  
**Stack:** React 19 + TypeScript + Vite 8 · Supabase Edge Functions (Deno) · Cloudflare Pages

---

## Summary of Work Done

### 1. Fixed "Shipment not found" for Unauthenticated Users

**Problem:** FedEx `817272348130` showed "Shipment not found" when not signed in.  
**Root cause:** The Supabase anon key (`sb_publishable_...`) is not a valid JWT — the Supabase gateway returned HTTP 401 before the Edge Function ever ran.  
**Fix:** Redeployed the Edge Function with `--no-verify-jwt`:
```bash
npx supabase functions deploy track-shipment \
  --project-ref uosefhniaxtyjaweuqbo \
  --no-verify-jwt
```

---

### 2. FedEx Direct API Integration

**Goal:** Get live tracking events directly from FedEx Production API (sandbox only works with test numbers).

**Steps taken:**
1. Created a project on [developer.fedex.com](https://developer.fedex.com)
2. Selected **Track API** under the project
3. Linked shipping account "Analyticaone" (ending 308) to get Production credentials
4. Set Supabase secrets:
```bash
npx supabase secrets set \
  FEDEX_API_KEY=l7a796fed795464b13b812d746ec11efd4 \
  FEDEX_SECRET_KEY=f16070cbf77c44e18ea6d330cddb4f85 \
  --project-ref uosefhniaxtyjaweuqbo
```

**API details:**
- OAuth token: `POST https://apis.fedex.com/oauth/token`
- Track endpoint: `POST https://apis.fedex.com/track/v1/trackingnumbers`
- Sandbox URL is different: `apis-sandbox.fedex.com` (test numbers only)

---

### 3. DHL Direct API Integration

**Steps taken:**
1. Created TRACKORA app on [developer.dhl.com](https://developer.dhl.com)
2. Added **Shipment Tracking - Unified** API product
3. Set Supabase secrets:
```bash
npx supabase secrets set \
  DHL_API_KEY=fJn3VqYPMOB6vFsRUhOcUZ2QWgMrnpqy \
  DHL_SECRET=ufEaFgdwtjF25Ugh \
  --project-ref uosefhniaxtyjaweuqbo
```

**API details:**
- Endpoint: `GET https://api-eu.dhl.com/track/shipments?trackingNumber={id}`
- Auth: single `DHL-API-Key` header
- Correctly rejects non-DHL numbers (DPD UK, Seino) → AfterShip fallback handles them

---

### 4. UPS — Skipped

UPS account creation form rejected UAE address (form was US-only) → too much friction.  
AfterShip handles `1Z...` UPS numbers reliably as fallback. Can revisit later.

---

### 5. Route 5: Sparse Placeholder for Pattern-Detected Carriers

Added a fallback in `supabase/functions/track-shipment/index.ts`:  
When all API routes fail but the tracking number matches a known carrier pattern, return a sparse placeholder instead of a 404 error.

```typescript
// ── Route 5: Placeholder for pattern-detected carriers with no live data ──
if (!shipment) {
  const detectedCarrier = detectDirectCarrier(tn, carrierSlug)
  if (detectedCarrier) {
    const CARRIER_DISPLAY: Record<string, string> = {
      fedex: 'FedEx', ups: 'UPS', dhl: 'DHL Express',
      usps: 'USPS', aramex: 'Aramex',
    }
    shipment = {
      id: tn, trackingNumber: tn,
      carrier: CARRIER_DISPLAY[detectedCarrier] || detectedCarrier.toUpperCase(),
      freightType: 'express', status: 'picked_up',
      origin:          { city: '', country: '', lat: 0, lng: 0 },
      destination:     { city: '', country: '', lat: 0, lng: 0 },
      currentLocation: { lat: 0, lng: 0 },
      estimatedDelivery: 'TBD', etaConfidence: 0,
      delayRisk: 'low', delayReason: '',
      timeline: [], carbonKg: 45, weightKg: 0, dangerousGoods: false,
    }
  }
}
```

---

### 6. Sea Freight Container Redirects

**Pattern:** Same as air freight MAWB redirects — detect ISO 6346 container number → show carrier redirect card instead of "not found".

#### New file: `src/data/containerRedirects.ts`

- Maps ISO 6346 owner codes (first 3 chars) to 20+ shipping line portals
- Key carriers: MSC, Maersk, CMA CGM, COSCO, OOCL, Hapag-Lloyd, Evergreen, Yang Ming, ONE, ZIM, HMM, Wan Hai, PIL, Arkas, Turkon, Grimaldi, Sea Lead, Wallenius Wilhelmsen
- Deep-link support where available (Maersk, CMA CGM, Hapag-Lloyd, COSCO, etc.)

```typescript
export function getContainerRedirect(trackingNumber: string): ContainerRedirect | null {
  const clean = trackingNumber.replace(/\s/g, '').toUpperCase()
  // ISO 6346: 3-letter owner + equipment category (U/J/Z) + 7 digits
  if (!/^[A-Z]{3}[UJZ]\d{7}$/.test(clean)) return null
  const ownerCode = clean.slice(0, 3)
  const info = OWNER_MAP[ownerCode]
  if (!info) return null
  const trackUrl = info.trackUrl.replace('{container}', encodeURIComponent(clean))
  return { containerNumber: clean, ownerCode, shippingLine: info.name,
           logoSlug: info.logoSlug, trackUrl, supportsDeepLink: info.supportsDeepLink }
}
```

#### New file: `src/components/tracking/ContainerRedirectCard.tsx`

- Ocean-themed version of `AirlineRedirectCard`
- Green (#10b981) color scheme, Anchor icon
- Wave SVG route graphic with "Port of Loading" / "Port of Discharge" nodes
- Logo from AfterShip CDN, info banner, "Track on [Carrier] Portal" CTA, copy button

#### Changes to `src/pages/Track.tsx`

Added state: `const [containerRedirect, setContainerRedirect] = useState<ContainerRedirect | null>(null)`

In `handleAnimationComplete`:
```typescript
const ctnRedir = getContainerRedirect(currentId)
  ?? (result.carrier ? getContainerRedirectByCarrier(currentId, result.carrier) : null)
if (ctnRedir) {
  setContainerRedirect(ctnRedir)
  setNotFound(false)
  setLastUpdated(new Date())
  return
}
```

---

### 7. Fix: Leasing-Company Container Prefixes (e.g. TIIU → MSC)

**Problem:** `TIIU4302338` didn't redirect to MSC.  
**Root cause:** `TII` is a **Triton Container International** leasing prefix — not in the owner map. Triton owns the physical box but rents it to any carrier. The API correctly returned carrier `MSC` but the code only tried the owner-code lookup.

**Fix:** Added `getContainerRedirectByCarrier()` to `containerRedirects.ts`:

```typescript
export function getContainerRedirectByCarrier(
  trackingNumber: string,
  carrierName: string,
): ContainerRedirect | null {
  const clean = trackingNumber.replace(/\s/g, '').toUpperCase()
  if (!/^[A-Z]{3}[UJZ]\d{7}$/.test(clean)) return null

  const needle = carrierName.toLowerCase().trim()
  const entry = Object.entries(OWNER_MAP).find(([, info]) =>
    needle.includes(info.name.toLowerCase()) ||
    info.name.toLowerCase().includes(needle),
  )
  if (!entry) return null

  const [ownerCode, info] = entry
  const trackUrl = info.trackUrl.replace('{container}', encodeURIComponent(clean))
  return { containerNumber: clean, ownerCode, shippingLine: info.name,
           logoSlug: info.logoSlug, trackUrl, supportsDeepLink: info.supportsDeepLink }
}
```

Now any leasing-company container (`TRLU`, `TGHU`, `CAIU`, `SEGU`, etc.) correctly redirects to the carrier the API identified.

---

### 8. Dashboard "Clear All" Button

**Added to `src/pages/Dashboard.tsx`:**

```typescript
const [confirmClear, setConfirmClear] = useState(false)
const [clearing, setClearing] = useState(false)

async function handleClearAll() {
  if (!confirmClear) { setConfirmClear(true); return }
  if (!user) return
  setClearing(true)
  try {
    await supabase!.from('shipments').delete().eq('user_id', user.id)
    setShipments([])
  } finally { setClearing(false); setConfirmClear(false) }
}
```

- Only renders when `shipments.length > 0`
- First click → red styling + "Confirm clear all?"
- Second click → executes the delete
- Blur resets confirmation state

**Bug encountered:** `supabase` typed as possibly `null` caused TypeScript error on build → fixed with `supabase!.from(...)`.

---

### 9. TrackingAnimation Rewrite — Rotating Earth Globe

Replaced radar/pulse spinner with an SVG Earth globe + 3 orbital rings.

**File:** `src/components/tracking/TrackingAnimation.tsx`

**Globe features:**
- Ocean: radial gradient `#1e3a5f → #060d1f`
- Continent shapes scrolling horizontally via `land-drift` keyframe (12s loop) — two sets side-by-side for seamless repeat
- Latitude lines (7 ellipses) + longitude curves (3 ellipses) as grid overlay
- Atmosphere glow + specular highlight at top-left
- Globe outline pulses with `pulse-glow` keyframe

**Orbital rings (depth-ordered via SVG arc halves):**
- Each ring: back-half arc drawn before globe, front-half arc + glowing satellite dot drawn after
- Ring A: flat equatorial, `rx=74 ry=22`, 5s spin, indigo
- Ring B: −55° tilted, `rx=68 ry=20`, 7s reverse spin, cyan
- Ring C: +40° tilted, `rx=60 ry=16`, 3.5s fast spin, purple

**Amber mode** (`isHolding` — waiting on carrier API): all ring colors, globe rim, scan beam, and progress shimmer switch from indigo/cyan/purple → amber.

**CSS keyframes added:** `land-drift`, `orb1`, `orb2`, `orb3`, `pulse-glow`, `scan-beam`, `blink`, `shimmer`

All existing progress-bar, step-dots, and scan-beam logic preserved.

---

## Deployment Commands

```bash
# Build
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name trackora

# Deploy Edge Function (always include --no-verify-jwt)
npx supabase functions deploy track-shipment \
  --project-ref uosefhniaxtyjaweuqbo \
  --no-verify-jwt
```

---

## Files Modified / Created

| File | Status | Description |
|------|--------|-------------|
| `supabase/functions/track-shipment/index.ts` | Modified | Route 5 placeholder + FedEx/DHL direct API |
| `src/data/containerRedirects.ts` | **New** | ISO 6346 owner code → shipping line portal map |
| `src/components/tracking/ContainerRedirectCard.tsx` | **New** | Ocean-themed carrier redirect UI card |
| `src/pages/Track.tsx` | Modified | Container redirect integration + carrier-name fallback |
| `src/pages/Dashboard.tsx` | Modified | "Clear All" button with two-step confirmation |
| `src/components/tracking/TrackingAnimation.tsx` | **Rewritten** | Rotating Earth globe with orbital rings |

---

## Known Limitations / Future Work

| Item | Notes |
|------|-------|
| UPS direct API | Skipped — account creation failed for UAE address. AfterShip handles `1Z...` numbers. |
| USPS direct API | Not yet integrated |
| Aramex direct API | Not yet integrated |
| Globe animation | User requested "true Earth design" — further improvement pending |
| Container leasing prefixes | Now handled via carrier-name fallback, but only works if the API identifies the carrier |

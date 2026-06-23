# Roma & Prashant · Wedding Planner

A single-page, trilingual (English / हिंदी / मराठी) wedding planner for
Roma & Prashant — Maharashtrian + Rajasthani traditions, Nashik & Bharatpur,
November 2026.

Vanilla JS, **no frameworks, no build step**. Supabase (v2 CDN) provides live
shared sync; everything falls back to `localStorage` when offline.

## Features

- Month-by-month **checklist** with per-family owners and progress rings
- **Decisions** with live family **voting** + tally bars
- **Vendor** tracker (waiting → replied → booked) with notes
- **RSVP** manager (events, family side, veg, status)
- **Budget** tracker
- **Wishes wall** with emoji reactions
- **Soul** compatibility section (Jyotish / numerology / Human Design …)
- **Story** gallery with a swipe/keyboard **lightbox**
- Animated **toran**, marigold **petals**, Warli + Jharokha **side frames**,
  milestone celebration **burst**, **countdown** timer
- Installable **PWA** (offline app shell via service worker)

## Project structure

```
wedding-app/
├── index.html            # shell only (markup + meta + script tags)
├── manifest.json         # PWA manifest
├── sw.js                 # service worker (offline app shell)
├── vercel.json           # static hosting config (no build step)
├── css/
│   └── styles.css        # all styles (mobile-first + desktop block)
├── js/
│   ├── lang.js           # trilingual string maps (T, MONTHS, DECISIONS,
│   │                     #   VENDORS, RSVP_T, SYNC_TXT) + rsvpT()
│   ├── data.js           # gallery PHOTOS (base64 + captions)
│   ├── supabase.js       # isolated cloud layer + graceful offline fallback
│   ├── animations.js     # toran, petals, side frames, celebration burst
│   └── app.js            # core logic, renderers, lightbox, bootstrap
├── icons/                # PWA icons (192, 512, maskable)
└── assets/               # placeholder for static assets (see assets/README.md)
```

### Load order (matters — globals, no modules)

`lang.js → data.js → supabase.js → animations.js → app.js`

`app.js` bootstraps on `DOMContentLoaded` and registers `sw.js`.

## Configuration

- **Wedding date** — edit `WEDDING_DATE` near the top of `js/app.js`
  (`new Date(YYYY, MM-1, DD)`; currently 25 Nov 2026).
- **Supabase** — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `WEDDING_CODE` live at
  the top of `js/supabase.js`. The app needs a `wedding` table with columns
  `code` (text, primary key/unique), `data` (jsonb), `updated` (timestamptz).
  Enable realtime on that table for live multi-user sync.

## Run locally

Because the service worker and `fetch` need HTTP (not `file://`):

```bash
cd wedding-app
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on Vercel (static, no build)

1. Push this folder to a Git repo (or `vercel` CLI from inside it).
2. Framework preset: **Other**. Build command: **none**. Output dir: **/**.
3. `vercel.json` sets the right headers for `sw.js` / `manifest.json`.

That's it — it's a static site.

## Offline behaviour

- All reads/writes go to `localStorage` first, so the app is fully usable
  with no network or even if the Supabase CDN script is blocked.
- When the cloud is reachable, state syncs live across devices using the same
  `WEDDING_CODE`; the header pill shows `live · synced` / `offline · saved on phone`.

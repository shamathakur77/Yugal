# YUGAL v2 — Changes from v1

## Critical fixes

| # | Issue | Fix |
|---|-------|-----|
| 1 | `user-scalable=no` blocked pinch-zoom (WCAG 1.4.4 fail) | Removed from viewport meta |
| 2 | Identity modal fired on first load before user saw anything | Deferred — modal only opens when user taps Planner / Decisions / RSVP |
| 3 | 9-tab bottom nav = cognitive overload on mobile | Collapsed to 5 primary tabs + "More" drawer with remaining 6 |
| 4 | Budget section showed cold "₹0" with no guidance | Added skeleton loader + empty-state hint with example |
| 5 | Tracker had no empty state | Added hint prompt |
| 6 | Lightbox had no slide counter | lb-counter added, populated by nav.js |
| 7 | Language choice not persisted via aria | `aria-pressed` synced on every `setLang()` call |
| 8 | No "skip" option in Who modal for guests just browsing | "Just browsing →" button added |
| 9 | No `aria-label` on interactive elements | Added throughout index.html |

## New files

- `css/fixes.css` — all overrides (keeps styles.css untouched for easy diffing)
- `js/nav.js` — collapsed nav, More drawer, language persistence, skeleton hide, empty-state hints

## What was NOT changed

- `js/app.js` — only one line commented out (the auto-openWho on boot)
- `js/lang.js`, `js/supabase.js`, `js/animations.js`, `js/audio.js`, `js/gallery.js` — untouched
- `css/styles.css` — untouched
- All Supabase config, wedding date, people config — untouched

## Deploy

Same as v1 — push to Vercel, framework: Other, build: none, output: /.

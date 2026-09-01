# Niv & Rinat: Southern Italy 2026

A mobile-first, offline-readable road-book for a 12-night trip through Puglia, Matera and Naples, 14–26 September 2026.

Production: <https://nivbgal.github.io/southern-italy-2026/>

## What is inside

- A dated, hour-by-hour plan for all 13 calendar days
- Birthday and rough-sea fallbacks for 16 September
- Typical weather, sunrise/sunset, cash, traffic, parking and ZTL guidance
- Booking shortlist with explicit `Confirmed`, `Live quote`, `Requested`, `Planned` and `Typical` states
- Leaflet/OpenStreetMap route map with Google Maps navigation links
- Budget tracking for planned, actual, excluded and temporary-liquidity amounts
- Device-local checklists, notes, favorites, spending and JSON export/import
- Three-hour forecast cache using Open-Meteo when a date enters the reliable forecast window
- Installable PWA shell and offline access to the itinerary and budget
- Credited destination photography in responsive AVIF and WebP formats
- A separate “Rinat’s pick” label for eight personal saves, including places below the 4.7 recommendation threshold

Flights are the only confirmed reservations in the initial dataset. Lodging, car and activities remain candidates until the travelers update their status on their own device.

## Privacy

This is a public repository and site. It intentionally contains first names, dates, public flight details, candidate hotels, prices and locations. It must never contain contact details, booking references, payment data, passport details, room codes, credentials or private notes. Personal edits stay in the browser and are not synced.

## Development

Requires Node.js 24 or later.

```bash
npm ci
npm run dev
```

The production base path is `/southern-italy-2026/`; navigation uses hash routes so direct Pages loads are safe.

## Verification

```bash
npm run verify
npm run test:e2e
node scripts/site-audit.mjs --root dist --base /southern-italy-2026/
node scripts/ledger-audit.mjs qa/commitment-ledger.json
node scripts/verification-gate.mjs qa/verification-report.json
```

The GitHub Pages workflow repeats the locked install, lint, typecheck, content validation, build, artifact/privacy audit and four-project Playwright/axe matrix before deployment. It then smoke-tests the unauthenticated production URL.

## Source and freshness model

The app's About view links directly to its official, local-editorial and evidence sources. It also lists every photo creator, source file and reuse licence. Climate, traffic, opening hours, ratings and prices display a checked or seasonal date because they can change. Live forecasts replace seasonal expectations only within Open-Meteo's supported window.

Design provenance and the rendered review are in [DESIGN.md](DESIGN.md). Release evidence is in [qa/](qa/).

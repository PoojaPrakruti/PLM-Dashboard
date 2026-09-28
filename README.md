# LineSight — AI-Based Product Defect Detection System (Bottle Manufacturing)

Frontend-only dashboard for an industrial bottle-inspection line. No backend,
no AI model — every screen runs on mock JSON data, structured so a real
inference API can be dropped in later with minimal changes.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Stack

React 18 (Vite) · Tailwind CSS · React Router DOM · MUI Icons · Framer Motion · Recharts

## Structure

```
src/
├── assets/         static assets
├── components/     Sidebar, Navbar, StatCard, ProductCard, BottleCard,
│                   StatusBadge, BottleGraphic (procedural SVG bottle art)
├── pages/          Dashboard, Products, ProductionBatch, BottleDetails,
│                   Analytics, LiveInspection, Settings, NotFound
├── layouts/         MainLayout (sidebar + navbar + animated page outlet)
├── hooks/          useDarkMode
├── services/       bottleService.js — the ONLY data-access layer
├── mockData/       bottles.js — generates 100+ bottle inspection records
├── utils/          shared helpers (status colors, formatting)
└── routes/         AppRoutes.jsx — all route definitions
```

## Where AI integration plugs in later

`src/services/bottleService.js` is the single seam between the UI and data.
Every function already returns a Promise and mirrors a plausible REST
contract (e.g. `runInspection()` returns `{ bottle_id, status, defect,
confidence, image }`, matching a real inference response). To connect a
real backend, replace the function bodies in that file with `fetch()` calls
— no component needs to change.

The Bottle Details page also reserves a dedicated **AI Detection Result**
panel that currently reads "No AI Connected" — this is where model output
(bounding boxes, heatmaps, defect overlays) will render once wired up.

## Notes

- Product photography doesn't exist yet, so bottles are rendered as
  procedural SVG art (`BottleGraphic`) driven by design, capacity, status,
  and defect type — this keeps every card looking distinct without
  depending on placeholder stock images.
- Live Inspection simulates a new bottle entering the scanner every 3
  seconds and resolves it to Passed/Failed shortly after.
- Dark mode is on by default (industrial console feel) and toggles from
  the top navbar.

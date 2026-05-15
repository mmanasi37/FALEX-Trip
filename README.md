# FALEX Ride

FALEX Ride is a lightweight rider/driver dispatch demo for Port Moresby, built with React, TypeScript, and Vite.

## Current capabilities

- Rider booking flow with landmark-based pickup and destination selection
- Mock live route map built from local landmark coordinates
- Ride tier selection inspired by ride-hailing products
- Quick destination shortcuts for faster trip entry
- Deterministic fare estimates, ETA, payment choice, and fare breakdowns in PGK
- Driver dispatch board with pending and accepted ride states
- Assigned driver details once a request is accepted
- Basic UI coverage with Vitest and Testing Library

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS utilities
- Vitest
- ESLint

## Getting started

```bash
corepack pnpm install
corepack pnpm dev
```

Open `http://localhost:5173`.

## Scripts

```bash
corepack pnpm dev
corepack pnpm build
corepack pnpm lint
corepack pnpm test
```

## Notes

- This is currently a frontend-only prototype with in-memory ride state.
- The map is a deterministic mock built from local landmarks; it does not use a live GPS or third-party map API.
- There is no backend, persistence layer, authentication, or real-time dispatch yet.

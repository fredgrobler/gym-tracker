# Gym Tracker

Offline-first PWA for tracking Jeff Nippard's Pure Bodybuilding Program (PPLA split — Push / Pull / Legs / Arms & Weak Points, asynchronous 10-day cycle across two blocks).

## Stack

React 19 + TypeScript + Vite, Dexie (IndexedDB) for local storage, `vite-plugin-pwa` for the offline service worker and manifest. No backend — everything lives on-device.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Deployed automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

## Program data

The program's exercise/set/rep structure lives in `src/data/program.ts` and `src/data/exercises.ts` — transcribed from a project summary, not bundled from any copyrighted source file. Block 2 slots the summary didn't fully specify are marked `inferred: true` and shown with a note in the UI so they can be corrected against the real program on first use.

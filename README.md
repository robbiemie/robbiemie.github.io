# robbiemie.github.io

A Chrome-first personal site rebuilt with React, TypeScript, MobX, particles, and Three.js.

## Stack

- React 18
- TypeScript 5
- MobX + mobx-react-lite
- Vite 5
- @react-three/fiber + drei
- tsParticles

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages Notes

- `CNAME` is kept in repository root for custom-domain publishing.
- `404.html` and `200.html` include SPA fallback logic.
- `vite.config.ts` supports path override via `VITE_BASE_PATH`.

# Bangladesh Travel Explorer (React + TypeScript)

A Vite React + TypeScript frontend for browsing the 140-destination Bangladesh travel dataset.

## Features
- Search destinations by name, division, district, slug, or description
- Filter by division and category
- Sort by name, rating, and budget
- Reads data from `public/data.json`

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project structure

- `public/data.json` - 140-destination dataset
- `src/App.tsx` - app shell and filtering logic
- `src/components/` - reusable UI pieces
- `src/types.ts` - dataset types

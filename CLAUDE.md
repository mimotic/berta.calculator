# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Type-check + production build
npm run lint      # ESLint validation
npm run preview   # Preview production build locally
npm run deploy    # Build and deploy to GitHub Pages
```

No test suite is configured.

## Architecture

**berta-calc** is a canine nutrition web app (Spanish-language UI) with two calculators:

- `/calorias` — Caloric needs calculator using Kleiber's law: `RER = 70 × weight^0.75`, then multiplied by life-stage/activity/goal factors.
- `/calculadora` — Portion calculator: a two-step wizard to set kcal target and select active ingredients, followed by a main view with sliders that compute real-time nutrition totals.

**Stack:** React 19 + React Router 7 (hash-based) + TypeScript (strict) + Vite + Tailwind CSS 4.

**Routing** uses `createHashRouter` (not `createBrowserRouter`) so the app works on GitHub Pages at the `/berta.calculator/` subpath (configured in `vite.config.ts`).

**State:** `useState`/`useEffect` + `localStorage` for persistence. No global state library. Kcal target and selected ingredients survive page reloads via localStorage.

**Static ingredient data** lives in `src/data/ingredients.ts` — 18 food items each with full macro + micronutrient profiles. Max slider values scale with the kcal target via `KCAL_RANGES` step multipliers (`src/utils/calculatorUtils.ts`).

**Nutrient alerts** use hardcoded thresholds:
- Phosphorus: warn >80 mg, alert >100 mg (a 30% reduction factor is applied to phosphorus and potassium to model boiling losses).
- Potassium: target 100–200 mg range.
- Fat: warn >10 g, alert >15 g.

**Dark mode** toggles via a `.dark` class on `<html>`, stored in localStorage with `prefers-color-scheme` as fallback.

**Deployment:** `gh-pages` publishes the `dist/` folder to the `gh-pages` branch. The `base` in `vite.config.ts` must remain `/berta.calculator/`.

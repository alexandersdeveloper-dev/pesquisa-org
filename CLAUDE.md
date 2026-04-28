# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

No linter, no test suite configured.

## Architecture

React 18 + Vite 6, plain JS/JSX (no TypeScript). Single CSS file — no CSS modules, no Tailwind.

### State and data flow

```
App.jsx
  └── Home.jsx (page)
        ├── Hero (onStart, blocked)
        ├── InfoCards / HowItWorks / Trust / FAQ  ← static, no props
        └── SatisfactionModal (onClose, onComplete)
```

`App.jsx` owns two pieces of state: `blocked` (whether the survey was already submitted, read from `localStorage` on mount) and `showSurvey`. It passes callbacks down; it never passes data upward.

`SatisfactionModal` is self-contained: it calls `useSurvey()` internally and receives only `onClose` / `onComplete` callbacks.

### Survey hook — `src/hooks/useSurvey.js`

Single source of truth for all survey state. Key shape:

| State | Purpose |
|---|---|
| `step` | 0 = mode choice, 1 = identify fields, 2…N+1 = questions, then submit |
| `identify` | `{ modo, cpf, nome, cargo, area, frequencia }` |
| `answers` | `{ [questionId]: value }` |
| `submitted / protocol` | set together on final submit |

`flatQuestions` is memoized from `SECTIONS` (flattened array of all questions across all sections). `totalSteps = 2 + flatQuestions.length`.

`canAdvance()` branches by step: step 0 requires `identify.modo`; step 1 requires different fields depending on `modo` (`identificado` → nome + cpf + cargo; `anonimo` → area + frequencia); question steps require non-null answers for `likert` and `multi` types; `text` always passes.

### Survey data — `src/data/survey.js`

- `SECTIONS` — 4 sections, 10 questions total (8 likert/multi + 2 optional text)
- `LIKERT` — 5 scale entries `{ v, lbl }` — icons live in `QuestionCard.jsx`, not here
- `AREAS`, `FREQUENCIAS` — select options for the anonymous identify step

### Persistence — `src/services/storage.js`

Only `localStorage`, keys prefixed `ps_`:

| Key | Value |
|---|---|
| `ps_submitted` | `"1"` after submit |
| `ps_protocol` | confirmation code e.g. `PS-123456` |
| `ps_modo` | `"identificado"` or `"anonimo"` |

Survey answers are **never persisted** — only the completion state is stored.

### CSS — `src/styles/global.css`

One file, no scoping. Uses CSS custom properties (`--c-blue`, `--ink-900`, `--font-display`, etc.) defined in `:root`. Breakpoints: **1160px** (hide header meta, tighten hero gap), **980px** (collapse grids to 1 column), **600px** (mobile — modal goes full-screen with `height: 100dvh`, buttons stack full-width).

The modal is desktop-centered (`max-width: 720px`) and becomes a full-screen sheet on mobile (`height: 100dvh; border-radius: 0`). Body scroll is locked via `useEffect` in `SatisfactionModal`.

### Key design decisions

- **No router** — single page, modal overlay handles all survey interaction.
- **Confirmation on close** — `SatisfactionModal` manages a `showConfirm` state; native `confirm()` is not used anywhere.
- **Identification choice at step 0** — user picks `identificado` (nome + CPF + cargo) or `anonimo` (área + frequência) before answering questions. Closing at step 0 skips the confirmation dialog.
- **Likert icons** — 5 SVG outline faces defined as a `FACES` map in `QuestionCard.jsx`, keyed by scale value (1–5).
- **`prefers-reduced-motion`** and **`hover: none`** media queries are at the end of `global.css` — all animations and hover transforms are gated there.

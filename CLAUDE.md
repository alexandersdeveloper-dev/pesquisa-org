# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

Requires a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`). No linter or test suite configured.

## Architecture

React 18 + Vite 6, plain JS/JSX (no TypeScript). Single CSS file at `src/styles/global.css` — no CSS modules, no Tailwind. Supabase for backend (PostgreSQL + Auth).

### Routes

```
/                → public satisfaction survey (landing + modal)
/admin/login     → Supabase email/password login
/admin/*         → protected admin panel (AdminRoute checks session)
```

`App.jsx` wraps everything in `BrowserRouter` + `AuthProvider`. `AdminRoute` redirects to `/admin/login` if no session.

### Public survey flow

```
Home.jsx
  └── SatisfactionModal   ← receives onClose/onComplete callbacks only
        └── useSurvey()   ← all survey state (step, identify, answers, submitted)
```

`usePublicSurvey()` fetches all data from Supabase in parallel (campaign, profile_fields, survey_sections, survey_questions, question_options, service_areas) and passes it as props to `SatisfactionModal`.

**Step model in `useSurvey`:**

| Mode | Step 0 | Step 1 | Step 2 | Step 3… |
|---|---|---|---|---|
| `identificado` | mode choice | name/CPF/role | evaluation context | questions |
| `anonimo` | mode choice | evaluation context | questions | — |

`profileStep` and `questionOffset` are derived from `identify.modo`. Questions are filtered by `area_id` when areas are configured.

### Response persistence

Public submissions go through a **PostgreSQL SECURITY DEFINER function** `insert_survey_response`, called via `supabase.rpc()` in `src/services/surveyService.js`. This bypasses RLS entirely — do not replace with direct table inserts. The function validates `modo`, answer count (max 50), and whether the campaign is active before inserting into `responses` + `response_answers`.

`localStorage` (keys prefixed `ps_`) tracks completion state per browser. CPF and name are **never sent to the database** — `persistResponse()` strips PII before building the `profile` jsonb payload.

### Admin panel

`AdminApp.jsx` is the layout shell (collapsible sidebar + topbar + `<Routes>`). All data pages are in `src/admin/pages/`. Each page uses a dedicated hook in `src/hooks/` for CRUD:

| Hook | Tables |
|---|---|
| `useProfileFields` | `profile_fields`, `profile_field_options` |
| `useQuestions` | `survey_questions`, `question_options` |
| `useSections` | `survey_sections` |
| `useServiceAreas` | `service_areas`, `service_area_options` |
| `useResponses` | `responses`, `response_answers` (paginated, admin-only) |

All admin mutations call `logAudit()` from `src/services/auditService.js`, which writes to `audit_log` with the current user's id and a before/after diff.

Drag-and-drop reordering uses `@dnd-kit/core` + `@dnd-kit/sortable`. The shared wrapper is `src/admin/components/SortableList.jsx` (`SortableTr` + `SortableTableBody`). Reorder is disabled in Questions when an area filter is active.

### Database — key RLS rules

- `responses` and `response_answers`: anon cannot read or insert directly. Admin (`authenticated`) can read. Inserts go through the SECURITY DEFINER function.
- `profile_fields`, `survey_questions`, `survey_sections`, `service_areas`: anon can SELECT active rows only. Admin has full access.
- `audit_log`: admin read/write only.

### Security headers

Defined in `vercel.json` (not in `index.html` — CSP meta tags were removed because they blocked Vite HMR). `frame-ancestors 'none'` only works in HTTP headers, not meta tags.

### Auth session

`AuthContext` wraps Supabase Auth with a 2-hour inactivity timeout (mousemove, keydown, pointerdown, scroll reset the timer). `signOut()` clears the timer.

### CSS conventions

Custom properties defined in `:root` (`--c-blue`, `--ink-900`, `--font-display`, etc.). Breakpoints: **1160px**, **980px**, **600px** (mobile — modal goes full-screen with `height: 100dvh`). `prefers-reduced-motion` and `hover: none` gates are at the end of the file.

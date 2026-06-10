# Handoff: Acme Engineering Standards Portal

## Overview
A search-first internal portal where engineers discover, read, and adopt engineering
standards (security, data, reliability, frontend, services, infra, AI, quality). Each
standard explains the *why*, its compliance level (Must / Should / May), owning team,
status, and — critically — which **enterprise enabler** (a paved-path platform/service)
lets a team satisfy the standard "by construction" instead of building the controls
themselves.

The portal has six views: **Home** (search landing), **Browse** (faceted filtering),
**Standard Detail**, **Enablers** (capability catalog), **Enabler Detail**, and **About**
(mission, leadership letter, the Enterprise Architecture team, guiding principles, maturity
model).

## About the Design Files
The files in `source/` are **design references created in HTML/React-via-Babel** — a
working prototype that demonstrates intended look, layout, and behavior. They are **not
production code to copy directly**. The task is to **recreate these designs in the target
codebase's existing environment** (React, Vue, Svelte, etc.), using its established
component library, routing, data layer, and styling conventions. If no front-end
environment exists yet, choose the most appropriate framework for the project and
implement the designs there.

The prototype runs entirely client-side: React 18 + Babel standalone transpiling `.jsx`
in the browser, with data hard-coded in `data.js` / `tech-data.js` on `window.SP_DATA`.
In production this data should come from a real API/CMS.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, iconography, and interaction
states are all specified. Recreate the UI pixel-accurately using the codebase's libraries,
mapping the design tokens below onto the existing system where equivalents exist.

## Architecture of the Prototype
- `Standards Portal.html` — entry point. Loads Google Fonts, `styles.css`, React/Babel,
  then each `.jsx`/`.js` file as a `<script>`. Mounts `<App>` into `#root`.
- `components.jsx` — shared primitives exported onto `window`: `Icon` (inline stroke SVG
  set), `ComplianceBadge`, `StatusBadge`, `EnablerPill`, and helpers `fmtDate`, `initials`.
- `app.jsx` — app shell: top bar (brand, nav, search affordance, app-picker popover,
  avatar menu), client-side routing via a `route` state object, footer, and the Tweaks panel.
- `home.jsx`, `browse.jsx`, `detail.jsx`, `enablers.jsx`, `about.jsx` — the views.
- `data.js` — `STANDARDS`, `CATEGORIES`, `COMPLIANCE`, `STATUS`, `TEAMS`, `ENABLERS` on
  `window.SP_DATA`. `tech-data.js` — code samples / config snippets shown on detail pages.
- `tweaks-panel.jsx` — prototype-only design exploration controls. **Do not port** — this
  is a design-time affordance, not a product feature.

### Routing
Single `route` object in `App`: `{ view, id?, enablerOnly? }`. `go(route)` sets it and
scrolls to top. Views: `home`, `browse`, `detail`, `enablers`, `enabler`, `about`.
Replace with the codebase's router (e.g. React Router paths: `/`, `/browse`,
`/standards/:id`, `/enablers`, `/enablers/:id`, `/about`).

## Screens / Views

### 1. Top Bar (persistent)
- **Layout**: full-width sticky header, inner content capped at `--maxw` (1140px),
  32px side padding. Flex row: brand (left) · nav · spacer · search affordance ·
  actions (app-picker icon button + avatar).
- **Brand**: 28-ish px rounded-square mark (blue, `--radius-sm`) with `layers` icon, then
  two-line lockup "Acme Standards" / small "Engineering · Build the right way".
- **Nav**: text links About / Browse / Enablers; active link uses `--ink`, others `--ink-3`.
- **Search affordance** (hidden on Home): pill with `search` icon, "Search standards", and
  a `/` `<kbd>`. Clicking routes to Browse.
- **App-picker**: icon button opens a popover grid of sibling apps (Service Catalog,
  Incidents, Runbooks, Dashboards, Infra Console, Security Hub, AI Platform). Current app
  highlighted.
- **Avatar menu**: initials avatar opens account popover (name/email/role + profile,
  saved, proposals, sign-out items).
- **Popover behavior**: close on outside-click and Escape (`usePopover` hook).

### 2. Home (`home.jsx`)
- **Hero** (dark): see "Hero System" below. Eyebrow, serif H1 with italic blue emphasis,
  lede, a large search bar, and search hint chips. A `layers`-style art glyph at right.
- Below hero (light surface): category entry points and featured/most-adopted standards.

### 3. Browse (`browse.jsx`)
- **Hero** (dark) with `search` icon art.
- **Body**: left filter rail (domain, compliance level, owning team, "available via
  enabler" toggle) + results list of `.std-row` items. Clicking a row → Standard Detail.

### 4. Standard Detail (`detail.jsx`)
- Header: standard code (mono), title (serif), `ComplianceBadge`, `StatusBadge`, owning
  team, last-updated date.
- Sections: the *why*, the rule itself, examples/config (code blocks from `tech-data.js`),
  and the enabler that satisfies it (`EnablerPill` → Enabler Detail).
- The prototype exposes 3 layout variants via Tweaks (`impact-hero`, `split-lens`,
  `editorial`) and enabler placement (`top`, `after-why`). **Pick ONE** for production —
  the default is `impact-hero` / enabler `top`. Confirm with the design owner.

### 5. Enablers (`enablers.jsx`)
- **Hero** (dark) with `bolt` icon art, eyebrow "Enterprise enablers", serif H1
  "The capability catalog", lede, and three stats (capabilities count, standards covered,
  compliant-by-default count).
- **Body**: grid of capability cards; each lists the standards it satisfies and coverage
  (full/partial). Clicking → Enabler Detail.

### 6. Enabler Detail (`enabler` view)
- Capability overview, the standards it covers and how, and adoption guidance.

### 7. About (`about.jsx`)
- **Hero** (dark). Then stacked `.about-section`s separated by 1px top borders:
  mission/vision cards, a **leadership letter** with signatures (David Okafor — Chief
  Information Officer; Priya Nair — Chief Data & AI Officer; Sofia Reyes — Chief
  Information Security Officer), the **Enterprise Architecture team** section (charter +
  4-person card grid: Head of EA, Principal Architect/Standards, Compliance & Governance
  Lead, Standards Program Manager), guiding principles, and a maturity model.

## Hero System (shared across Home, Browse, Enablers, About)
All four heroes are visually identical so the site reads as one system:
- **Background**: `linear-gradient(180deg, #0d1320 0%, #141b2e 100%)`.
- **Glow overlay** (`::before`): two radial gradients —
  `radial-gradient(900px 380px at 82% -10%, rgba(35,83,230,.32), transparent 60%)` and
  `radial-gradient(700px 320px at 0% 110%, rgba(35,83,230,.20), transparent 55%)`.
- **Sizing**: `min-height: 460px`, `padding: 56px 0`, `display:flex; align-items:center`
  (content vertically centered). Content wrapper is `position: relative` so it sits above
  the glow. **Keep all four heroes the same height.**
- **Foreground colors on dark**: H1 `#fff`; eyebrow + accents `#7fa0ff`; lede/body
  `#c4cbdb`; muted labels `#9aa6bd`.
- **Layout**: flex row, content left + large accent icon right (`color:#7fa0ff`, subtle
  blue drop-shadow). Icon hidden below 860px.
- **Typography**: eyebrow = mono 12.5px 600 uppercase, letter-spacing .08em; H1 = serif
  (Newsreader) 500, ~44–52px, line-height ~1.05, letter-spacing −.02em, with italic blue
  `<em>` emphasis.

## Interactions & Behavior
- **Navigation**: all view changes go through `go()`, which also `window.scrollTo(0,0)`.
- **Popovers** (app-picker, avatar): toggle on click; close on outside-click or Escape.
- **Hover states**: cards lift to `--border-3` border + `--shadow-sm`; rows highlight;
  links shift ink color. Transitions ~.15s.
- **Responsive**: team/card grids collapse 4→2 (≤860px) →1 (≤520px); hero art hidden
  ≤860px; `.wrap` keeps 32px gutters.
- **Copy convention**: **no em dashes anywhere in body copy** — use commas, colons, or
  parentheses. Preserve this if you edit text.

## State Management
Prototype state is local React state only:
- `route` — current view + params.
- `query` — home search box value.
- `t` (tweaks) — design-time only; **drop in production**.
In production, fetch Standards/Enablers/Teams from the API; derive Browse filters from
query params so filtered views are linkable.

## Design Tokens
All defined in `source/styles.css` `:root`. Key values:

**Surfaces & ink**
- `--bg #ffffff` · `--bg-sunken #f5f6f8` · `--bg-rail #fafbfc` · `--surface #ffffff`
- `--ink #0d1320` · `--ink-2 #3c4660` · `--ink-3 #6c768c` · `--ink-4 #98a1b3`
- `--border #e7e9ef` · `--border-2 #d8dbe4` · `--border-3 #c6cad6`

**Brand**
- `--blue #2353e6` · `--blue-700 #1c43bd` · `--blue-50 #eef2fe` · `--blue-100 #dde6fd`
- (Hero glow / on-dark accent uses `#7fa0ff`; hero bg `#0d1320`→`#141b2e`.)

**Compliance**
- Must `--must #c81e3a` / `--must-50 #fdecef`
- Should `--should #9a6206` / `--should-50 #fbf2e0`
- May `--may #2353e6` / `--may-50 #eef2fe`

**Status**
- `--active #1b7a4b` / `--active-50 #e7f4ec` · `--draft #9a6206` · `--deprecated #6c768c`

**Enabler accent** (paved path, aligned to brand blue)
- `--enabler #2353e6` · `--enabler-700 #1c43bd` · `--enabler-50 #eef2fe` · `--enabler-100 #dde6fd`

**Radius**
- `--radius-sm 7px` · `--radius 10px` · `--radius-lg 16px`

**Shadows**
- `--shadow-sm 0 1px 2px rgba(13,19,32,.04), 0 1px 3px rgba(13,19,32,.06)`
- `--shadow-md 0 2px 6px rgba(13,19,32,.05), 0 8px 24px rgba(13,19,32,.07)`
- `--shadow-lg 0 10px 40px rgba(13,19,32,.12)`

**Layout**
- `--maxw 1140px`; page gutters 32px; base font 16px / line-height 1.55.

**Typography families**
- `--sans "Public Sans", system-ui, sans-serif` — UI / body.
- `--serif "Newsreader", Georgia, serif` — editorial impact (hero H1s, section H2s).
- `--mono "IBM Plex Mono", ui-monospace, monospace` — codes, eyebrows, stat numbers.

## Assets
- **Fonts**: Google Fonts — Public Sans, Newsreader, IBM Plex Mono (loaded via `<link>`
  in `Standards Portal.html`). Use the codebase's font-loading mechanism.
- **Icons**: inline stroke-based SVG set in `components.jsx` (`ICONS` map, rendered by
  `<Icon>`). No raster assets. Map these to the codebase's icon library (Lucide/Feather
  are close equivalents) or port the SVG paths directly.
- **Imagery**: none — the design is type- and icon-driven. No photos to source.

## Files (in `source/`)
- `Standards Portal.html` — entry point / load order reference.
- `styles.css` — all tokens + component styles (the source of truth for visuals).
- `app.jsx` — shell, routing, top bar, footer.
- `components.jsx` — Icon set, badges, helpers.
- `home.jsx`, `browse.jsx`, `detail.jsx`, `enablers.jsx`, `about.jsx` — views.
- `data.js`, `tech-data.js` — sample content/data model shape.
- `tweaks-panel.jsx` — design-time controls; **not for production**.

## Notes for Implementation
- Treat `styles.css` `:root` as the canonical token set; reconcile with the codebase's
  existing tokens rather than introducing a parallel system.
- The standard-detail page has multiple prototype layout options behind Tweaks — ship the
  default (`impact-hero`) unless the design owner says otherwise.
- Keep the four heroes pixel-consistent (same gradient, glow, 460px min-height).
- Maintain the no-em-dash copy rule.

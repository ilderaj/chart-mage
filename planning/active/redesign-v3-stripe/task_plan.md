# Task Plan — ChartMage Redesign v3 (Stripe-aligned)

## Goal

Promote prototype `prototypes/redesign-v1/index.html` from static review artifact
into the live `app/` shipping experience, covering brand, intro page, editor
shell, charts drawer, and mobile fallback — without breaking the existing
Mermaid-based rendering pipeline or the Maestro smoke flow.

## Scope

**In scope**
- New brand mark + wordmark (SVG inline, replaces splash logo and intro logo).
- `app/intro.html` rewrite (hero / static demo / 3 features / dark band / footer).
- `app/index.html` editor shell (sticky nav + 50/50 panes + quick-insert bar +
  canvas tool-strip + slide-in My Charts drawer).
- CSS reorganization: keep `design-tokens.css` as single source of truth, add
  `app/css/landing.css` (intro-only) and refactor `main.css` into editor-only.
  Retire `intro.css` content into `landing.css`.
- Mobile fallback card on `intro.html` (no fake editor below 768px).
- Update splash screen markup so it uses new mark.

**Out of scope (deferred)**
- Mermaid renderer changes / theme overrides for the canvas.
- Editor JS behavior changes beyond what the new DOM requires
  (rename / delete / save / autosave logic stays).
- New features (export formats, sharing, themes).
- Replacement of jQuery / Codemirror / Slick stack.
- `browser.html` (IE redirect) rewrite — leave as-is.
- Removing legacy intro hero images (`sequence-lg.png`, `flowchart-lg.png`,
  `*.gif`); we stop referencing them but keep files for now.

## Constraints

- Must keep the existing build pipeline intact: `gulp` `useref` blocks
  (`<!-- build:css ... -->` / `<!-- build:js ... -->`) must stay valid; new
  CSS files added inside those blocks.
- Must keep Maestro `web-smoke.yaml` green: preserve **text** `Sample sequence diagram`,
  `Diagram Input`, `Live Preview`, `Chart Name`, `Sample flowchart`, `Maestro Smoke Flow`,
  **id** `new-flowchart-button`, `flowchart-name-input`, `show-charts-button`.
  If renaming, update `.maestro/flows/web-smoke.yaml` in the same patch.
- Reuse existing CSS variables in `design-tokens.css`. Do **not** introduce
  hardcoded brand colors at the page level.
- No new npm dependencies. Pure HTML/CSS/SVG additions only.
- Editor JS is jQuery-driven and event-bound by id/class — keep ids:
  `code`, `chart`, `show-charts-button`, `chartsList`, `confirm-delete-chart`,
  `rename-chart-modal`, `about-chart-mage`, `flowchart-syntax`,
  `sequence-diagram-syntax`, `newFlowchart`, `newSequenceDiagram`. Drawer is
  additive presentation; the modal IDs survive even if visually retired so
  jQuery handlers still bind.
- Min-width 768px lock in `main.css` stays — editor remains desktop-only.

## Phases

### Phase 1 — Brand assets (no app integration yet)
- Extract logo lockup from prototype into a reusable inline SVG snippet.
- Produce 3 sizes: 28px (nav), 36px (hero), 32px (favicon/app-icon).
- Generate `app/images/favicon.svg` (replaces / supplements `favicon.png`).
- Add a small `partials/logo.html` snippet committed alongside both pages
  (or duplicate inline — decide in Phase 2; jQuery has no template engine).
- **Verify**: visual diff against prototype; no JS/CSS loaded yet.

### Phase 2 — Landing rewrite (`intro.html` + `landing.css`)
- Replace `<body class="intro-page">` markup wholesale with prototype landing
  structure: nav, hero, static side-by-side demo SVG, features, dark band,
  footer CTA.
- Remove Slick carousel dependency from `intro.html` (`slick.css`, `slick.min.js`,
  `$('.carousel').slick(...)`). Static SVG demo replaces the rotating phone
  screenshots.
- New `app/css/landing.css` consolidating intro styles. Delete unused selectors
  from `intro.css` (or rename file to `landing.css` and update useref block).
- Keep the `localStorage.setItem("visited", ...)` click handler on the primary
  CTA so first-visit redirect logic in `index.html` still works.
- Mobile (<768px): swap demo card for the "come back on desktop" message card;
  keep CTA visible.
- **Verify**:
  - `npm run uat:serve` then visit `/intro.html` — visual matches prototype.
  - Click "Start drawing" → lands on `/index.html` with `visited` set.
  - Resize to 375px width → mobile fallback card visible, no horizontal scroll.

### Phase 3 — Editor shell (`index.html` + `main.css`)
- Replace splash screen logo with new mark (keep splashscreen background).
- Replace top `<nav>` with new sticky `app-nav`: logo, chart-pill (name +
  Seq/Flow type), save state, action buttons (My Charts, Help, Export,
  primary "+ New chart"). Wire to existing handlers:
  - "My Charts" → `#show-charts-button` click handler (open drawer instead of
    modal — see Phase 4).
  - "Help" → opens current `flowchart-syntax` / `sequence-diagram-syntax`
    modals based on `controller.currentChart.type`.
  - "Export" → existing export handler (find in `app.js`).
  - "+ New chart" → opens a small popover or directly the existing
    `newSequenceDiagram` / `newFlowchart` modals (popover with two choices).
- Workspace: keep `<section class="editor">` and `<section class="diagram">`
  IDs/classes that `app.js` and CodeMirror rely on (`#code`, `#chart`).
- Add quick-insert bar above CodeMirror; clicking a chip dispatches an
  `insertText` into the CodeMirror instance (read existing `editor` global).
- Add canvas tool-strip (Fit / 100% / Dark) — Fit/100% are zoom-only DOM
  transforms on `#chart`; Dark toggles a class on the canvas wrapper. **Skip
  Dark** if Mermaid theme switching is non-trivial; ship as visual-only chip
  marked `disabled` and remove from final pass.
- Preserve all modal divs (`newFlowchart`, `newSequenceDiagram`,
  `showChartsList`, `confirm-delete-chart`, `rename-chart-modal`,
  `about-chart-mage`, `flowchart-syntax`, `sequence-diagram-syntax`,
  `chart-not-found`) — their content can be restyled but ids/structure stay so
  jQuery handlers don't break.
- **Verify**:
  - Editor opens, code renders into canvas (existing flow).
  - Create a new flowchart via "+ New chart" → modal → submit → canvas updates.
  - Maestro: `npm run uat:serve && npm run uat:smoke` passes.

### Phase 4 — Charts drawer
- Convert `#showChartsList` modal opening into a side drawer.
- Approach: keep the existing modal markup as a hidden source-of-truth for
  jQuery, but render a parallel `<aside class="drawer hidden">` and toggle it
  with the same `#show-charts-button` handler. Reuse `controller.getAllCharts()`
  to populate drawer items; bind rename/delete inline-on-hover icons that
  trigger the *existing* `#rename-chart-modal` and `#confirm-delete-chart`
  modals (those keep working unchanged).
- Drawer behavior:
  - Slide in from right, 360px.
  - Backdrop: dim the workspace at 0.55 opacity, click-outside-to-close.
  - Search box filters items in-memory.
  - Empty state when no charts.
- **Verify**:
  - Maestro `assertVisible: "Sample flowchart"` and
    `assertVisible: "Maestro Smoke Flow"` still pass — both texts must render
    as drawer items.
  - Manual: create chart → appears in drawer; rename → name updates; delete →
    confirm flow works.

### Phase 5 — Cleanup & QA
- Remove dead CSS rules from `main.css` / `intro.css` once new files prove
  stable.
- Remove unused image references in HTML (keep files in `app/images/` for now;
  delete in a follow-up commit after a week).
- Update `app/index.html` `<title>` and `<meta description>` if copy changes.
- Run `npx gulp` to ensure dist build succeeds (useref blocks intact).
- Final Maestro smoke run.
- Manual checklist (Phase 5 verify section in `progress.md`).

## Verification Plan

- **Unit-ish (visual)**: side-by-side compare each phase's output against
  `prototypes/redesign-v1/index.html` sections at 1280px and 768px viewports.
- **Smoke**: `npm run uat:smoke` after Phase 2, Phase 3, Phase 4.
- **Build**: `npx gulp` after Phase 5 — must produce `dist/` without errors.
- **Manual checklist** in `progress.md` Phase 5: create chart, edit code,
  rename, delete, switch chart, export PNG, About modal, syntax help modal,
  first-visit redirect, mobile redirect.

## Risks & Open Questions

1. **CodeMirror theme** — current editor uses base16-ish classes already
   tinted to brand. Quick-insert chips dispatching `editor.replaceSelection()`
   needs the global `editor` variable from `app.js`; confirm it's exposed
   (`window.editor`) before Phase 3 starts.
2. **Mermaid canvas styling** — `chart-default.css` is consumed by Mermaid;
   not changing it in this redesign. The "Dark" canvas chip is therefore
   tentative; default to dropping it if it requires Mermaid re-init.
3. **Drawer + jQuery Modal coexistence** — reusing rename/delete modals from
   the drawer triggers re-entrant `$.modal` calls; verify
   `closeExisting: false` keeps drawer open underneath. Falls back to closing
   drawer first if modal stack misbehaves.
4. **Logo SVG duplication** — without a templating layer we'll inline the
   logo SVG twice (intro + index + splash). Acceptable cost; consolidate later
   if Gulp gets a partial step.
5. **Legacy assets** — keeping `app/images/*.gif` and `*-lg.png` even though
   intro stops referencing them inflates `dist/`. Defer deletion to follow-up
   PR per scope decision above.

## Deliverables

- `app/intro.html` — rewritten landing.
- `app/index.html` — rewritten editor shell with drawer.
- `app/css/landing.css` — new (or `intro.css` rewritten in place; decide in
  Phase 2 to minimize useref churn).
- `app/css/main.css` — refactored editor styles + drawer styles.
- `app/images/favicon.svg` — new mark.
- `.maestro/flows/web-smoke.yaml` — only if selectors changed; goal is no diff.
- `prototypes/redesign-v1/index.html` — kept as reference, no changes.

## Phase status

- [x] Phase 1 — Brand assets
- [x] Phase 2 — Landing rewrite
- [x] Phase 3 — Editor shell
- [x] Phase 4 — Charts drawer
- [x] Phase 5 — Cleanup & QA

See `progress.md` for execution log and `findings.md` for in-flight notes.

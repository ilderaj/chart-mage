# Progress — Redesign v2 Implementation

## Current phase

Phase E — Verification & cleanup (not started). Phases A + B + C + D complete.

## Log

- **2026-04-30** — Stage-1 prototype review closed (user approved sections 03 /
  05 / 06 / 07 + the shortened flowchart sample). Promoted from
  `redesign-v2-prototype/` Phase 2 (review) into `redesign-v2-impl/` Phase A.
- **2026-04-30** — `task_plan.md` + `findings.md` drafted. Token diff captured
  (12 promotable tokens; 1 review-only excluded). Phase A → E sequenced with
  Maestro retest budget per phase.
- **2026-04-30** — Phase A complete. 12 new tokens appended to
  `app/css/design-tokens.css` `:root` under a `/* v2 prototype additions */`
  comment block. Hex audit confirmed no *new* raw-hex violations introduced;
  pre-existing legacy hex in `chart-default.css` / `landing.css` / `main.css` /
  `intro.css` / vendor stylesheets is out of scope and will be naturally
  replaced when those files are rewritten in Phases B and C.

## Next action

Begin Phase E: run `./scripts/run-maestro-web-smoke.sh`, verify
`./node_modules/.bin/gulp` builds, and visually sweep the editor at
1440/1024/768/375. Then archive both `redesign-v2-prototype/` and
`redesign-v2-impl/` task folders into `planning/archive/<timestamp>-redesign-v2/`.

## Phase D notes (2026-04-30)

- Replaced `modal._flowchartExample` in `app/js/app.js` with the calmer v2
  5-node sample (using ChartMage's own DSL, not raw Mermaid):
  ```
  ((Start)) ->> Has draft?
  Has draft? - yes ->> Open editor
  Has draft? - no ->> New chart
  Open editor ->> Edit
  New chart ->> Edit
  ```
- Direction stays `"TB"` (top-to-bottom), so `_translateFlowchart` emits
  `graph TB`, matching the prototype canvas (Start at top, Edit merge at
  bottom).
- Chart name `Sample flowchart` unchanged — Maestro `assertVisible: "Sample
  flowchart"` (.maestro/flows/web-smoke.yaml line 21) still resolves.
- Constant is referenced both at first-run init (line 295) and from
  `newChart()` defaults (line 359); single-source change covers both.

## Phase C notes (2026-04-30)

- `app/index.html`: pane chrome restructured around the existing
  `workspace*` markup (preserved to keep app.js bindings stable).
  - Editor `<section class="editor">`: `.workspaceHeader` now also carries
    `pane-header` (slim 44px); new `.pane-footer.pane-footer-input` shows
    `● parsed ok · local autosave … Mermaid syntax`.
  - Preview `<section class="diagram">`: stripped the in-header preview chip
    row; header now shows `Live Preview` title + right-side
    `.pane-render-state` (`● rendered`). New `.pane-footer.pane-footer-preview`
    sibling hosts `Fit / 100% / Dark` (`.preview-chip`s, behavior unchanged)
    and a new `.export-trigger` button.
- `app/js/app.js`: widened the export click selector from `$("#export-diagram")`
  to `$(document).on("click", "#export-diagram, .export-trigger", …)` so the
  topnav icon and the new footer button share the existing handler. No new
  behavior; same flow.
- `app/css/main.css`: `.workspacePanel` becomes a flex column;
  `.workspaceHeader` enforced to 44px with eyebrow / description hidden
  inside the slim header; `.workspaceTitle` shrunk to 13px to fit; new
  `.pane-footer` 38px row with mono typography, plus `.pane-render-state` and
  `.export-trigger` styles using `--color-heading` / `--color-brand-strong`.
  Removed the now-stale `.diagram .previewToolbar` in-header overrides.
- Maestro contract: 12 expected text/id hits found in `app/index.html`
  (`Diagram Input`, `Live Preview`, `new-flowchart-button`,
  `flowchart-name-input`, `show-charts-button`, `Chart Name`, `Create`, …).
  Smoke harness will be re-run as part of Phase E.
- Hex audit: no *new* raw-hex introduced by Phase C. Legacy hex in
  `main.css` (lines 25 / 38 / 92 / 109 / 117 / 226 / 265 / 271 / 290 / 365 /
  398 / 550 / 565 / 736 / 740 / 970 / 995) is pre-existing v3 chrome and
  out of scope; will be revisited in a future hex-cleanup pass.

## Phase B notes (2026-04-30)

- Replaced `app/intro.html` body wholesale with v2 single-screen composer:
  cm-mark SVG sprite, `.intro-frame > .intro-shell` (topbar + intro-fork-pill
  linking to heyjunlin/chart-mage, eyebrow + gradient `<em>` headline + lede,
  `.try-it` dual-pane composer with sequence sample and Live Preview SVG,
  intro-actions with `Open in editor →` primary CTA, intro-footnote).
- Mobile (<768px): hide `.intro-frame`; show `.intro-mobile` fallback card
  with a small preview thumbnail and `start-drawing` CTA.
- Preserved exactly: `<head>` (charset, viewport, description, title,
  favicons, GA), useref `<!-- build:css css/intro.min.css -->` block
  (normalize.css + design-tokens.css + landing.css), and the
  `localStorage.setItem('visited', Date.now())` handler bound to
  `.start-drawing` clicks (drives index.html's first-visit gate).
- Replaced `app/css/landing.css` wholesale with v2 intro styles. All colors
  reference design tokens; only one decorative hex remains
  (`#f5a623` — middle traffic-light dot, no semantic token), unchanged from
  prototype intent.
- Verified offline: useref block intact, sprite + fork pill + CTA + visited
  handler present; v3 leftovers (`site-header`, `hero-section`, `feature-grid`,
  `site-shell`, `dark-band`) all gone.
- Maestro impact: intro page is not part of `?maestro=1` flow; selectors live
  on `app/index.html` and remain untouched. No retest needed for Phase B.

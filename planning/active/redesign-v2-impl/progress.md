# Progress — Redesign v2 Implementation

## Current phase

Phase C — Editor chrome (not started). Phases A + B complete.

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

Begin Phase C: refresh editor chrome (`app/index.html` topbar/footer +
`app/css/main.css`) using the new tokens — keep all Maestro selectors
(`new-flowchart-button`, `flowchart-name-input`, `show-charts-button`,
"Diagram Input", "Live Preview", etc.) intact.

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

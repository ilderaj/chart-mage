# Task Plan — Redesign v2 Implementation

## Goal

Promote the approved Stage-1 prototype `prototypes/redesign-v2/index.html` into
the live `app/` shipping experience, replacing the v3 visual layer with the v2
direction (extreme-minimal intro single-screen, refined editor 50/50 with
shorter quiet flowchart sample, equal-height pane chrome, footer-hosted zoom &
export controls, right-slide drawer).

This task starts from the v3-shipped baseline (`app/intro.html`,
`app/index.html`, `app/css/landing.css`, `app/css/main.css`,
`app/css/design-tokens.css`, `app/js/app.js`) and migrates only the visual /
markup layer.

## Scope

### In scope

- Token additions to `app/css/design-tokens.css` (gradients, canvas, editor
  surfaces, syntax colors).
- `app/intro.html` rewrite to the v2 single-screen minimal layout.
- `app/css/landing.css` simplification to match v2 intro.
- `app/index.html` chrome rewrite: pane-header equal heights, preview header
  stripped of inline tool-strip, new `.pane-footer` row hosting zoom + export.
- `app/css/main.css` updates to support the new editor chrome.
- Sample-chart content alignment: shorten the bundled "Sample flowchart" so it
  matches the calmer prototype canvas (5 nodes, no dead `Render?` branch).
  Keep the IDs / labels Maestro relies on.
- Mobile fallback: keep the existing v3 mobile card on `intro.html`; verify
  intro single-screen still hides cleanly below 768px.

### Out of scope

- Mermaid renderer changes / theme overrides / dark-mode work.
- JS behavior changes beyond DOM-id preservation.
- New features (export formats, sharing, real-time collab).
- Replacing jQuery / CodeMirror / Slick stack.
- `browser.html` (IE redirect) rewrite.
- Touching `prototypes/`.

## Constraints

- **Maestro selectors must keep passing** (`.maestro/flows/web-smoke.yaml`):
  text `Diagram Input`, `Live Preview`, `Sample sequence diagram`,
  `Sample flowchart`, `Chart Name`, `Maestro Smoke Flow`, `Create`;
  ids `new-flowchart-button`, `flowchart-name-input`, `show-charts-button`.
  Run `./scripts/run-maestro-web-smoke.sh` before declaring done.
- **`?maestro=1`** first-visit bypass on `index.html` must keep working.
- **No new npm dependencies**; pure HTML / CSS / SVG additions.
- **No raw hex outside `:root`** — every new color must read from a token.
- **Preserve existing modal IDs** so jQuery handlers continue to bind:
  `newFlowchart`, `newSequenceDiagram`, `showChartsList`, `confirm-delete-chart`,
  `rename-chart-modal`, `about-chart-mage`, `flowchart-syntax`,
  `sequence-diagram-syntax`, `chart-not-found`.
- **Preserve editor-target IDs**: `code`, `chart`, `chartsList`,
  `chart-pill` / chart name DOM (whatever `editorView` reads).
- **gulp `useref` blocks intact**: any new CSS file must be added inside
  `<!-- build:css ... -->` blocks; no orphan `<link>`s.
- **Cloudflare Pages deploy** continues to publish `app/` unmodified.

## Token diff (prototype → canonical)

New tokens to **add** to `app/css/design-tokens.css`:

| Token                       | Value                                                                                       | Notes                                       |
| --------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `--gradient-brand`          | `linear-gradient(135deg, #533afd 0%, #8b5cf6 45%, #ea2261 78%, #f96bee 100%)`               | Hero accent, mark fill                      |
| `--gradient-mark`           | `linear-gradient(135deg, #4434d4 0%, #533afd 35%, #8b5cf6 70%, #ea2261 100%)`               | Logo lockup                                 |
| `--gradient-soft`           | `linear-gradient(180deg, rgba(83,58,253,0.06) 0%, rgba(83,58,253,0) 100%)`                  | Section halos                               |
| `--color-canvas-bg`         | `#fbfcfe`                                                                                   | Preview canvas surface                      |
| `--color-canvas-grid`       | `rgba(83, 58, 253, 0.10)`                                                                   | Preview dot grid                            |
| `--color-editor-bg`         | `#ffffff`                                                                                   | Alias of `--color-surface`; keep distinct for legibility |
| `--color-editor-gutter`     | `#f6f9fc`                                                                                   | Alias of `--color-bg`                       |
| `--color-editor-active`     | `rgba(83, 58, 253, 0.05)`                                                                   | CodeMirror active line                      |
| `--color-syntax-keyword`    | `#533afd` *(= `--color-brand`)*                                                             | Could alias; keep explicit name             |
| `--color-syntax-string`     | `#108c3d`                                                                                   | Distinct from `--color-success` `#15be53` (need darker green for code AA) |
| `--color-syntax-arrow`      | `#ea2261` *(= `--color-danger`)*                                                            | Could alias; keep explicit name             |
| `--color-syntax-comment`    | `#94a3b8`                                                                                   | Slate-400                                   |

Tokens **not** promoted (prototype-internal review chrome): `--proto-bg`.

Existing tokens reused unchanged: all of `--color-bg`, `--color-surface`,
`--color-heading`, `--color-text`, `--color-text-muted`, `--color-brand*`,
`--color-border*`, `--color-danger`, `--color-success`, `--shadow-*`,
`--radius-*`, `--space-*`, `--transition-base`, `--focus-ring`.

## Phases

### Phase A — Token promotion

- Append the 12 new tokens to `app/css/design-tokens.css` `:root` block, after
  the existing `--focus-ring` line. Group with a `/* v2 prototype additions */`
  comment so future cleanup is obvious.
- Verify no selector outside `:root` introduces raw hex equivalent of these
  values; if any pre-existing `main.css` / `landing.css` rule already hardcodes
  e.g. canvas background, swap to the new var in the **same** phase to avoid
  drift.
- **Verify**: `rg -n '#[0-9a-fA-F]{3,8}' app/css | rg -v 'design-tokens.css'`
  returns zero new violations.

### Phase B — Intro single-screen

- Rewrite `app/intro.html` body from v3 (hero/demo/features/dark-band/footer)
  to v2 minimal (logo + headline + try-it textarea + inline preview SVG +
  primary CTA + small footer credit + fork pill).
- Drop landing structures no longer needed: features grid, dark band, screenshot
  carousel scaffolding (already removed in v3 — re-confirm).
- Replace `app/css/landing.css` content with the v2 intro CSS extracted from
  the prototype's section 03 + intro-shell rules. Keep file name (no
  `useref` block edits required).
- Preserve `localStorage.setItem("visited", ...)` click on the primary CTA.
- Keep mobile fallback card markup; ensure the new single-screen container
  `.intro-shell` collapses cleanly under 768px.
- Logo: reuse the connector mark already at `app/images/favicon.svg` (no
  Phase 1 brand re-extract needed).
- **Verify**:
  - `python3 -m http.server 8000 --directory app` → `http://127.0.0.1:8000/intro.html`
  - Visual diff against prototype section 03 / intro-shell.
  - Click "Start drawing" → `localStorage.visited === '1'` set, navigates to
    `/index.html`.
  - Resize to 375 px → mobile fallback card visible.

### Phase C — Editor chrome

- `app/index.html` edits scoped to nav + workspace structure:
  - Top nav unchanged from v3 (already matches v2 direction).
  - `<section class="editor">` pane-header: enforce equal-height with preview
    pane-header (44 px), keep `Diagram Input` text + meta line.
  - `<section class="diagram">` pane-header: strip inline tool-strip
    (Fit / − / readout / + / Export). Keep `Live Preview` text + meta line +
    `● rendered` indicator on the right.
  - Add `.pane-footer` row to **both** input and preview panes:
    - Input footer: `● parsed ok · N nodes ……… [+ snippet] · Ln C, Col C`
      (delegates `+ snippet` click to existing quick-insert handler).
    - Preview footer: `W × H · zoom% ……… [Fit] [−] 100% [+] [⤓ Export]`,
      where Fit / zoom buttons drive the existing canvas-zoom code in
      `app.js`, and Export wires to the existing export handler.
- `app/css/main.css` updates:
  - `.pane-header { height: 44px; box-sizing: border-box; flex-shrink: 0; }`
  - New `.pane-footer` rules (height ~38–40 px, mono font, tabular-nums).
  - Remove orphaned `.tool-strip.inline` rules (preview-header inline
    tool-strip is gone).
  - Add `.canvas-corner.br` lightweight pulse + timing badge.
- **Preserve all existing IDs/classes** that `app.js` and CodeMirror touch.
- **Verify**:
  - Editor opens, `editorView` renders into `#chart`.
  - Zoom + / − / Fit buttons in new `.pane-footer` correctly drive the canvas.
  - Export button triggers existing export flow.
  - `?maestro=1` bypass still skips the first-visit gate.

### Phase D — Sample chart shortening

- Update the bundled "Sample flowchart" content (currently the dead-end
  `Render?` branched chart) to the calmer v2 sample: 5 nodes ending at `Edit`,
  with `yes` / `no` branches off `Has draft?`. Source of this content is
  whichever `app.js` constant or template ships the default flowchart body —
  search for the existing `graph TD` literal.
- Do **not** rename the chart (`Sample flowchart` text required by Maestro).
- **Verify**:
  - Open the editor with a fresh `localStorage` → "Sample flowchart" appears
    in the drawer with the new 5-node body and renders cleanly.
  - Maestro selector text `Sample flowchart` still resolves.

### Phase E — Verification & cleanup

- `rg -n '#[0-9a-fA-F]{3,8}' app/css | rg -v 'design-tokens.css'` → zero hits.
- `./scripts/run-maestro-web-smoke.sh` → green.
- `./node_modules/.bin/gulp` → completes (build pipeline still healthy).
- Manual visual sweep at 1440 / 1024 / 768 / 375 widths.
- Update `planning/active/redesign-v2-impl/progress.md` with verification log.
- Move both `redesign-v2-prototype/` and `redesign-v2-impl/` task folders into
  `planning/archive/<timestamp>-redesign-v2/` once shipped.

## Phase status

- [ ] Phase A — Token promotion
- [ ] Phase B — Intro single-screen
- [ ] Phase C — Editor chrome
- [ ] Phase D — Sample chart shortening
- [ ] Phase E — Verification & cleanup

## Risks

- **Maestro fragility**: pane-header / pane-footer markup churn near the text
  selectors `Diagram Input` / `Live Preview` could break id-less selectors.
  Mitigation: keep the exact title spans intact; any reflow happens around
  them.
- **Zoom button rewiring**: the existing `app.js` likely binds zoom to the v3
  `.tool-strip.inline` button selectors. Phase C must search-and-update those
  selectors to the new `.pane-footer .pane-icon-btn[title="Zoom in" / out / Fit]`
  bindings. Do this in the same patch as the markup move to avoid a broken
  intermediate state.
- **Sample flowchart text drift**: shortening the sample changes the rendered
  diagram size; verify the canvas auto-fit still feels balanced (no large
  whitespace blocks).

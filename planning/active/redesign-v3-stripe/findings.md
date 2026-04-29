# Findings — Redesign v3 implementation

## Codebase facts (verified)

- Stack: jQuery 3.1, jQuery Modal, CodeMirror, Slick (intro only),
  mermaidAPI, gulp + useref + uglify + cssnano. No bundler, no framework.
- Build: `gulp` reads `<!-- build:css ... -->` / `<!-- build:js ... -->`
  blocks in `app/*.html` and emits to `dist/`. Adding/removing CSS or JS files
  must be done **inside** those blocks.
- Editor entry: `app/index.html`. Splash screen has hard-coded SVG wordmark
  (lines ~40–48). First-visit and IE redirects live in inline `<script>`
  before splash.
- Marketing entry: `app/intro.html`. Uses Slick carousel for hero phone +
  desktop screenshots; cleans up `.cover` on ready.
- CSS tokens: `app/css/design-tokens.css` already defines brand palette,
  shadows, radii, spacing — prototype reuses these 1:1.
- Min-width: `app/css/main.css` sets `body { min-width: 768px }` — editor
  is desktop-only by hard rule.
- `app/index.html` already had a partial workspace polish layer before this
  redesign pass. The safest path is additive shell refinement, not a full
  rewrite of the editor DOM or Mermaid pipeline.

## DOM contract (must preserve)

Selectors that **app.js** binds to (verified by reading `app/js/app.js`):
- `#code` — CodeMirror textarea.
- `#chart` — Mermaid render target.
- `#show-charts-button`, `#chartsList tbody`, `.select-chart`,
  `.delete-chart`, `.rename-chart`.
- Modals: `#newFlowchart`, `#newSequenceDiagram`, `#showChartsList`,
  `#confirm-delete-chart`, `#rename-chart-modal`, `#about-chart-mage`,
  `#chart-not-found`, `#flowchart-syntax`, `#sequence-diagram-syntax`.
- Forms: `form.new-chart[data-chart-type]`, `#rename-form`.
- Inputs: `#flowchart-name-input`, `#sequence-diagram-name-input`,
  `#rename-input`.

## Maestro contract (must preserve OR co-update)

`.maestro/flows/web-smoke.yaml` asserts:
- Visible text: `Sample sequence diagram`, `Diagram Input`, `Live Preview`,
  `Chart Name`, `Sample flowchart`, `Maestro Smoke Flow`.
- Tappable id: `new-flowchart-button`, `flowchart-name-input`,
  `show-charts-button`.
- Tappable text: `Create`.

Decision: keep all of these texts/ids in the new markup. The drawer item
list still renders chart names verbatim → `Sample flowchart` / `Maestro
Smoke Flow` assertions hold.

## Open questions / pending verifications

- [x] CodeMirror instance is **not** exposed as `window.editor`; it lives on
  `editorView._editor`. Quick-insert chips must route through an
  `editorView` method (`insertSnippet`) instead of assuming a global.
- [x] Existing PNG export handler already exists in `app/js/app.js` and can be
  reused directly for the new nav Export control.
- [ ] Mermaid version — does the current build support a dark theme via
      `mermaid.initialize({ theme: 'dark' })` without re-render glitches?
      If not, drop the Dark chip in Phase 3.
- [x] First-visit redirect behavior survives the landing rewrite because the
  CTA still writes `localStorage.visited` before navigating to `index.html`.
- [x] Global removal of `.hidden` at startup is unsafe now that drawer/backdrop
  also use that class. Initial reveal must target only `nav.app-nav` and
  `main`.
- [x] `npm run uat:smoke` was failing for the same underlying Maestro problem
  tracked under `maestro-uat-setup`, not a redesign-only regression. The
  local DOM trigger (`form.name` returning object values) has now been
  removed and the smoke flow passes again.
- [ ] Gulp build verification currently depends on installing the repo's pinned
  devDependencies first. With no `node_modules/`, `npx gulp` prompts for a
  transient `gulp@5.0.1` install, which is not a trustworthy substitute for
  the repo's declared `gulp@^3.9.1` toolchain.

## Decisions log

- 2026-04-29: Use the connector mark (gradient rounded-square + two nodes
  joined by a line) as logo, per user approval.
- 2026-04-29: Drawer replaces `#showChartsList` modal visually but keeps
  rename/delete handlers routed through the existing jQuery Modals.
- 2026-04-29: SVG demo (no GIFs) for hero. Slick carousel removed from
  intro page.
- 2026-04-29: SVG text rendering quirk found in prototype — `<text>` inside
  a stroked `<g>` inherits the stroke. Always isolate text into a
  `stroke="none"` group with explicit font-family.
- 2026-04-29: Preserve smoke-visible strings (`Diagram Input`, `Live Preview`,
  `New Flowchart`, `My Charts`) verbatim while modernizing shell structure.
- 2026-04-29: Keep the preview Dark chip visible but disabled until Mermaid
  theme switching is proven safe.
- 2026-04-29: Promote stable UAT ids `new-flowchart-button` and
  `show-charts-button` into the live DOM so Maestro Web does not rely on
  fragile text matching for the main nav actions.

## Reference

- Prototype: `prototypes/redesign-v1/index.html`
- Spec: `DESIGN.md` (Stripe-inspired system, sections 1–9)
- Tokens: `app/css/design-tokens.css`

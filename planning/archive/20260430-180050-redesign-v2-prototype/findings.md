# Findings — Redesign v2 Prototype

## Inputs

- v3 implementation already shipped (`redesign-v3-stripe` task complete).
- Direction locked via user clarification:
  - Editor: refine 50/50 (option A).
  - Intro: extreme-minimal single screen (option C).
  - Deliverable: single combined `prototypes/redesign-v2/index.html` (option A).
- Roadmap V1 (`planning/active/project-roadmap-readme/private_roadmap.md`):
  must surface original-project credit (link to `https://github.com/heyjunlin/chart-mage`),
  drop personal contact paths, replace UA-86337828-1 ownership.
- Tokens already exist in `app/css/design-tokens.css` (Stripe palette,
  shadows, radii, spacing). Prototype adds:
  - `--gradient-brand` (purple→ruby→magenta).
  - `--gradient-mark` (mark fill).
  - `--color-canvas-grid` (preview canvas dot grid).
  - `--color-editor-bg`, `--color-editor-gutter`, `--color-editor-active`.

## Decisions

- 2026-04-30: Connector mark stays but is sharpened — rounded-square plate +
  two nodes on a slanted edge connector + subtle inner shadow. Logo now
  reads as "diagram object", not just an abstract shape.
- 2026-04-30: Intro page drops feature grid, dark band, and footer CTA from
  v3. Single viewport: brand + tagline + try-it input + inline preview + one
  CTA + fork-credit microcopy.
- 2026-04-30: Editor input pane gains a true line-gutter container (visual
  only in prototype) with parse-status footer; quick-insert chips move from
  above CodeMirror to a sticky toolbar inside the pane header.
- 2026-04-30: Preview pane gains dot-grid background using
  `--color-canvas-grid`, plus a tool strip with Fit / 100% / Reset / Copy SVG
  / Export PNG (Theme deferred).
- 2026-04-30: About modal foregrounds fork credit as a labeled section, not
  a footer afterthought.

## Open questions for Phase 3 (not Phase 1)

- Does the new line-gutter container survive CodeMirror's existing DOM, or
  do we need to wrap CodeMirror in a sibling gutter overlay?
- Mermaid SVG export — current handler returns a raster PNG; "Copy SVG"
  needs validation against the actual `#chart svg` node.
- Drawer empty state copy — pending review.

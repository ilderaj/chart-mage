# Task Plan — Redesign v2 Prototype (post-v3 refresh)

## Goal

Push the visual & interaction design beyond the just-shipped v3 (Stripe-aligned)
implementation. Deliver a Stage-1 `prototypes/redesign-v2/index.html` review
artifact (single combined file, like v1) covering brand, intro, editor shell,
drawer, modals, and mobile fallback — all pulling tokens from
`app/css/design-tokens.css` plus a small set of new tokens introduced inline.

Implementation into `app/` is **out of scope** until the prototype is approved.

## Scope (Stage 1 — prototype only)

**In scope**
- Refreshed brand mark (gradient connector / diamond) + wordmark in 3 sizes.
- New design-token additions (gradients, editor surfaces, canvas grid).
- Intro page **single-screen minimal**: logo + one-liner + try-it textarea +
  inline preview + CTA → `/index.html`. Fork credit footnote, fork pill.
- Editor refined 50/50: top nav with chart pill / save state / quick actions,
  input pane with line-gutter container + quick-insert row + status footer,
  preview pane with tool strip + grid canvas + zoom indicator.
- Right-slide My Charts drawer with search + sort + per-row hover actions +
  empty state.
- Modal restyle: New chart picker, syntax help, About (with prominent
  original-project credit per private roadmap V1).
- Empty / parse-error / chart-not-found states.
- Mobile fallback for intro (`<768px`) and editor desktop-only gate.

**Out of scope (Stage 1)**
- Touching `app/intro.html`, `app/index.html`, `app/css/*.css`.
- Mermaid theme/dark mode work.
- JS behavior changes.
- Maestro flow updates.

## Direction (locked)

- Editor layout: refine current 50/50 (top nav + left input / right preview).
- Intro: extreme-minimal single screen.
- Deliverable: single combined `prototypes/redesign-v2/index.html`.

## Roadmap alignment (private V1 + V2)

- V1 (fork identity): About modal section + intro footer link to
  `https://github.com/heyjunlin/chart-mage`. No personal contact paths.
  Fork-status pill in top nav.
- V2 (unified design language): every surface in this prototype consumes
  shared tokens; About / Help / drawer / modals all read as one system.

## Phases

### Phase 1 — Prototype (this stage)
- Create `prototypes/redesign-v2/index.html`.
- Add design-token swatches, type scale, shadow ladder.
- Build all sections listed above into a single scrollable review file.
- **Verify**: open via `python3 -m http.server` from repo root, scroll review.

### Phase 2 — User review & iteration (out-of-band)
- Capture review feedback into `findings.md`.
- Iterate prototype only; do not touch `app/`.

### Phase 3 — Token diff & implementation plan
- Diff prototype tokens against `app/css/design-tokens.css`.
- Write a follow-up implementation plan (intro.html + index.html + CSS) under
  `planning/active/redesign-v2-impl/` with Maestro selector preservation rules
  inherited from the v3 task.

### Phase 4 — Implementation (separate task)
- Promote prototype into `app/` per Phase-3 plan.
- Out of scope here; tracked separately.

## Verification

- Visual: scroll prototype at 1440 / 1024 / 768 / 375 widths.
- Token referential integrity: every color/shadow/radius read from a CSS
  variable; no raw hex outside the `:root` token block.
- Roadmap V1 surfaces: About credit, intro footer credit, no personal contact
  link present.

## Phase status

- [x] Phase 1 — Prototype
- [x] Phase 2 — Review & iterate
- [x] Phase 3 — Token diff & impl plan (handed off to `planning/active/redesign-v2-impl/`)
- [ ] Phase 4 — Implementation (tracked under `redesign-v2-impl`)

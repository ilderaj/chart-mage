# ChartMage Stripe Design Language Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align ChartMage's visual language with the installed Stripe-inspired `DESIGN.md` while preserving the current static-site architecture and editor-first product behavior.

**Architecture:** Keep the existing static HTML pages and CSS file split, and introduce a thin design-token layer in CSS before restyling page surfaces. Apply the new language in this order: shared primitives, marketing/entry pages, main app shell, then modal/editor/chart polish.

**Tech Stack:** Static HTML, global CSS, jQuery, CodeMirror, Mermaid, Gulp build comments, root `DESIGN.md`

---

## Active Task Link

- Active task path: `planning/active/stripe-design-md-align/`
- Lifecycle state: `waiting_review`
- Sync-back status: `plan written, summary synced to active task files`

## Current Findings That Shape The Plan

- The `getdesign` install completed successfully and added a root-level `DESIGN.md`.
- The workspace remains a static front-end project; no component system or token pipeline exists yet.
- User-facing surfaces are split across three entry points: `app/index.html`, `app/intro.html`, and `app/browser.html`.
- Visual styling is currently concentrated in `app/css/main.css`, `app/css/intro.css`, and inline CSS in `app/browser.html`.
- Current UI uses mixed legacy colors (`#02C385`, `#4E6589`, `#F4F7F9`) and system fonts that diverge from the new Stripe-inspired palette and typography.

## Scope

### In Scope

- Introduce a shared token vocabulary based on `DESIGN.md`
- Align global typography, color, border radius, and elevation
- Restyle entry pages and application chrome to match the new design language
- Unify button, modal, nav, and label treatments
- Preserve existing behavior and content structure unless a visual adjustment requires minor markup support

### Out Of Scope

- Rewriting the app into a framework
- Redesigning chart rendering semantics in Mermaid
- Replacing CodeMirror or changing editor behavior
- Large IA/content rewrites

## File Map

### Modify

- `DESIGN.md` if minor project-specific clarifications are needed after implementation
- `app/index.html` for any small markup hooks needed by the shared design layer
- `app/intro.html` for CTA, hero, and section structure hooks if necessary
- `app/browser.html` to remove inline visual drift and align the fallback page
- `app/css/main.css` for app-shell token adoption and component restyling
- `app/css/intro.css` for landing-page alignment

### Create

- `app/css/design-tokens.css` as the shared token and primitive layer consumed by all pages

## Execution Plan

### Task 1: Introduce Shared Design Tokens

**Files:**
- Create: `app/css/design-tokens.css`
- Modify: `app/index.html`
- Modify: `app/intro.html`

- [ ] Define CSS custom properties for Stripe-aligned colors, radii, shadows, spacing, and typography fallbacks using values from `DESIGN.md`.
- [ ] Add the new stylesheet before page-specific CSS in `app/index.html` and `app/intro.html` so existing files can consume tokens without reordering page behavior.
- [ ] Establish shared primitives for body text, links, headings, buttons, cards, focus rings, and selection states.
- [ ] Validate by loading both entry pages and confirming no missing stylesheet or selector regressions.

### Task 2: Align The Marketing And Onboarding Surface

**Files:**
- Modify: `app/intro.html`
- Modify: `app/css/intro.css`

- [ ] Replace the legacy blue/green palette with the Stripe-inspired navy, purple, white, and soft neutral palette.
- [ ] Update the hero, CTA, feature cards, and screenshot framing to use the new shadow and radius system.
- [ ] Shift typography from generic system emphasis to the new hierarchy using the best available fallback stack when `sohne-var` is unavailable.
- [ ] Preserve current responsive behavior and carousel function while improving spacing rhythm and contrast.
- [ ] Validate on mobile-width and desktop-width layouts.

### Task 3: Align The Main App Shell

**Files:**
- Modify: `app/css/main.css`
- Modify: `app/index.html`

- [ ] Restyle the splash screen, top navigation, editor/diagram split view, and section labels around the new token layer.
- [ ] Replace the old accent green interactions with the Stripe-inspired purple interaction system.
- [ ] Normalize surfaces, borders, and shadows so the editor panel, diagram panel, and navigation feel like one system.
- [ ] Improve top-level readability by aligning heading/body/link colors to the new semantic palette.
- [ ] Validate the app still loads, nav links still open existing modals, and layout proportions remain intact.

### Task 4: Align Modals, Forms, And Utility States

**Files:**
- Modify: `app/css/main.css`

- [ ] Restyle modal overlays, modal panels, headings, helper text, forms, and destructive actions with the new component rules.
- [ ] Bring button variants, focus states, input borders, and inline copy into a consistent token-driven pattern.
- [ ] Keep destructive affordances visually distinct without introducing a competing primary accent.
- [ ] Validate create, rename, and delete dialogs for readability and focus visibility.

### Task 5: Align Code And Diagram Adjacent Visuals Carefully

**Files:**
- Modify: `app/css/main.css`
- Modify: `app/css/chart-default.css` if token-driven surface updates are needed around Mermaid output

- [ ] Reconcile code/editor-adjacent colors so syntax highlighting remains legible against the refreshed shell.
- [ ] Only make scoped chart-surface changes that improve integration with the new UI without changing diagram semantics.
- [ ] Preserve existing Mermaid readability and CodeMirror usability over visual purity.
- [ ] Validate a sequence diagram and flowchart render correctly with no legibility regressions.

### Task 6: Align The Browser Fallback Page

**Files:**
- Modify: `app/browser.html`

- [ ] Replace inline legacy styling with the same typography, colors, link treatment, and spacing language used elsewhere.
- [ ] Keep the page intentionally simple, but no longer visually disconnected from the rest of the product.
- [ ] Validate the page remains standalone and readable without depending on app runtime code.

### Task 7: Final Consistency Pass

**Files:**
- Modify: `DESIGN.md` if project-specific exceptions need documenting
- Modify: `app/css/design-tokens.css`
- Modify: `app/css/main.css`
- Modify: `app/css/intro.css`
- Modify: `app/browser.html`

- [ ] Remove any remaining hard-coded legacy brand colors from touched surfaces unless intentionally exempted.
- [ ] Check hover, focus, active, and disabled states across buttons, links, and inputs.
- [ ] Ensure the token layer documents any deliberate deviations from stock Stripe guidance caused by ChartMage's editor-heavy interface.
- [ ] Run a final browser smoke test across `intro.html`, `index.html`, and `browser.html`.

## Validation Strategy

- Use local static preview for `app/intro.html`, `app/index.html`, and `app/browser.html`
- Smoke test new chart creation, rename, delete, syntax-help modals, and diagram export trigger
- Verify contrast and focus visibility on nav, buttons, inputs, and modal actions
- Check responsive breakpoints already present in `intro.css`

## Risks And Mitigations

- **Risk:** Stripe's typography depends on proprietary fonts not present in the repo.
  **Mitigation:** Use a controlled fallback stack that preserves weight, spacing intent, and monospace pairing without blocking rollout.

- **Risk:** Global token introduction can accidentally cascade into third-party library surfaces.
  **Mitigation:** Scope primitives to app-owned selectors first and avoid broad resets beyond existing global behavior.

- **Risk:** Color alignment can reduce diagram/editor readability.
  **Mitigation:** Treat CodeMirror and Mermaid as compatibility surfaces and tune them only after shell-level contrast is stable.

## Approval Gate

This plan assumes implementation will proceed in the order above, with the first concrete deliverable being a shared `design-tokens.css` layer rather than direct one-off restyling inside `main.css` and `intro.css`.
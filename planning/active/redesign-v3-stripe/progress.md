# Progress — Redesign v3

## Current phase

Phase 4 — Editor shell and charts drawer integrated. Final cleanup and repo-level
verification are in progress.

## Log

- **2026-04-29** — Prototype `prototypes/redesign-v1/index.html` reviewed and
  approved (logo / layout / drawer all OK). SVG text rendering issue found
  and fixed by isolating `<text>` into a `stroke="none"` group with explicit
  `font-family`. User requested an implementation plan before execution;
  task moved to tracked status under `planning/active/redesign-v3-stripe/`.
- **2026-04-29** — `task_plan.md`, `findings.md`, `progress.md` created.
- **2026-04-29** — Phase 1 completed: new connector brand mark extracted into
  `app/images/favicon.svg` and wired into both `intro.html` and `index.html`.
- **2026-04-29** — Phase 2 completed: `app/intro.html` fully rewritten and
  `app/css/landing.css` added. Slick carousel removed; landing now uses a
  static SVG demo, approved desktop-first layout, and preserves the
  `localStorage.visited` CTA flow.
- **2026-04-29** — Phase 3 completed: `app/index.html` app shell redesigned with
  new nav, shell metadata, quick-insert chips, preview toolbar, and refreshed
  splash branding. `app/css/main.css` updated to support the new layout.
- **2026-04-29** — Phase 4 functionally completed: charts library now renders in
  a right-side drawer with search, rename/delete actions, and reuse of the
  existing modal flows. `app/js/app.js` moved chart list interactions to
  delegated handlers and added `editorView.insertSnippet()`.
- **2026-04-29** — Focused verification completed for landing and app shell:
  `get_errors` clean for `intro.html`, `landing.css`, `index.html`, `main.css`,
  and `app.js`. Browser validation confirmed drawer open/close, quick insert,
  and preview mode state changes.
- **2026-04-29** — Maestro smoke issue matched the previously documented
  `maestro-uat-setup` failure rather than a redesign-only regression. The
  shared root cause was narrowed to a repo-local DOM trigger (`form.name`
  returning object values inside hidden modals), plus unstable text selectors
  on main nav actions.
- **2026-04-29** — Repo-level Maestro follow-up completed: `index.html` now
  supports `?maestro=1` for in-place first-visit bypass, the problematic form
  `name` attributes were removed, stable ids were added for the main create /
  charts actions, and `./scripts/run-maestro-web-smoke.sh` passes again.
- **2026-04-29** — `npx gulp` could not be executed as a meaningful build check
  in the current workspace because project dependencies are not installed
  (`node_modules/` absent). `npx` attempted to prompt for a one-off install of
  `gulp@5.0.1`, which would not validate the repo against its declared
  `gulp@^3.9.1` toolchain, so the build verification remains pending until the
  repo dependencies are installed normally.

## Next action

Run repo-level build verification (`npx gulp`) once the repo dependencies are
installed, then do a final cleanup pass for dead CSS / copy / planning notes
before marking Phase 5 complete.

## Verification status

| Phase | Visual | Maestro smoke | Gulp build | Manual checklist |
|-------|--------|---------------|------------|------------------|
| 1     | pass   | n/a           | pending    | pass             |
| 2     | pass   | pass          | pending    | pass             |
| 3     | pass   | pass          | pending    | pass             |
| 4     | pass   | pass          | pending    | pass             |
| 5     | in progress | pass     | blocked    | in progress      |

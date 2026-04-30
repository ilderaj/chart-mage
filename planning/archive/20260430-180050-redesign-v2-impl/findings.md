# Findings — Redesign v2 Implementation

## Inherited from v3

- Maestro selector contract (text + ids) documented in v3 task plan; same
  rules apply here. `?maestro=1` bypass already wired into `index.html`.
- Build pipeline upgraded to gulp 4 in v3 Phase 5; no further build work
  expected.
- `app.js` already exposes `editorView.insertSnippet()` and delegated
  drawer/quick-insert handlers from v3 Phase 3 / 4.

## Token diff snapshot (2026-04-30)

Prototype `:root` declares 14 vars beyond review chrome. 12 are promotable;
2 (`--color-syntax-keyword` = brand, `--color-syntax-arrow` = danger) could be
aliased but kept as named tokens for code-coloring legibility. `--proto-bg`
is review-only.

`--color-syntax-string` (`#108c3d`) is intentionally darker than
`--color-success` (`#15be53`) for AA contrast on white CodeMirror background.

## Open questions

- Does the existing CodeMirror theme already define syntax colors via classes?
  If yes, Phase A only adds the tokens; the theme-CSS update is a separate
  micro-step inside Phase C. (Need to grep `app/css/codemirror.css` /
  `app/css/main.css` for `cm-keyword`, `cm-string`, `cm-comment` rules.)
- Where is the bundled "Sample flowchart" body authored? Likely a string
  constant in `app.js` or a hidden `<textarea>` in `index.html`. Find before
  Phase D.

## Decisions

- Keep `app/images/favicon.svg` as-is — v3 already promoted the connector mark.
- Do not rename `landing.css` despite it now hosting only single-screen intro
  styles; rename would force a `useref` block edit for marginal value.
- Sample flowchart shortening lives in **Phase D**, not bundled into Phase C,
  to keep the Maestro retest surface minimal per phase.

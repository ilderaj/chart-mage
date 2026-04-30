# Maestro Coverage Backlog

This file maps product scenarios to expected Maestro coverage. Each user-facing backlog item should either add a row here or update an existing row.

## Coverage Map

| Scenario | Roadmap anchor | Expected flow | Status |
|---|---|---|---|
| Landing page opens and starts editor | Version 2 | `web-landing-start.yaml` | missing |
| Public credit is visible and links only to original repo | Version 1 | `web-credit-surfaces.yaml` | missing |
| Legacy contact routes are absent from reachable UI | Version 1 | `web-credit-surfaces.yaml` | missing |
| Create flowchart | Version 3 | `web-smoke.yaml` | covered |
| Create sequence diagram | Version 3 | `web-create-sequence.yaml` | covered |
| Rename chart from library drawer | Version 3 | `web-rename-chart.yaml` | covered |
| Delete chart from library drawer | Version 3 | `web-delete-chart.yaml` | covered |
| Search chart library | Version 3 | `web-library-search-sort.yaml` | missing |
| Sort chart library | Version 3 | `web-library-search-sort.yaml` | missing |
| Duplicate chart | Version 3 | `web-duplicate-chart.yaml` | missing |
| Full-width colon sequence normalization | Version 3 | `web-sequence-punctuation-normalization.yaml` | missing |
| Syntax error recovery | Version 3 | `web-syntax-error-recovery.yaml` | missing |
| Quick insert chips | Version 3 | `web-quick-insert.yaml` | missing |
| Syntax help modal | Version 2 | `web-syntax-help.yaml` | missing |
| About modal credit content | Version 1 | `web-credit-surfaces.yaml` | missing |
| PNG export entry point | Version 3 | `web-export-png.yaml` | missing |
| Import/export chart collection | Version 5 | `web-import-export-collection.yaml` | missing |
| Empty storage first run | Version 4 | `web-storage-states.yaml` | missing |
| Corrupted storage recovery | Version 4 | `web-storage-states.yaml` | missing |
| Unsupported browser fallback | Version 2 | `web-browser-fallback.yaml` | missing |
| Mobile landing fallback | Version 2 | `web-mobile-fallback.yaml` | missing |
| Keyboard navigation baseline | Version 5 | `web-keyboard-baseline.yaml` | missing |
| Copy current diagram source | Outside roadmap | `web-copy-source.yaml` | missing |

## Coverage Rules

- A scenario is `covered` only when the flow exists and is part of the standard UAT command or a documented suite command.
- A scenario can be `partial` when coverage exists but does not yet assert the main acceptance criteria.
- New public UI, storage behavior, editor parsing behavior, export behavior, or navigation behavior should not be marked release-ready until this map has a matching flow.
- If a scenario cannot be automated with Maestro, record the limitation and add the smallest manual fallback checklist possible.

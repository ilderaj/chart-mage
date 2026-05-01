# Maestro Workspace

This directory contains Chart Mage UAT flows powered by Maestro.

## Conventions
- Keep reusable browser UAT flows under `.maestro/flows/`.
- Prefer user-visible assertions such as `assertVisible` over coordinate-based steps.
- Reuse the local server at `http://127.0.0.1:8000` so flows stay aligned with the repo task and npm script.
- Prefer `http://127.0.0.1:8000/index.html?maestro=1` for deterministic entry. The page seeds `localStorage.visited` in-place without an extra redirect, and the smoke flow clears browser state before opening it.
- When a charts-drawer action opens a modal, the drawer should be closed first. Otherwise the backdrop can intercept the modal interaction and make Maestro think the flow is flaky.

## Flows
- `web-smoke.yaml` — baseline create-flowchart smoke path.
- `web-create-sequence.yaml` — create a sequence diagram from the main nav.
- `web-rename-chart.yaml` — rename a chart through the drawer action.
- `web-delete-chart.yaml` — delete a non-current chart through the drawer action.

## Nav And Favicon Flows
- `web-top-nav-alignment.yaml` — assert the aligned editor top-nav anatomy and required visible labels on first editor load.
- `web-nav-search.yaml` — drive chart search from the top-nav search surface and verify drawer filtering; Maestro uses the observer shortcut trigger so the same Cmd-K keydown path remains testable in Web mode.
- `web-chart-pill-rename.yaml` — rename the current chart from the top-nav pill and verify nav/workspace labels update together.
- `web-top-nav-actions.yaml` — cover top-nav action continuity for My Charts, Help, Export, and the primary New action.
- `web-favicon-entrypoints.yaml` — verify favicon link declarations across `index.html`, `intro.html`, and `browser.html` via the Maestro observer surface; rendered favicon pixels still require browser/manual checks.

## Standard Suite
- `npm run uat:smoke` and `npm run uat:suite` both run the standard web UAT suite.
- The default suite runs: `web-smoke.yaml`, `web-create-sequence.yaml`, `web-rename-chart.yaml`, `web-delete-chart.yaml`, `web-top-nav-alignment.yaml`, `web-nav-search.yaml`, `web-chart-pill-rename.yaml`, `web-top-nav-actions.yaml`, and `web-favicon-entrypoints.yaml`.
- Pass a flow path to run only that flow, for example: `npm run uat:smoke -- .maestro/flows/web-top-nav-actions.yaml`.
- Use `npm run uat:smoke:headed` or `npm run uat:suite:headed` when you need a visible browser session.

## Local run
1. Start the app server with `npm run uat:serve`.
2. Run the standard suite with `npm run uat:smoke`.

## Coverage boundary
- Maestro coverage backlog status is driven only by Maestro flows that run through the standard UAT command or a documented suite command.
- Playwright checks and manual checklists are allowed for favicon pixels, glass/backdrop quality, spacing, and other visual-only assertions that Maestro cannot inspect.
- Those fallback checks supplement release verification, but they do not count as Maestro `covered` status in `backlogs/maestro-coverage.md`.
- `web-favicon-entrypoints.yaml` covers only favicon declaration consistency at the HTML/DOM layer. Rendered favicon sharpness, blur, and browser-tab visual quality still require manual/browser verification.
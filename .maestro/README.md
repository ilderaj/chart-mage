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

## Local run
1. Start the app server with `npm run uat:serve`.
2. Run the smoke flow with `npm run uat:smoke`.
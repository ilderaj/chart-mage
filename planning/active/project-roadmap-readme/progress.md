# Progress

## 2026-04-29
- Started task after user requested private roadmap plus README update.
- Loaded relevant process guidance for brainstorming and planning-with-files.
- Reviewed repo memories for deployment and UAT context.
- Read current README, DESIGN.md, app landing/editor/browser pages, package.json, and searched for original contact/profile/credit references.
- Created task-scoped planning files under `planning/active/project-roadmap-readme/`.
- Reviewed license, `.gitignore`, About modal, and app architecture details in `app/js/app.js`.
- Confirmed private roadmap should not be linked from README because `planning/` is not ignored.
- Added `planning/active/project-roadmap-readme/private_roadmap.md` with a private five-version roadmap.
- Rewrote `README.md` around the maintained fork, original-project credit, local development, UAT, repository layout, deployment notes, technology credit, and license.
- Removed an explicit legacy feedback address from newly written internal docs so new documentation does not reproduce the old route.
- Verification completed: no VS Code errors for changed docs, no public README link to private roadmap, and `git diff --check` returned cleanly.
- Added a roadmap-wide Maestro coverage policy requiring every meaningful user-facing scenario to have Maestro coverage before release readiness.
- Added version-specific Maestro success criteria across all five roadmap versions and a backlog item for a scenario-to-flow coverage map.


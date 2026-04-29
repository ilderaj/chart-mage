# Chart Mage Private Roadmap

Visibility: private/internal. Do not publish this file, link it from the public site, or treat it as user-facing documentation.

## Guiding Principles

- Preserve clear credit for the original project: Chart Mage was created by Junlin Shang, and the original repository is `https://github.com/heyjunlin/chart-mage`.
- Public credit surfaces may link to the original repository only. Do not add links to the original author's personal contact, profile, email, or unrelated accounts.
- Remove legacy contact/profile paths that route users to the original author, including old feedback email links, old analytics ownership, and copy written in the original author's personal voice.
- Keep the app local-first unless a future version intentionally adds sharing or collaboration. Local browser storage remains the default trust model.
- Modernize gradually: protect the existing static app, Mermaid rendering pipeline, and Maestro UAT coverage while improving architecture and experience.

## Version 1 - Fork Identity, Credit, And Ownership Cleanup

Goal: make the maintained fork honest, self-contained, and respectful of the original work.

Scope:
- Add original-project credit in key public locations: README, landing page footer or credit band, and the in-app About modal.
- Point original-project credit to `https://github.com/heyjunlin/chart-mage` only.
- Remove old routes to the original author's personal contact/profile paths, including legacy feedback email links from public pages and generated output.
- Replace old Google Analytics ownership (`UA-86337828-1`) with either no analytics or a new privacy-conscious analytics plan owned by this fork.
- Review package metadata such as `author`, `description`, and `license` so the fork distinguishes original authorship from current maintenance.
- Add a small contributor-facing note that explains the credit policy: credit the original repo, avoid personal-contact redirects.

Success criteria:
- No public page contains an old personal contact link for the original author.
- The original repo credit is visible from the public product and README.
- README no longer speaks in the original author's first-person voice.

## Version 2 - Unified Design Language Across Intro, App, And Fallbacks

Goal: finish the full visual and interaction redesign using the project's documented design language.

Scope:
- Align `intro.html`, `index.html`, `browser.html`, modals, drawers, syntax guides, empty states, and export/error states with `DESIGN.md`.
- Make the app feel like a cohesive product rather than a redesigned landing page attached to legacy editor surfaces.
- Rework in-app credit/About content so it fits the new visual system while preserving original-project credit.
- Replace outdated illustrative assets and any off-brand fallback imagery with product-relevant visuals or system UI.
- Audit mobile behavior: keep the editor desktop-first if needed, but make the landing and unsupported-browser paths polished and useful.
- Establish design-token ownership for color, type, spacing, radius, shadows, and focus states.

Success criteria:
- Landing, editor, About, syntax help, drawer, modal, and browser fallback screens read as one design system.
- The first viewport clearly communicates Chart Mage as the product.
- Key actions remain obvious: start drawing, create chart, search charts, rename, delete, export, open syntax help.

## Version 3 - Authoring Experience And Syntax Resilience

Goal: make writing diagrams more forgiving, faster, and easier to recover from.

Scope:
- Normalize common punctuation input before parsing, especially full-width colon `：` to half-width `:` for sequence messages.
- Preserve or extend existing full-width question mark support for flowchart decisions.
- Improve syntax error display with line-level messages, not just background highlighting.
- Add smarter quick inserts for common sequence and flowchart patterns.
- Improve first-run samples so they demonstrate real-world use without fake marketing metrics.
- Strengthen chart library UX: search, sort, empty states, duplicate chart, and last-modified clarity.
- Improve export reliability and communicate browser limitations clearly when canvas export fails.

Success criteria:
- Full-width colon input produces valid sequence syntax without requiring manual cleanup.
- A user can understand what failed and where when a diagram cannot render.
- Library and export behavior remain covered by Maestro or equivalent browser UAT flows.

## Version 4 - Modern Architecture And Dependency Hardening

Goal: reduce legacy risk from the seven-year-old codebase while preserving behavior.

Scope:
- Split the current single `app/js/app.js` responsibilities into focused modules: storage, chart model, editor modes, renderer, UI shell, drawer/modals, export.
- Introduce a parser/normalization boundary so syntax cleanup and Mermaid translation are testable outside the UI.
- Replace or harden old build dependencies where possible, including legacy Gulp plugins and old PostCSS/cssnano chains.
- Review bundled libraries: Mermaid, CodeMirror, jQuery Modal, uuid, Underscore, Pure CSS, and fallback browser scripts.
- Add unit-style tests for normalization, flowchart translation, localStorage migration, and chart CRUD behavior.
- Add storage schema versioning and migration safeguards for existing `localStorage.spells` users.
- Translate remaining code comments and developer-facing notes to English while keeping historical context where useful.

Success criteria:
- Core chart creation, editing, saving, renaming, deleting, rendering, and exporting remain behaviorally stable.
- Dependency audit risk is materially lower or explicitly documented where upgrades are deferred.
- Parser and storage behavior can be verified without manual browser testing.

## Version 5 - Distribution, Collaboration, And Product Readiness

Goal: make the maintained fork reliable to ship, preview, and extend.

Scope:
- Finish Cloudflare Pages convergence: production from `main`, preview deployments for PRs/branches, and documented redeploy/rollback flow.
- Decide whether the public app should serve directly from `app/` or from a modern build artifact, then make that deployment contract explicit.
- Add privacy-conscious telemetry only if it has clear product value and fork-owned configuration.
- Add optional import/export of chart source collections so local-first users can back up or move work between browsers.
- Explore shareable diagrams only after privacy, storage, and abuse constraints are designed.
- Expand accessibility coverage: keyboard navigation, focus states, modal/drawer semantics, color contrast, and reduced-motion behavior.
- Consider i18n readiness after syntax normalization is stable.

Success criteria:
- Production deployment is reproducible from the repository's documented contract.
- Pull requests can be previewed safely before merge.
- Users have a reliable backup/export story without forcing an account system.

## Cross-Version Backlog

- Remove stale generated `dist/` output or make the build pipeline regenerate it consistently.
- Replace IE-specific fallback strategy with a modern unsupported-browser policy.
- Document ownership boundaries for third-party libraries and vendored assets.
- Add a lightweight security/privacy checklist for future changes.
- Revisit the product name only if trademark, domain, or positioning issues arise.

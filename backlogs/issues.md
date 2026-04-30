# Issue Backlog

## ISSUE-001 - Public Credit Placement Audit

Status: open
Roadmap anchor: Version 1 - Fork Identity, Credit, And Ownership Cleanup
Priority: P1
Maestro coverage: required

Problem:
- The fork needs consistent original-project credit in public surfaces without sending users to personal contact paths.

Acceptance criteria:
- README, landing page, and About modal use consistent credit language.
- Credit links point only to the original repository.
- Maestro verifies landing and About credit visibility.

## ISSUE-002 - Design Token Coverage Audit

Status: open
Roadmap anchor: Version 2 - Unified Design Language Across Intro, App, And Fallbacks
Priority: P2
Maestro coverage: update existing

Problem:
- Some legacy CSS may still use hardcoded colors, radii, shadows, and spacing outside the documented design token system.

Acceptance criteria:
- A token audit lists remaining hardcoded visual values and decides whether to convert or keep them.
- Core screens use shared tokens for brand-critical styling.
- Maestro visual smoke flows continue to cover the main redesigned paths.

## ISSUE-003 - Dist Output Ownership

Status: open
Roadmap anchor: Version 5 - Distribution, Collaboration, And Product Readiness
Priority: P2
Maestro coverage: update existing

Problem:
- Generated `dist/` output exists alongside `app/`, while current deployment direction serves `app/` directly.
- It is unclear whether `dist/` should be committed, regenerated, ignored, or retired.

Acceptance criteria:
- Repository docs define whether `app/` or `dist/` is the deployable source of truth.
- Build scripts and deployment settings match that decision.
- Maestro smoke flows run against the chosen deployable output.

## ISSUE-004 - Accessibility Baseline

Status: open
Roadmap anchor: Version 5 - Distribution, Collaboration, And Product Readiness
Priority: P1
Maestro coverage: required

Problem:
- Keyboard, focus, modal, drawer, contrast, and reduced-motion behavior need an explicit baseline.

Acceptance criteria:
- Core interactions can be completed with keyboard navigation.
- Modal and drawer focus behavior is predictable.
- Contrast and reduced-motion checks are documented.
- Maestro covers keyboard navigation for primary chart creation, drawer open/close, syntax help, and modal dismissal where practical.

## ISSUE-005 - Dependency Upgrade Risk Register

Status: open
Roadmap anchor: Version 4 - Modern Architecture And Dependency Hardening
Priority: P1
Maestro coverage: update existing

Problem:
- Legacy dependencies span build tooling and browser libraries, and upgrades may affect rendering, CSS output, or UAT stability.

Acceptance criteria:
- Dependency upgrade candidates are grouped by risk and blast radius.
- Each upgrade group names required build checks and Maestro flows.
- Deferred risks are documented instead of hidden.

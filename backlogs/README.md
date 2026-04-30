# Chart Mage Backlogs

This folder tracks concrete work items that sit below the private roadmap level. The roadmap defines larger version themes; these backlog files capture issue-sized bug fixes, new features, product issues, and test coverage tasks that can be picked up independently.

The private roadmap remains the source of strategic direction. Backlog items should reference the relevant roadmap version when they support a major plan, or use `Outside roadmap` when they are small standalone needs.

## Files

- [bug-fixes.md](bug-fixes.md) - concrete defects, regressions, and behavior fixes.
- [new-features.md](new-features.md) - feature-sized additions and enhancements.
- [issues.md](issues.md) - product, architecture, documentation, privacy, and operational issues that need triage.
- [maestro-coverage.md](maestro-coverage.md) - scenario-to-Maestro-flow coverage map and missing UAT flows.

## Item Format

Use this shape for new backlog entries:

```md
## TYPE-000 - Short Title

Status: open
Roadmap anchor: Version N - Roadmap Theme, or Outside roadmap
Priority: P0/P1/P2/P3
Maestro coverage: required | update existing | not applicable

Problem:
- What is broken, missing, confusing, or risky?

Acceptance criteria:
- What must be true when this item is complete?
```

## Priority Guide

- `P0` - blocks release, data safety, deployment, or core authoring behavior.
- `P1` - important user-visible issue or required roadmap enabler.
- `P2` - meaningful improvement that can wait behind release-critical work.
- `P3` - polish, cleanup, or opportunistic maintenance.

## Roadmap Anchors

- `Version 1 - Fork Identity, Credit, And Ownership Cleanup`
- `Version 2 - Unified Design Language Across Intro, App, And Fallbacks`
- `Version 3 - Authoring Experience And Syntax Resilience`
- `Version 4 - Modern Architecture And Dependency Hardening`
- `Version 5 - Distribution, Collaboration, And Product Readiness`
- `Outside roadmap`

## Maestro Rule

Every meaningful user-facing scenario needs Maestro coverage before release readiness. If a backlog item changes a user path, add or update the matching entry in [maestro-coverage.md](maestro-coverage.md).

# Bug Fix Backlog

## BUG-001 - Normalize Full-Width Colon In Sequence Messages

Status: open
Roadmap anchor: Version 3 - Authoring Experience And Syntax Resilience
Priority: P1
Maestro coverage: required

Problem:
- Sequence diagrams currently key message parsing on ASCII `:`.
- Users typing with Chinese/Japanese punctuation may enter full-width `：`, causing otherwise readable sequence messages to fail or render incorrectly.

Acceptance criteria:
- Full-width `：` is normalized to `:` before sequence parsing or at editor input time.
- Existing valid ASCII-colon sequence syntax remains unchanged.
- Maestro verifies a sequence diagram created with full-width colon renders successfully and persists after reload.

## BUG-002 - Fix Flowchart Terminal Token Detection

Status: open
Roadmap anchor: Version 4 - Modern Architecture And Dependency Hardening
Priority: P1
Maestro coverage: required

Problem:
- The flowchart translation branch for terminal nodes uses a suspicious condition around `token.type.indexOf(...)` that should be audited and corrected.
- Incorrect token detection can make process, decision, and terminal nodes compile unpredictably.

Acceptance criteria:
- Terminal, process, and decision token handling use explicit readable conditions.
- Existing sample flowchart output remains stable.
- Maestro verifies terminal, process, decision, labeled-arrow, and subgraph examples render in one flow.

## BUG-003 - Remove Legacy Feedback And Analytics Ownership From Public App Paths

Status: open
Roadmap anchor: Version 1 - Fork Identity, Credit, And Ownership Cleanup
Priority: P1
Maestro coverage: required

Problem:
- Public app pages and generated output still contain legacy feedback and analytics ownership routes from the original project era.
- The fork should credit the original repo without routing users to the original author's personal contact paths.

Acceptance criteria:
- Public intro, editor, About, and generated output no longer include legacy personal contact routes.
- Original-project credit points only to `https://github.com/heyjunlin/chart-mage`.
- Maestro verifies primary public credit surfaces and absence of legacy contact CTAs in reachable UI.

## BUG-004 - Harden PNG Export Failure Handling

Status: open
Roadmap anchor: Version 3 - Authoring Experience And Syntax Resilience
Priority: P2
Maestro coverage: required

Problem:
- Export depends on the rendered SVG being present and canvas conversion succeeding.
- Missing rendered output, tainted canvas behavior, or unsupported browser behavior can leave users with unclear failure feedback.

Acceptance criteria:
- Export gracefully handles missing diagrams and conversion failures.
- Error copy explains what happened and how to recover.
- Maestro covers successful export entry and at least one recoverable export failure path where feasible.

## BUG-005 - Make Local Storage Corruption Recoverable

Status: open
Roadmap anchor: Version 4 - Modern Architecture And Dependency Hardening
Priority: P1
Maestro coverage: required

Problem:
- Chart data is loaded directly from `localStorage.spells`.
- Corrupt JSON or old schema data can break initialization or cause confusing chart-not-found states.

Acceptance criteria:
- Corrupt storage is detected and handled with a clear recovery path.
- Existing valid local charts are preserved during migrations.
- Maestro covers startup with empty storage, normal persisted storage, and a recoverable corrupted-storage state if automation can seed it.

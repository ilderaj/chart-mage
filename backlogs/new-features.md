# New Feature Backlog

## FEAT-001 - Duplicate Existing Chart

Status: open
Roadmap anchor: Version 3 - Authoring Experience And Syntax Resilience
Priority: P2
Maestro coverage: required

Problem:
- Users can create, rename, delete, and open charts, but cannot quickly branch from an existing diagram.

Acceptance criteria:
- Each chart in the library can be duplicated with a safe default name.
- Duplicate charts preserve type, content, and direction metadata while receiving a new id and timestamps.
- Maestro verifies duplicate creation, opening the duplicate, and persistence after reload.

## FEAT-002 - Import And Export Chart Collections

Status: open
Roadmap anchor: Version 5 - Distribution, Collaboration, And Product Readiness
Priority: P1
Maestro coverage: required

Problem:
- The app is local-first, but users need a way to back up or move their chart collection between browsers.

Acceptance criteria:
- Users can export all chart sources as a portable file.
- Users can import a compatible file without silently overwriting existing charts.
- Invalid import files produce clear errors.
- Maestro covers export, import, duplicate-name handling, and invalid-file handling where browser automation allows.

## FEAT-003 - Sort And Filter Chart Library

Status: open
Roadmap anchor: Version 3 - Authoring Experience And Syntax Resilience
Priority: P2
Maestro coverage: required

Problem:
- Search exists, but the chart library needs clearer organization as users accumulate more local diagrams.

Acceptance criteria:
- Users can sort by last modified, created date, name, and chart type.
- Current chart remains visibly selected after sorting or filtering.
- Empty and no-results states remain useful.
- Maestro covers search, sort, no-results, and current-chart selection states.

## FEAT-004 - Scenario-Level Syntax Examples

Status: open
Roadmap anchor: Version 3 - Authoring Experience And Syntax Resilience
Priority: P2
Maestro coverage: required

Problem:
- Existing syntax help is reference-like. Users would benefit from task-oriented examples such as API flow, approval workflow, retry loop, and decision tree.

Acceptance criteria:
- Syntax help includes realistic sequence and flowchart examples.
- Users can insert an example into the editor without losing existing work unless they confirm replacement.
- Maestro covers opening syntax help and inserting one sequence and one flowchart example.

## FEAT-005 - Privacy-Conscious Fork-Owned Telemetry Decision

Status: open
Roadmap anchor: Version 5 - Distribution, Collaboration, And Product Readiness
Priority: P3
Maestro coverage: not applicable

Problem:
- The fork needs an explicit decision on whether analytics belongs in the product at all.

Acceptance criteria:
- A short decision record documents no analytics, self-hosted analytics, or a privacy-conscious provider.
- Any implementation is fork-owned and avoids original-project identifiers.
- If analytics is implemented, consent/privacy behavior is covered by Maestro where user-facing.

## FEAT-006 - Copy Current Diagram Source

Status: open
Roadmap anchor: Outside roadmap
Priority: P3
Maestro coverage: required

Problem:
- Users may want to quickly copy the current diagram source text without selecting the entire editor content manually.

Acceptance criteria:
- A copy-source action copies the current editor text to the clipboard.
- The UI gives brief success or failure feedback.
- Maestro covers the action entry point and visible feedback state where clipboard automation allows.

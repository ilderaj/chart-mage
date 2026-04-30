# Live Preview Render Style Alignment Implementation Plan

> For agentic workers: use the task-scoped planning files in `planning/active/live-preview-render-style-alignment/` as the source of truth. Execute this plan task-by-task and update `progress.md` plus `findings.md` after each phase.

**Goal:** 让 editor 的 Live Preview 渲染结果在视觉语言上贴近 intro hero demo，同时保持 Mermaid 渲染管线、现有 editor chrome 和 UAT 稳定。

**Architecture:** 采用 CSS-first 的窄切片方案：`chart-default.css` 负责 Mermaid SVG 内部主题，`main.css` 负责 preview viewport framing 和 fit/actual 缩放行为，`app.js` 只在 CSS 无法达成序列图比例时做极小 Mermaid geometry 参数调整。新增 Maestro flow 覆盖 preview 用户路径，浏览器截图/计算样式检查负责视觉 token 验证。

**Tech Stack:** Static HTML/CSS/JavaScript, Mermaid API, CodeMirror, Maestro Web UAT, local `python3 -m http.server` static serving.

---

## Current State

Status: waiting_review
Archive Eligible: no
Close Reason:

Companion plan: none
Companion summary: 详细计划直接保存在本 task 的 `task_plan.md`。
Sync-back status: authoritative

## Roadmap Fit

- 主阶段：Version 2 - Unified Design Language Across Intro, App, And Fallbacks。
- 本任务是 Version 2 的 editor/live-preview 切片，目标是让 intro 的 demo output 和 app 的 actual output 不再像两个视觉系统。
- 保护线：Version 4 的 Mermaid pipeline 稳定性原则。此任务不拆 `app/js/app.js`，不升级 Mermaid，不重写 renderer。
- 验收线：Maestro Coverage Policy。新增或更新 UAT，且通过截图/计算样式补充验证视觉差异。

## Scope Control

### In Scope

- Align Live Preview canvas grid density, padding, centering, and fit/actual behavior with intro demo.
- Align Mermaid-rendered sequence diagram styling with intro demo:
  - actor boxes
  - lifelines
  - message lines and arrows
  - message labels
  - note boxes
  - typography scale
- Keep flowchart styling compatible with the same token system without attempting a full flowchart redesign.
- Add UAT coverage for the preview rendering path and toolbar mode switching.
- Run local smoke/UAT and browser visual checks.

### Out Of Scope

- Full editor redesign.
- Landing page or intro hero redesign.
- Drawer, modal, About, syntax guide, browser fallback, or export UX redesign.
- Parser changes, syntax normalization, or error messaging improvements.
- Mermaid upgrade or replacement.
- Dark preview mode implementation.
- Build pipeline modernization.
- LocalStorage schema changes.

## Visual Target

Use `app/intro.html` hero demo output as the target reference:

- Canvas: white-to-`#f6f9fc` surface with compact dot grid around 18px spacing.
- Actor box: white fill, `#533afd` stroke, 4px radius, compact text.
- Lifeline: `#cdd8e5`, dashed `3 3`, 1px stroke.
- Solid messages: `#1c1e54`, around 1.4px stroke.
- Return messages: `#1c1e54`, dashed `4 3`, around 1.2px stroke.
- Message text: `#425466`, 11px-ish visual scale.
- Note: `#fffbe6` fill, `#9b6829` stroke and text.
- Layout: the diagram should sit centered and readable without filling the entire preview pane edge-to-edge.

## Recommended Approach

### Considered Approaches

1. CSS-only patch in `chart-default.css` and `main.css`.
   - Pros: smallest implementation, preserves renderer.
   - Cons: may not fix geometry if Mermaid emits overly wide actor spacing or SVG dimensions.
2. CSS-first patch plus tiny Mermaid geometry tuning if screenshots prove it is needed.
   - Pros: keeps scope small while allowing proportion correction.
   - Cons: touches `app/js/app.js` if CSS is insufficient.
3. Replace intro demo or live preview with a shared hand-authored SVG renderer.
   - Pros: perfect visual match.
   - Cons: breaks product truth because live preview must remain Mermaid-backed; too broad for this task.

Recommendation: use approach 2, but start with CSS-only implementation and only touch `app/js/app.js` after screenshot evidence shows geometry cannot be corrected with CSS.

## File Map

- Modify `app/css/main.css`
  - Adjust `.diagram` grid density to match intro demo.
  - Adjust `.chart` preview padding and centering.
  - Replace current `#graphDiv { width: 100%; }` behavior with constrained fit sizing and actual-size escape hatch.
- Modify `app/css/chart-default.css`
  - Scope and tune Mermaid sequence diagram styles to match the intro demo tokens.
  - Keep flowchart node/edge styles aligned but avoid redesigning flowcharts from scratch.
- Modify `app/js/app.js` only if needed
  - Keep existing Mermaid init path.
  - Adjust only `sequenceDiagram` geometry values if CSS-first verification fails.
- Create `.maestro/flows/web-preview-style-alignment.yaml`
  - Cover sequence preview load, text visibility, toolbar `100%` and `Fit` mode switching.
- Optionally modify `README.md` only if the team wants the new flow listed publicly.
  - Default recommendation: do not modify README for this narrow visual task unless UAT command ergonomics change.

## Task 1: Add Preview Style UAT Before Visual Changes

**Files:**
- Create: `.maestro/flows/web-preview-style-alignment.yaml`

- [ ] Step 1: Create a failing/guarding Maestro flow for the current preview path.

```yaml
url: http://127.0.0.1:8000/index.html?maestro=1
tags:
  - web
  - preview
  - visual-alignment
---
- clearState
- openLink: http://127.0.0.1:8000/index.html?maestro=1
- assertVisible: "Sample sequence diagram"
- assertVisible: "Live Preview"
- assertVisible: "Fit"
- assertVisible: "100%"
- assertVisible: "Alice"
- assertVisible: "John"
- assertVisible: "Text in note"
- tapOn: "100%"
- assertVisible: "Alice"
- assertVisible: "John"
- tapOn: "Fit"
- assertVisible: "Text in note"
```

- [ ] Step 2: Run the app server.

Run:

```bash
npm run uat:serve
```

Expected:

```text
Serving HTTP on :: port 8000
```

- [ ] Step 3: Run the new flow directly.

Run:

```bash
MAESTRO_BIN="${HOME}/.maestro/bin/maestro" \
  "${HOME}/.maestro/bin/maestro" --platform web test --headless \
  --debug-output=.maestro/debug-output \
  .maestro/flows/web-preview-style-alignment.yaml
```

Expected before style work:

```text
Flow passed
```

This is a regression guard, not a style assertion. If SVG text is not exposed to Maestro and the flow fails on `Alice`, replace those text assertions with stable surrounding UI assertions and record the limitation in `findings.md`.

## Task 2: Align Preview Viewport Framing

**Files:**
- Modify: `app/css/main.css`

- [ ] Step 1: Update `.diagram`, `.chart`, and `#graphDiv` styles.

Replace the relevant preview block with this directionally equivalent CSS, preserving nearby existing selectors and indentation style:

```css
.diagram {
	position: relative;
	display: flex;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
	margin: 0;
	overflow: hidden;
	background:
		radial-gradient(circle, rgba(6, 27, 49, 0.06) 1px, transparent 1px),
		linear-gradient(180deg, #ffffff 0%, var(--color-bg) 100%);
	background-size: 18px 18px, 100% 100%;
	background-position: center, center;
	box-shadow: none;
	border-radius: 0;
}

.chart {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-height: calc(100vh - 250px);
	margin: 0;
	padding: 24px;
	border: 0;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
	overflow: auto;
}

#graphDiv {
	display: block;
	width: auto;
	max-width: min(100%, 720px);
	height: auto;
	max-height: calc(100vh - 280px);
	margin: auto;
	overflow: visible;
}

.diagram[data-preview-mode="fit"] #graphDiv {
	width: min(100%, 720px);
}

.diagram[data-preview-mode="actual"] #graphDiv {
	width: auto;
	max-width: none;
	max-height: none;
}
```

- [ ] Step 2: Verify sequence and flowchart still render in both modes.

Run the server and open:

```text
http://127.0.0.1:8000/index.html?maestro=1
```

Expected:

- Sample sequence diagram is centered.
- `Fit` does not stretch the diagram edge-to-edge.
- `100%` allows natural SVG size and uses preview scrolling if needed.
- New flowchart creation still renders inside the preview pane.

## Task 3: Align Mermaid Sequence Theme

**Files:**
- Modify: `app/css/chart-default.css`

- [ ] Step 1: Replace the current sequence diagram styling values with token-aligned styles.

Use this selector strategy so generated Mermaid output inside the app preview is styled consistently:

```css
#chart svg {
  font-family: var(--font-sans);
  font-feature-settings: var(--font-feature-settings);
}

.actor {
  stroke: #533afd;
  fill: #ffffff;
  rx: 4;
}

text.actor {
  fill: #061b31;
  stroke: none;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 400;
}

.actor-line {
  stroke-width: 1;
  stroke-dasharray: 3, 3;
  stroke: #cdd8e5;
}

.messageLine0 {
  stroke-width: 1.4;
  stroke-dasharray: none;
  marker-end: "url(#arrowhead)";
  stroke: #1c1e54;
}

.messageLine1 {
  stroke-width: 1.2;
  stroke-dasharray: 4, 3;
  stroke: #1c1e54;
}

#arrowhead {
  fill: #1c1e54;
}

#crosshead path {
  fill: #1c1e54 !important;
  stroke: #1c1e54 !important;
}

.messageText {
  fill: #425466;
  stroke: none;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 400;
}

.note {
  stroke: #9b6829;
  fill: #fffbe6;
  rx: 4;
}

.noteText {
  fill: #9b6829;
  stroke: none;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 400;
}
```

- [ ] Step 2: Keep non-sequence styles stable.

Review flowchart selectors in the same file and keep existing behavior except for small token consistency fixes such as:

```css
.node rect,
.node circle,
.node ellipse,
.node polygon {
  fill: #ffffff;
  stroke: #425466;
  stroke-width: 1px;
}

.edgePath .path {
  stroke: #425466;
}
```

Expected:

- Sequence preview now visually resembles intro demo.
- Flowchart preview remains legible and does not inherit sequence-specific note/actor assumptions.

## Task 4: Tune Mermaid Geometry Only If CSS Is Insufficient

**Files:**
- Modify only if needed: `app/js/app.js`

- [ ] Step 1: Compare screenshots after Tasks 2-3.

If actor spacing and vertical rhythm already feel close to intro demo, skip this task and record `app/js/app.js unchanged` in `progress.md`.

- [ ] Step 2: If geometry remains too spread out or too tall, adjust only these values:

```js
sequenceDiagram:{
  useMaxWidth: false,
  width: 150,
  height: 60,
  actorMargin: 130
}
```

Expected:

- This keeps the existing Mermaid initialization shape intact.
- No parser, storage, editor, or renderer logic changes are introduced.

## Task 5: Browser Visual Verification

**Files:**
- No source files unless verification exposes a defect.

- [ ] Step 1: Start the local app server.

Run:

```bash
npm run uat:serve
```

- [ ] Step 2: Capture the target reference.

Open:

```text
http://127.0.0.1:8000/intro.html
```

Check:

- Hero demo output grid uses compact dot spacing.
- Actor stroke is purple.
- Note fill is pale yellow.

- [ ] Step 3: Capture the implementation surface.

Open:

```text
http://127.0.0.1:8000/index.html?maestro=1
```

Check:

- Live Preview sequence diagram uses purple actor outlines.
- Lifelines are light dashed lines.
- Message arrows are deep navy.
- Note matches pale yellow/brown treatment.
- Diagram is centered and not oversized in `Fit` mode.
- `100%` mode still allows inspection without breaking the layout.

- [ ] Step 4: Inspect computed styles for critical SVG classes.

Expected values:

```text
.actor stroke: rgb(83, 58, 253)
.actor-line stroke: rgb(205, 216, 229)
.messageLine0 stroke: rgb(28, 30, 84)
.messageText fill: rgb(66, 84, 102)
.note fill: rgb(255, 251, 230)
.note stroke: rgb(155, 104, 41)
```

## Task 6: Run UAT And Build Checks

**Files:**
- Existing files only.

- [ ] Step 1: Run the existing smoke flow.

Run:

```bash
npm run uat:smoke
```

Expected:

```text
Flow passed
```

- [ ] Step 2: Run the preview style flow.

Run:

```bash
MAESTRO_BIN="${HOME}/.maestro/bin/maestro" \
  "${HOME}/.maestro/bin/maestro" --platform web test --headless \
  --debug-output=.maestro/debug-output \
  .maestro/flows/web-preview-style-alignment.yaml
```

Expected:

```text
Flow passed
```

- [ ] Step 3: Run the legacy build check if CSS/JS files changed.

Run:

```bash
npm run build:check
```

Expected:

```text
Finished
```

If the legacy build check fails for an unrelated pre-existing dependency issue, record the exact failure in `progress.md` and keep product changes scoped.

## Task 7: Planning And Handoff Updates

**Files:**
- Modify: `planning/active/live-preview-render-style-alignment/findings.md`
- Modify: `planning/active/live-preview-render-style-alignment/progress.md`
- Modify: `planning/active/live-preview-render-style-alignment/task_plan.md`

- [ ] Step 1: Update `findings.md` with final screenshot observations and any skipped geometry tuning decision.
- [ ] Step 2: Update `progress.md` with exact commands run and pass/fail results.
- [ ] Step 3: Update this plan's lifecycle.

If implementation is complete and verified:

```markdown
## Current State

Status: waiting_review
Archive Eligible: no
Close Reason:
```

Expected:

- Planning files accurately describe what changed, what was verified, and what remains open.

## Acceptance Criteria

- Live Preview sequence render visually matches intro demo's core language: purple actor boxes, light dashed lifelines, deep navy arrows, muted labels, pale yellow notes, compact centered canvas.
- Fit mode no longer makes the sample sequence diagram feel substantially larger than the intro demo preview.
- 100% mode remains usable and scrollable for inspection.
- Flowchart preview remains readable and stable.
- No full UI redesign is introduced.
- No Mermaid upgrade, parser rewrite, storage migration, drawer/modal redesign, or dark mode implementation is introduced.
- Existing smoke flow passes.
- New preview style UAT flow passes or documents a Maestro SVG-text limitation with a stable fallback assertion.
- Browser visual verification records the critical token checks listed in Task 5.

## Risks And Mitigations

- Risk: Mermaid-generated SVG class names may differ across diagram types.
  - Mitigation: keep changes to known classes already present in `chart-default.css`; inspect rendered sample sequence and sample flowchart before finalizing.
- Risk: `#graphDiv` is the generated SVG element, not a wrapper.
  - Mitigation: test both fit and actual mode after changing width/max-width rules.
- Risk: CSS variables are defined after `chart-default.css` is loaded.
  - Mitigation: CSS custom properties resolve at computed-value time, so this is acceptable; use literal fallback-like values when matching intro tokens exactly.
- Risk: Maestro may not reliably see SVG text nodes.
  - Mitigation: use the new flow as a user-path regression guard and supplement style verification with browser computed-style checks.

## Self-Review

- Spec coverage: roadmap alignment, visual target, scope control, files, UAT, and verification are covered.
- Placeholder scan: no unresolved placeholder language is required to execute the plan.
- Type/name consistency: file paths and class names match inspected source: `.diagram`, `.chart`, `#chart`, `#graphDiv`, `.actor`, `.actor-line`, `.messageLine0`, `.messageLine1`, `.messageText`, `.note`, `.noteText`.
- Scope check: task is a single Version 2 live-preview slice and does not include unrelated UI surfaces.

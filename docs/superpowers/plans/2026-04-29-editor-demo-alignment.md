# Editor Demo Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让真实 `app/index.html` 第一屏体验对齐首页 hero demo 的窗口化 split workspace，修复“首页看起来很精致，进 app 后体验断层”的问题。

**Architecture:** 保留现有静态 HTML、jQuery、CodeMirror、Mermaid 和本地存储架构，只在 app shell 的 HTML/CSS 层做一次 focused polish。把当前两个独立 panel 收敛为一个统一的 `workspaceFileFrame`：顶部文件标题栏，下面左 code / 右 preview 的 50/50 工作台。

**Tech Stack:** Static HTML, global CSS, jQuery 3.1, CodeMirror, Mermaid API, Gulp build comments, `app/css/design-tokens.css`

---

## Active Task Link

- Active task path: `planning/active/editor-demo-alignment/`
- Lifecycle state: `active`
- Sync-back status: companion plan written; summary should be synced after review

## 背景判断

### 为什么 redesign-v3 已执行但效果仍未达标

redesign-v3 把品牌、nav、drawer、modal、landing 和工作台都推到了更现代的方向，但真实 app 的核心第一屏仍然像两个 dashboard card：左边输入说明 + 编辑器，右边输出说明 + 大 preview card。首页 hero demo 给用户的承诺却是一个“文件窗口”：`checkout-flow.cm` 标题栏、左右并排代码和预览、预览区有点阵背景，整个体验更像一个 polished diagram IDE。

所以本轮不继续扩大到全站重构，而是精准修复这个 mismatch。

## 方案比较

### Approach A: 只微调现有 panel CSS

- 做法：保留当前 `.editor` / `.diagram` 两个 panel，只把圆角、阴影、背景、比例调得更接近首页。
- 优点：改动最小，风险最低。
- 缺点：仍然是两个独立卡片，无法真正得到首页 demo 的统一文件窗口体验。

### Approach B: 推荐方案，统一文件窗口式 workspace

- 做法：在 `main` 内增加一个 `workspaceFileFrame`，把 editor 和 diagram 放进同一个 frame，新增文件标题栏和 50/50 split，保留当前功能 DOM 与事件绑定。
- 优点：最符合用户截图诉求，改动集中在 `app/index.html` 和 `app/css/main.css`，不碰核心渲染逻辑。
- 缺点：需要谨慎保护 `#code`、`#chart`、UAT 文本和 nav/modal 绑定。

### Approach C: 复刻首页 demo 后再逐步接功能

- 做法：把首页 demo 作为 app 第一屏重写，再把 CodeMirror 和 Mermaid 接进去。
- 优点：视觉还原度最高。
- 缺点：会接近二次重构，容易重新踩 redesign-v3 已解决过的行为 contract 风险。

**Recommendation:** 执行 Approach B。它能解决真实体验与首页 demo 的断层，同时把风险限制在 app shell 的表现层。

## 文件结构

### Modify

- `app/index.html`：在 `main` 内增加统一 workspace frame、file bar、split body；保留现有 id、modal、nav、UAT 文本。
- `app/css/main.css`：重写 app main area、workspace frame、editor pane、preview pane、CodeMirror surface、chart stage 的视觉层级。
- `app/js/app.js`：仅当文件标题栏需要同步当前 chart 名称/type/status 时小幅复用现有 `updateShellMeta()`；默认不改。
- `planning/active/editor-demo-alignment/task_plan.md`：同步 plan 路径、状态和摘要。
- `planning/active/editor-demo-alignment/progress.md`：记录执行与验证结果。

### Do Not Modify

- `app/intro.html`、`app/css/landing.css`：首页 demo 本身不在本轮范围。
- `app/css/chart-default.css`：不改变 Mermaid 输出语义和默认图形样式。
- `app/js/seqdef-hint.js`、`app/js/flowchart-hint.js`：不改变编辑器 hint 逻辑。
- `package.json`、`gulpfile.js`：不改变构建工具。

## Acceptance Criteria

- 进入 `index.html?maestro=1` 后，第一屏像首页 hero demo 的真实可编辑版本：统一文件壳、文件标题栏、左右 split、代码左、点阵 preview 右。
- 当前 chart 名称仍显示 `Sample sequence diagram`，UAT 可见文本 `Diagram Input`、`Live Preview`、`Chart Name`、`Sample flowchart`、`Maestro Smoke Flow` 不丢失。
- `#code` 仍由 CodeMirror 接管，输入后 `#chart` 实时渲染 Mermaid。
- `#new-flowchart-button`、`#show-charts-button`、`#export-diagram`、`#show-syntax` 仍保持原行为。
- Preview 的 Fit / 100% 仍通过现有 `data-preview-mode` 工作。
- 不引入新依赖，不做框架迁移。

## Task 1: Markup Shell Alignment

**Files:**
- Modify: `app/index.html`

- [ ] **Step 1: Add a unified workspace frame inside `main`**

Replace the direct child structure of `main` from two sibling panels:

```html
<main role="main" class="hidden">
  <section class="editor workspacePanel">
    ...
  </section>

  <section class="diagram workspacePanel">
    ...
  </section>
</main>
```

with this structure:

```html
<main role="main" class="hidden">
  <div class="workspaceFileFrame" aria-label="Editable diagram workspace">
    <div class="workspaceFileBar">
      <div class="workspaceWindowControls" aria-hidden="true">
        <span class="windowDot windowDotDanger"></span>
        <span class="windowDot windowDotWarning"></span>
        <span class="windowDot windowDotSuccess"></span>
      </div>
      <div class="workspaceFileMeta">
        <span class="workspaceFileName" id="workspace-file-name">Sample sequence diagram.cm</span>
        <span class="workspaceFileType" id="workspace-file-type">SEQ</span>
      </div>
      <div class="workspaceFileStatus" id="workspace-file-status">Saved locally</div>
    </div>

    <div class="workspaceSplit">
      <section class="editor workspacePanel">
        ...existing editor content...
      </section>

      <section class="diagram workspacePanel">
        ...existing diagram content...
      </section>
    </div>
  </div>
</main>
```

Keep the exact existing editor and diagram section internals at this step. Do not change `#code`, `#chart`, quick chips, preview chips, visible headings, or modal markup.

- [ ] **Step 2: Keep UAT-visible copy intact**

Confirm these strings still appear in `app/index.html` after the wrapper change:

```text
Sample sequence diagram
Diagram Input
Live Preview
Chart Name
My Charts
New Flowchart
```

Run:

```bash
rg "Sample sequence diagram|Diagram Input|Live Preview|Chart Name|My Charts|New Flowchart" app/index.html
```

Expected: every string is present at least once.

## Task 2: File Bar State Sync

**Files:**
- Modify: `app/js/app.js`

- [ ] **Step 1: Extend `updateShellMeta()` for the new file bar**

Update the existing function so it syncs the new file bar without creating a second state source:

```javascript
function updateShellMeta() {
  if (!controller.currentChart) return;

  var chartName = controller.currentChart.name;
  var chartType = chartTypeLabel(controller.currentChart.type);

  $("#current-chart-name").text(chartName);
  $("#current-chart-type").text(chartType);
  $("#save-state-pill").text("Saved locally");
  $("#workspace-file-name").text(chartName + ".cm");
  $("#workspace-file-type").text(chartType);
  $("#workspace-file-status").text("Saved locally");
}
```

- [ ] **Step 2: Verify no missing selector errors**

Open `http://127.0.0.1:8000/index.html?maestro=1` in the browser console or use the running static server. Expected: no console error from `updateShellMeta()`; jQuery `.text()` calls are safe even if a selector is temporarily missing.

## Task 3: Workspace Frame CSS

**Files:**
- Modify: `app/css/main.css`

- [ ] **Step 1: Replace the main layout rule**

Replace current `main` rule with:

```css
main {
	display: flex;
	width: 100%;
	position: absolute;
	top: var(--app-nav-height);
	bottom: 0;
	padding: 18px;
	box-sizing: border-box;
}
```

- [ ] **Step 2: Add the unified frame styles after the `main` rule**

```css
.workspaceFileFrame {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 0;
	border: 1px solid rgba(214, 225, 239, 0.96);
	border-radius: var(--radius-lg);
	background: rgba(255, 255, 255, 0.94);
	box-shadow: var(--shadow-elevated);
	overflow: hidden;
}

.workspaceFileBar {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr) auto;
	align-items: center;
	gap: 18px;
	min-height: 52px;
	padding: 0 18px;
	border-bottom: 1px solid var(--color-border);
	background: var(--color-surface-muted);
}

.workspaceWindowControls {
	display: inline-flex;
	align-items: center;
	gap: 9px;
}

.windowDot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
}

.windowDotDanger { background: var(--color-danger); }
.windowDotWarning { background: #f4a340; }
.windowDotSuccess { background: var(--color-success); }

.workspaceFileMeta {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
	font-family: var(--font-mono);
	color: var(--color-text-muted);
}

.workspaceFileName {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 15px;
	letter-spacing: 0.02em;
}

.workspaceFileType {
	display: inline-flex;
	align-items: center;
	padding: 2px 6px;
	border-radius: var(--radius-sm);
	background: var(--color-brand);
	font-size: 10px;
	font-weight: var(--font-weight-medium);
	letter-spacing: 0.08em;
	color: #ffffff;
	text-transform: uppercase;
}

.workspaceFileStatus {
	font-family: var(--font-mono);
	font-size: 11px;
	font-weight: var(--font-weight-medium);
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-success);
}

.workspaceSplit {
	display: grid;
	grid-template-columns: minmax(360px, 0.92fr) minmax(420px, 1fr);
	min-height: 0;
	flex: 1 1 auto;
}
```

Expected result: the app workspace now has one top-level file frame with a single title bar.

## Task 4: Editor Pane Visual Alignment

**Files:**
- Modify: `app/css/main.css`

- [ ] **Step 1: Replace `.editor` panel styling**

Replace the current `.editor` rule with:

```css
.editor {
	position: relative;
	display: flex;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
	margin: 0;
	overflow: hidden;
	border-right: 1px solid var(--color-border);
	background: #fafbfd;
	box-shadow: none;
	border-radius: 0;
}
```

- [ ] **Step 2: Tighten the editor header to match the file-window feel**

Replace `.workspaceHeader`, `.workspaceCopy`, `.workspaceTitle`, and `.workspaceDescription` values with:

```css
.workspaceHeader {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 18px;
	padding: 18px 20px 12px;
	position: relative;
	z-index: 1;
}

.workspaceCopy {
	max-width: 360px;
}

.workspaceTitle {
	margin: 0;
	font-size: 22px;
	line-height: 1.1;
	letter-spacing: -0.02em;
	color: var(--color-heading);
}

.workspaceDescription {
	margin: 8px 0 0;
	font-size: 13px;
	line-height: 1.45;
	color: var(--color-text-muted);
}
```

- [ ] **Step 3: Make CodeMirror feel like the homepage code pane**

Update the CodeMirror-related rules to:

```css
.CodeMirror {
	height: 100%;
	background: transparent;
	color: var(--color-heading);
	font-family: var(--font-mono);
	font-size: 13px;
	line-height: 1.85;
	padding-top: 0;
	border-top: 1px solid rgba(229, 237, 245, 0.82);
}

.CodeMirror-gutters {
	background: rgba(238, 244, 251, 0.58);
	border-right: 1px solid var(--color-border);
	padding-top: 0;
}

.CodeMirror pre {
	line-height: 24px;
}

.CodeMirror-linenumber {
	line-height: 24px;
	color: rgba(100, 116, 141, 0.72);
}
```

Expected result: input side feels like a refined code pane, not a form card.

## Task 5: Preview Pane Visual Alignment

**Files:**
- Modify: `app/css/main.css`

- [ ] **Step 1: Replace `.diagram` styling**

Replace the current `.diagram` rule with:

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
		radial-gradient(circle at 24px 24px, rgba(100, 116, 141, 0.13) 1.4px, transparent 1.6px) 0 0 / 28px 28px,
		linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 249, 252, 0.96));
	box-shadow: none;
	border-radius: 0;
}
```

- [ ] **Step 2: Replace `.chart` styling so the graph floats inside the dotted stage**

Replace the current `.chart` rule with:

```css
.chart {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-height: calc(100vh - 250px);
	margin: 0;
	padding: 32px;
	border: 0;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
	overflow: auto;
}
```

- [ ] **Step 3: Keep actual-size mode usable**

Keep this existing mode rule, but confirm it still follows `.diagram[data-preview-mode="actual"]`:

```css
.diagram[data-preview-mode="actual"] #graphDiv {
	width: max-content;
	min-width: 0;
}
```

Expected result: output side resembles the homepage demo preview surface: dotted workspace, diagram centered, less chrome around the chart itself.

## Task 6: Responsive Desktop Guardrails

**Files:**
- Modify: `app/css/main.css`

- [ ] **Step 1: Add medium desktop behavior**

Add near the end of `main.css`, before modal-only overrides if possible:

```css
@media (max-width: 1100px) {
	.app-nav {
		padding: 0 14px;
	}

	.app-nav-actions {
		gap: 6px;
	}

	.nav-button {
		padding: 0 10px;
		font-size: 13px;
	}

	.workspaceSplit {
		grid-template-columns: minmax(340px, 0.95fr) minmax(380px, 1fr);
	}

	.workspaceDescription {
		max-width: 300px;
	}
}
```

- [ ] **Step 2: Preserve the existing desktop-only contract**

Do not remove:

```css
html,
body {
	height: 100%;
	min-width: 768px;
	margin: 0;
}
```

Expected result: the app remains desktop-only as already designed, but the unified frame does not crush the editor at narrower desktop widths.

## Task 7: Verification

**Files:**
- No app file changes unless verification exposes a scoped bug.
- Modify: `planning/active/editor-demo-alignment/progress.md`

- [ ] **Step 1: Static server smoke**

Use the existing server if it is still running. Otherwise run:

```bash
python3 -m http.server 8000 --directory app
```

Then run:

```bash
curl -I http://127.0.0.1:8000/index.html?maestro=1
curl -I http://127.0.0.1:8000/js/app.js
curl -I http://127.0.0.1:8000/css/main.css
```

Expected: all return `HTTP/1.0 200 OK` or `HTTP/1.1 200 OK`.

- [ ] **Step 2: Manual browser checks**

Open:

```text
http://127.0.0.1:8000/index.html?maestro=1
```

Verify:

```text
The workspace has a single file-window frame.
The file bar shows Sample sequence diagram.cm and SEQ.
The left pane still shows Diagram Input and CodeMirror line numbers.
The right pane still shows Live Preview and a rendered sequence diagram.
Typing in the editor updates the diagram.
Fit and 100% preview controls still toggle layout.
New Flowchart opens the modal with Chart Name.
My Charts opens the drawer and shows saved charts.
Syntax Guide opens the correct syntax modal.
Export PNG starts the existing export path.
```

- [ ] **Step 3: Optional Maestro smoke if available**

Run:

```bash
npm run uat:smoke
```

Expected: smoke flow passes. If it fails due the known external Maestro setup problem, record the exact failure in `planning/active/editor-demo-alignment/progress.md` and keep manual checks as the acceptance gate.

- [ ] **Step 4: Diff hygiene**

Run:

```bash
git diff --check -- app/index.html app/css/main.css app/js/app.js planning/active/editor-demo-alignment docs/superpowers/plans/2026-04-29-editor-demo-alignment.md
git status --short
```

Expected: no whitespace errors; changed files are limited to the planned scope.

## Risks And Mitigations

- **Risk:** New wrapper breaks CSS assumptions for the absolute-positioned `main` layout.
  **Mitigation:** Keep `main` absolute positioning and move layout responsibility into `workspaceFileFrame` / `workspaceSplit` only.

- **Risk:** Existing jQuery selectors fail because sections move inside a new wrapper.
  **Mitigation:** Preserve all ids and classes that `app/js/app.js` binds: `#code`, `#chart`, `.quick-chip`, `.preview-chip`, `#show-charts-button`, modal ids, form classes.

- **Risk:** File bar creates duplicate or stale chart state.
  **Mitigation:** Extend `updateShellMeta()` instead of introducing a new state update function.

- **Risk:** Dotted preview background makes Mermaid diagrams less legible.
  **Mitigation:** Use low-alpha dots and do not modify `chart-default.css`; if legibility is weak, reduce dot alpha before changing diagram styles.

## Completion Notes

- Do not commit automatically. Prepare the diff and verification notes for user review.
- Keep this task separate from `planning/active/redesign-v3-stripe/`; that task represents the broader redesign and should not be reopened for this focused B pass.
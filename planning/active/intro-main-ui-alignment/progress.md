# Progress Log

## Session: 2026-05-05

### Phase 1: 上下文恢复与基线
- **Status:** complete
- **Started:** 2026-05-05 22:58 +08:00
- Actions taken:
  - 阅读 companion plan 全文，并核对 `app/intro.html`、`app/index.html`、`app/js/app.js`、`app/css/design-tokens.css`、`app/css/landing.css`、`app/css/main.css` 与 prototype 参考文件。
  - 确认仓库已有 `.worktrees/` 且被 git ignore，创建隔离 worktree：`.worktrees/intro-main-ui-alignment`。
  - 在 worktree 中运行 `npm install --no-fund --no-audit` 与基线 `npm test`。
  - 初始化 `planning/active/intro-main-ui-alignment/` 三个任务跟踪文件，并在会话 SQL 中录入 9 个执行任务。
- Files created/modified:
  - `planning/active/intro-main-ui-alignment/task_plan.md` (created)
  - `planning/active/intro-main-ui-alignment/findings.md` (created)
  - `planning/active/intro-main-ui-alignment/progress.md` (created)

### Phase 2: 合约测试与共享 token
- **Status:** in_progress
- Actions taken:
  - 新增 `tests/ui-alignment-contract.test.js`。
  - 运行 `npm test`，确认新增失败集中在 intro/main 结构与 token 缺口，符合计划预期。
  - 开始补 `app/css/design-tokens.css` 缺失 token/alias。
- Files created/modified:
  - `tests/ui-alignment-contract.test.js` (created)
  - `app/css/design-tokens.css` (in progress)

## Test Results
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Baseline unit tests | `cd .worktrees/intro-main-ui-alignment && npm test` | 现有基线通过或暴露历史失败 | 10/10 passing | ✓ |
| Contract red test | `cd .worktrees/intro-main-ui-alignment && npm test` | 新增 UI contract tests 因缺少结构/token 而失败 | 3 个新增测试失败，命中 intro/main/token 缺口 | ✓ |

## Error Log
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-05-05 23:0x +08:00 | 新增 contract tests 失败 | 1 | 失败原因符合预期，进入实现阶段 |

## 5-Question Reboot Check
| Question | Answer |
|----------|--------|
| Where am I? | Phase 2 - Task 2 design tokens |
| Where am I going? | token → intro → main shell/CSS/JS → UAT → 严格验证 |
| What's the goal? | 完成 intro/main UI alignment，同时保留运行时和测试合约 |
| What have I learned? | 当前代码已部分 redesign，但仍不满足计划中的结构 contract |
| What have I done? | 已建立 worktree、完成基线测试、初始化持久化计划与 todo |

## 2026-05-06（续）

### Maestro Flow 根因调试与修复

**问题**：`assertVisible: "Beautiful diagrams from"` 超时失败。

**根因诊断**（系统化调试流程）：
1. `text-transform: uppercase` 导致 eyebrow/section-label 文本断言不可用（如 `Local-first`、`Live demo`）
2. `<h1>` 有混合子节点（text + `<em>`），Maestro web Beta 无法匹配跨节点文本
3. 长段落文本（`<p class="lede">`）断言超时——Maestro web Beta 对非交互元素的长 innerText 匹配存在限制
4. Nav 按钮（My Charts、New chart）含 SVG 子节点，innerText 前缀空白导致匹配失败
5. `assertVisible: "Try it live"` 隐式触发页面滚动，导致后续元素出视口

**修复策略**：改用只在初始视口内的短原子文本节点（ChartMage、Open editor）+ id 选择器（show-charts-button、new-chart-button）

### 最终验证结果
- ✅ 14/14 静态合约测试通过
- ✅ 5/5 dist assets HTTP 200
- ✅ Maestro intro E2E flow 全通过（7 步）
- ✅ 提交: `595c070`
- ✅ 推送: `origin/intro-main-ui-alignment`

## 2026-05-06（收尾）

### dev 同步、PR 与本地清理准备

- 本地 `dev` 已 fast-forward 到 `origin/dev`（`d782dae`）。
- 已创建 PR：`https://github.com/ilderaj/chart-mage/pull/9`（`dev -> main`）。
- 发现仓库中不存在 `./scripts/harness checkpoint . --quiet` 可执行入口，因此改用 git bundle 作为清理前检查点：
  - `/Users/jared/.copilot/session-state/317ce829-54f6-444b-8f70-5e53050335f9/files/intro-main-ui-alignment-pre-cleanup.bundle`

### 本地清理回退方案

1. 若只需恢复本地分支与 worktree：`git fetch origin intro-main-ui-alignment:intro-main-ui-alignment`
2. 重新创建 worktree：`git worktree add .worktrees/intro-main-ui-alignment intro-main-ui-alignment`
3. 若远端分支将来被删除，可从 bundle 恢复：`git clone /Users/jared/.copilot/session-state/317ce829-54f6-444b-8f70-5e53050335f9/files/intro-main-ui-alignment-pre-cleanup.bundle <target-dir>`

## 2026-05-06（增量修复）

### intro live demo footer 裁切

- 问题：`app/intro.html` 的 live demo 底部 footer 文案在浏览器像素截图里出现下沿裁切，尤其是左侧 `rendered` 和右侧 `Local Mermaid`。
- 根因：`app/css/landing.css` 中 `.pane-footer` 使用固定高度布局，且 monospace 文本基线在当前渲染环境里偏低，导致底栏内容贴近下边缘。
- 修复：将 `.pane-footer` 改为 `min-height` + padding 的内容驱动布局，并把 footer 内联项整体上移 1px，消除基线贴边。
- 验证：新增并跑通 `tests/ui-alignment-contract.test.js` 中的 footer regression；同时通过本地浏览器对 `.pane-footer` 元素截图复核，底栏文案已完整显示。

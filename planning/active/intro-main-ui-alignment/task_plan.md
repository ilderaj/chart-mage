# Task Plan: intro-main-ui-alignment

## Goal
将生产 `app/intro.html` 与 `app/index.html` 对齐到 `prototypes/redesign-v3/` 的视觉方向，同时保留现有静态应用的存储、编辑、渲染、导出、路由与 Maestro/UAT 合约，并完成完整验证。

## Current State
Status: active
Archive Eligible: no
Close Reason:

## Companion Plan
- Path: `docs/superpowers/plans/2026-05-05-intro-main-ui-alignment.md`
- Summary: 9 个任务，覆盖 contract tests、tokens、intro/main shell、CSS、JS bridge、Maestro flow 与严格验证矩阵。
- Sync-back status: synced on start; execution tracking now lives here.

## Current Phase
Phase 2 - Task 2 design tokens (after Task 1 red confirmed)

## Phases

### Phase 1: 上下文恢复与基线
- [x] 审阅 companion plan 和现有生产文件
- [x] 在 `.worktrees/intro-main-ui-alignment` 创建隔离工作区
- [x] 运行基线 `npm install` 与 `npm test`
- **Status:** complete

### Phase 2: 合约测试与共享 token
- [x] 新增 `tests/ui-alignment-contract.test.js`
- [x] 先观察新测试按预期失败
- [ ] 补齐 `app/css/design-tokens.css` 所需 token/alias
- **Status:** in_progress

### Phase 3: Intro 页面与 live demo
- [ ] 重建 `app/intro.html`
- [ ] 重写 `app/css/landing.css`
- [ ] 接入本地 Mermaid intro demo
- **Status:** pending

### Phase 4: 主功能页 shell、样式与桥接
- [ ] 重构 `app/index.html` shell
- [ ] 重塑 `app/css/main.css`
- [ ] 最小化调整 `app/js/app.js`
- **Status:** pending

### Phase 5: UAT 与全量验证
- [ ] 添加 intro Maestro flow
- [ ] 更新 smoke flow 列表
- [ ] 运行 tests/build/http smoke/maestro smoke/visual diagnostics
- **Status:** pending

## Risk Assessment

| 风险 | 触发条件 | 影响范围 | 缓解 / 已落盘的回退方案 |
|---|---|---|---|
| 现有页面已部分对齐，计划假设略旧 | 盲目按“全量重写”执行 | 容易破坏现有 selector/runtime | 以新 contract tests 为准，只改未满足的结构与样式 |
| shell 重构误伤 legacy id / modal 流程 | HTML shell 大改 | `app.js` 事件绑定、Maestro flow | 先写静态 contract tests，保留既有 id 与 modal id |
| intro/main CSS 大改引入回归 | landing/main 样式重写 | 横向滚动、移动端、drawer/modal 显示 | 用无渐变球背景的 contract + 后续 HTTP/Maestro/视觉验证兜底 |

## Key Questions
1. 当前仓库中已存在的半成品 redesign 代码，哪些可以复用？→ 可复用局部 token、部分 nav/toolbar 结构，但仍需对齐 plan 指定 class/id contract。
2. 是否需要复制 prototype runtime？→ 不需要；只复用视觉结构与必要文案，继续保留现有 jQuery/CodeMirror/mermaidAPI/localStorage 合约。

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 在 `.worktrees/intro-main-ui-alignment` 中实施 | 避开原工作树中的无关改动，满足 executing-plans / using-git-worktrees 流程要求 |
| 以静态 contract tests 作为改造护栏 | 先锁定 intro/main/token/js contract，防止 UI 重构破坏运行时接口 |
| 以现有生产文件为基础做增量重构，而非复制 prototype | plan 明确禁止复制 prototype runtime，且仓库已有部分对齐代码可复用 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| 新增 contract tests 后 `npm test` 失败 | 1 | 失败点与预期一致：intro 缺 `.site-nav`，main 缺 `.app-layout`，tokens 缺 `--color-warn`，继续进入实现阶段 |

## Notes
- 当前权威任务状态位于 `planning/active/intro-main-ui-alignment/`。
- 工作目录：`/Users/jared/Vibings/ChartMage/.worktrees/intro-main-ui-alignment`
- 下一步严格按 TDD：先写 `tests/ui-alignment-contract.test.js`，再运行失败测试。

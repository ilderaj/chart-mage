# 编辑器体验对齐首页 Demo 任务

## 目标
- 将实际 `app/index.html` 编辑器第一屏对齐到首页 hero demo 的产品体验：左侧代码输入、右侧实时预览、窗口化文件壳、精致画布、紧凑工具栏。
- 范围限定为 B：修正首页承诺与实际 app 工作台之间的体验断层；不继续推进全量 redesign-v3 重构。

## 当前状态
Status: waiting_review
Archive Eligible: no
Close Reason:

Companion plan: `docs/superpowers/plans/2026-04-29-editor-demo-alignment.md`
Companion summary: 推荐执行 B 方案：在 `app/index.html` 的 `main` 内增加统一 `workspaceFileFrame`，将现有 editor/preview 收敛成首页 demo 风格的文件窗口式 split workspace；主要修改 `app/index.html` 与 `app/css/main.css`，仅为同步文件标题栏状态小幅调整 `app/js/app.js`。
Sync-back status: companion plan written and synced

## 范围

### In Scope
- 真实 app 第一屏视觉对齐首页 `checkout-flow.cm` demo。
- 编辑器和 preview 使用更像文件窗口的整体壳，而不是两个独立大卡片。
- 代码面板使用更接近首页 demo 的 monospace、语法色、行距和内边距。
- Preview 面板增加点阵背景、居中的 diagram canvas、轻量 title/tool bar 语义。
- 保留当前 DOM contract 和 UAT 可见文字：`Sample sequence diagram`、`Diagram Input`、`Live Preview`、`Chart Name`、`Sample flowchart`、`Maestro Smoke Flow`。

### Out of Scope
- 全量 landing/nav/drawer/mobile fallback 重构。
- 替换 jQuery、CodeMirror、Mermaid 或 Gulp 架构。
- Mermaid 图形语义、导出机制、本地存储机制重写。
- 新功能，例如多格式导出、主题切换、协作、云同步。

## 阶段
1. 对齐差距与执行方案确认（已完成）
2. 输出 companion implementation plan（已完成）
3. 后续如用户批准，再执行应用代码改动（等待评审）

## 决策
- 2026-04-29：用户选择 B 范围；不继续全量 redesign-v3。
- 2026-04-29：本任务独立于 `redesign-v3-stripe`，使用 `planning/active/editor-demo-alignment/` 记录状态。

## 已知约束
- 仓库当前工作区干净。
- `redesign-v3-stripe` 已执行过，但真实 app 仍未达到首页 demo 的最终感受。
- 当前 `main.css` 已有 Stripe token 层和 workspace panels，但视觉结构仍偏“dashboard panels”，不是首页 demo 的“single file workspace”。
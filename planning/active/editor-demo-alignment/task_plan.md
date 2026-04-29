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
3. 后续如用户批准，再执行应用代码改动（已完成，等待评审）

## 实施摘要
- `app/index.html`：在 `main` 中加入 `workspaceFileFrame`、`workspaceFileBar` 和 `workspaceSplit`，保留原 editor/preview 内容、关键 id、modal 和 UAT 文案。
- `app/js/app.js`：扩展 `updateShellMeta()`，让新文件标题栏跟随当前 chart name/type/save status 更新。
- `app/css/main.css`：将两个独立 dashboard panel 收敛为首页 demo 风格的统一文件窗口；压缩 pane header，隐藏说明文案，左侧代码面板与右侧点阵 preview 工作区更接近首页 hero demo。

## 验证结果
- VS Code diagnostics：`app/index.html`、`app/css/main.css`、`app/js/app.js` 均无错误。
- 结构检查：关键 UAT 文案和新 workspace selector 均存在。
- HTTP smoke：`http://127.0.0.1:8000/index.html?maestro=1`、`/js/app.js`、`/css/main.css` 均返回 `200 OK`。
- Browser/Playwright：确认 `workspaceFileFrame`、`workspaceSplit`、`#code`、`#chart`、`#graphDiv` 存在；桌面宽度无横向 overflow；editor/preview 约 49/51 分栏。
- 交互检查：Fit/100%、My Charts drawer、New Flowchart modal、Syntax modal 均可用。
- UAT：`npm run uat:smoke` 在 8000 服务就绪后通过。
- Project test script：`npm test` 仍为未配置脚本，输出 `Error: no test specified` 并退出 1；此限制早已存在，不作为本任务通过标准。

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `python3 -m http.server 8000 --directory app` initially reported `Address already in use` | Start workspace task | Later verified 8000 was not serving; started the task again successfully before UAT. |
| `curl` failed with `zsh: no matches found` for `?maestro=1` | HTTP smoke | Re-ran with quoted URL. |
| 8001 returned `index.html` 200 but app assets 404 | Alternate port smoke | Determined 8001 was serving a different directory; used 8899 for manual verification and 8000 for UAT. |
| First `npm run uat:smoke` failed with `ERR_CONNECTION_REFUSED` | UAT smoke | Started the expected 8000 static server and re-ran; smoke passed. |

## 决策
- 2026-04-29：用户选择 B 范围；不继续全量 redesign-v3。
- 2026-04-29：本任务独立于 `redesign-v3-stripe`，使用 `planning/active/editor-demo-alignment/` 记录状态。

## 已知约束
- 仓库当前工作区干净。
- `redesign-v3-stripe` 已执行过，但真实 app 仍未达到首页 demo 的最终感受。
- 当前 `main.css` 已有 Stripe token 层和 workspace panels，但视觉结构仍偏“dashboard panels”，不是首页 demo 的“single file workspace”。
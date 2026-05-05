# intro 与主功能页 UI 对齐发现

## 2026-05-05 Context Findings

- 生产 intro 当前文件是 `app/intro.html`，样式在 `app/css/landing.css`。它已经使用 `design-tokens.css`，但仍是 v2 single-screen composer，不是 redesign-v3 的 sticky nav、center hero、live demo、features、footer 页面结构。
- 生产主功能页当前文件是 `app/index.html`，样式在 `app/css/main.css`，运行时在 `app/js/app.js`。它已经有 editor-demo alignment 的 `workspaceFileFrame`，但仍不同于 redesign-v3 app 的固定 52px nav、full viewport split、drawer/modal/mobile gate 语言。
- `app/js/app.js` 使用 jQuery、CodeMirror、`mermaidAPI.min.js`、`spells` 和 `lastOpenID`。执行计划不能复制 prototype 的 `cm_charts` / `cm_active_id` storage runtime。
- 当前 Mermaid legacy API 调用方式是 `mermaidAPI.initialize(...)`、`mermaidAPI.parse(...)`、`mermaidAPI.render('graphDiv', diagramDefinition, insertSvg)`。
- `package.json` 中 `npm test` 已配置为 `node --test tests/*.test.js`，可新增 Node 静态合约测试。
- Maestro smoke 入口是 `scripts/run-maestro-web-smoke.sh`，默认 flows 列表可新增 intro UI 对齐 flow。
- 工作区已有用户侧 prototype/`.DS_Store`/zip 变更。本任务计划不得清理或回滚这些改动。

## 关键合约

- Intro 必须保留 `window.__chartMageIsMaestro`、favicon、Google Analytics 跳过逻辑、`js/maestro-observer.js`、`.start-drawing` 写入 `localStorage.visited`。
- Main app 必须保留 ids：`code`、`chart`、`current-chart-pill`、`current-chart-name`、`current-chart-type`、`save-state-pill`、`show-charts-button`、`show-syntax`、`export-diagram`、`new-chart-button`、`new-chart-picker`、`charts-drawer`、`drawer-backdrop`、`drawer-search`、`drawer-list`、`drawer-count`。
- Production links must use `index.html`, not prototype `app.html`.

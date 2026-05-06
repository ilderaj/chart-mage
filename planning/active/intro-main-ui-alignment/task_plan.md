# intro 与主功能页 UI 对齐任务

## 目标
- 基于设计师提供的 `prototypes/redesign-v3/index.html` 与 `prototypes/redesign-v3/app.html`，输出可 review 的严格实施计划。
- 后续获批后，将生产 `app/intro.html` 和 `app/index.html` 对齐到 redesign-v3 方向，同时保留现有静态 app 的行为、存储、渲染、导出和 UAT 合约。

## 当前状态
Status: waiting_review
Archive Eligible: no
Close Reason:

Companion plan: `docs/superpowers/plans/2026-05-05-intro-main-ui-alignment.md`
Companion summary: 渐进式移植 redesign-v3 UI。intro 采用新 landing/nav/hero/live-demo/features/footer；主功能页采用固定 top nav、全视口 split editor、drawer/modal/mobile gate。保留 legacy ids、CodeMirror、jQuery、local Mermaid API、`spells` 和 `lastOpenID` localStorage 合约。测试包括 Node 静态合约、Gulp build、HTTP smoke、Maestro intro/full smoke、桌面和移动浏览器视觉检查。
Sync-back status: companion plan written and synced

## 范围

### In Scope
- `app/intro.html` 与 `app/css/landing.css` 的 redesign-v3 landing 对齐。
- `app/index.html` 与 `app/css/main.css` 的 redesign-v3 main app shell 对齐。
- `app/css/design-tokens.css` 补齐少量共享 token。
- `app/js/app.js` 仅做必要 selector、mobile gate 和状态同步桥接。
- 新增静态 UI 合约测试与 intro Maestro UAT flow。
- 严格验证：`npm test`、`npm run build`、HTTP smoke、`npm run uat:smoke`、浏览器视觉和交互检查。

### Out of Scope
- 不重写 jQuery、CodeMirror、Mermaid legacy API 或 storage schema。
- 不复制 prototype 的整套 runtime。
- 不改动 `prototypes/redesign-v3/` 用户素材。
- 不清理当前 `.DS_Store`、zip 或 prototype 变更。
- 不改 Cloudflare Pages 部署配置。
- 不提交 git commit，除非用户明确要求。

## 阶段
1. 读取相关 skills 与项目上下文（已完成）
2. 梳理生产 intro/main 与 redesign-v3 差距（已完成）
3. 输出 strict implementation plan（已完成，等待 review）
4. 用户 review 后再执行代码改动（未开始）

## 决策
- 使用独立 task id：`intro-main-ui-alignment`。
- `prototypes/redesign-v3/` 作为设计参考，只读，不纳入执行改动。
- intro live demo 如实现，必须使用本地 `js/lib/mermaidAPI.min.js`，不能引入 CDN Mermaid。
- 主功能页必须保留现有 legacy ids，让 `app/js/app.js` 和 Maestro flow 继续工作。
- 计划中提出一个待审 mobile 行为变更：主功能页小屏显示 `.mobile-gate`，不再强制跳回 intro。若用户不接受，执行前移除该步骤。

## 验证状态
- 已运行 planning session catchup，无输出。
- 已确认 `npm test` 当前配置为 `node --test tests/*.test.js`。
- 已确认 `scripts/run-maestro-web-smoke.sh` 默认 flows 可扩展。
- 尚未执行实现、build 或 UAT，本轮只交付计划。

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| 无 | 本轮只做计划 | 无 |

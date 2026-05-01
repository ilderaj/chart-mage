# Top Nav And Favicon Design Alignment Findings

## 2026-04-30 Initial Notes
- 用户指出当前顶栏未对齐新设计，且 favicon 似乎未更新。
- 截图中的目标顶栏是单一浮动玻璃栏：brand lockup、chart pill、save state、search、My Charts、Help、Export、primary `+ New chart`。
- 初步搜索显示 `app/index.html` 与 `app/intro.html` 使用 `images/favicon.svg` + PNG fallback，`app/browser.html` 仍只引用 `images/favicon.png`。
- 初步搜索显示当前 `app/index.html` 顶栏仍包含 `Current chart` caption、独立 `New Sequence Diagram` 与 `New Flowchart` CTA，以及多个分散 icon buttons。
- Repo memory 记录 Maestro 当前入口为 `npm run uat:smoke`，主 smoke URL 为 `http://127.0.0.1:8000/index.html?maestro=1`，已有稳定 id：`new-flowchart-button`、`show-charts-button`。

## 2026-04-30 Audit Findings
- `prototypes/redesign-v2/index.html` 的 top nav 权威描述为：`Logo · chart pill (name + type, click to rename) · save state · search (cmd-K) · My Charts · Help · Export · primary "+ New"`，并要求 floating/glass/rounded、与 workspace 视觉脱离。
- 当前 `app/index.html` 顶栏偏差：仍显示 `Current chart` caption；chart pill 不是 button；没有 top-nav search；`Help`/`Export` 是 icon-only；仍同时显示 `New Sequence Diagram` 与 `New Flowchart`；还有 About 与 mail 顶层 icon。
- 当前 `app/js/app.js` 已有可复用能力：drawer search、drawer open/close、rename modal、export handler、syntax modal、chart metadata update。实施应复用这些路径，不引入第二套数据流。
- `app/images/favicon.svg` 是新品牌 mark；`app/images/favicon.png` 是旧黑色箭头，和用户截图一致，是 favicon 未更新的直接原因之一。
- `app/browser.html` 只引用 `images/favicon.png`；`app/index.html` 与 `app/intro.html` 引用 SVG + PNG fallback。需要统一三处入口。
- `.maestro/flows` 当前覆盖 create flowchart、create sequence、rename、delete、preview style；没有顶栏 anatomy、Cmd-K/search、chart pill rename、favicon entrypoint 覆盖。
- `scripts/run-maestro-web-smoke.sh` 当前只硬编码运行 `web-smoke.yaml`，即使新增 flow，也需要调整 runner 或增加 suite 命令，否则 coverage backlog 不能标为 covered。

## Subagent Review Summary
- Design/spec reviewer 要求以 prototype top-nav anatomy 和 `DESIGN.md` token/radius/shadow规则为准；提醒 spec 必须写清 favicon 与 nav 验收标准。
- Implementation reviewer 要求保留现有 id 与事件绑定，尤其是 `show-charts-button`、`show-syntax`、`export-diagram`、`new-flowchart-button`、`current-chart-name`、`current-chart-type`、`save-state-pill`。
- UAT reviewer 认为 Maestro 适合覆盖可见文本、点击路径、drawer/search/rename 行为；favicon 像素、毛玻璃、精确间距需要 Playwright/截图或人工 checklist 补位。
- 三方共同风险：新增单一 `+ New chart` 不能破坏现有 Flowchart/Sequence 确定性创建路径；favicon SVG/PNG/HTML 引用必须同步，否则浏览器缓存与 fallback 会继续显示旧图标。

## Constraints
- 对话、评审、计划内容使用中文；代码、文档/UI strings 保持英文。
- 不要破坏现有 Maestro 稳定 id，除非同步更新 flows 与 spec。
- 当前部署路径是 Cloudflare Worker，不能把计划写回 Cloudflare Pages 路径。

## 2026-05-01 Final Validation Notes
- Maestro Web 不支持 `pressKey: "CMD+K"` 这一组合键写法；`web-nav-search.yaml` 最终通过 `#maestro-trigger-nav-search-shortcut` 触发同一条 app-level `Meta+K` keydown handler 完成覆盖。
- `drawer-count` 的 saved-count 文本并不稳定，不能作为搜索快捷键是否打开 drawer 的可靠断言；`drawer-search` 的显隐是更稳定的结构性验证点。
- `npm run uat:smoke` 与 `npm run build:check` 已在最终代码状态下通过，当前无未解决阻塞项。
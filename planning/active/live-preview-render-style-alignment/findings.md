# Live Preview Render Style Alignment Findings

## 任务定位

- 用户指出 `index.html` 的 Live Preview 渲染样式与 `intro.html` 顶部 hero demo 的输出样式仍有差异。
- 这不是全面 UI 重构；应作为 roadmap Version 2 `Unified Design Language Across Intro, App, And Fallbacks` 的窄范围切片处理。
- 该任务不应扩展到 drawer、modal、About、syntax guide、browser fallback、landing 全页重构或 Mermaid 升级。

## Roadmap 对齐

- 主对齐阶段：Version 2。
  - 直接命中 `Landing, editor ... read as one design system`。
  - 当前切片只覆盖 editor 中 `Live Preview` 渲染画布和 Mermaid 输出样式。
- 约束继承：Version 4。
  - Mermaid rendering pipeline 必须保持稳定。
  - 不在本任务中拆分 `app/js/app.js`，不升级 Mermaid，不引入构建工具变更。
- 验收继承：Maestro Coverage Policy。
  - 新增或更新 UAT flow 覆盖 live preview 主要路径。
  - 视觉像素级判断需要浏览器截图/计算样式补充；Maestro 负责防止用户路径回退。

## 截图差异摘要

- Intro hero demo：
  - 输出侧使用紧凑的点阵画布，点距约 18px，背景从白到 `#f6f9fc`。
  - actor 框为白底、紫色 `#533afd` 描边、4px 圆角。
  - lifeline 为浅蓝灰 `#cdd8e5` 虚线。
  - message line 为深靛蓝 `#1c1e54`，正向实线、返回线虚线。
  - message text 为中性蓝灰 `#425466`，字号较小，视觉密度高。
  - note 为浅黄 `#fffbe6`，边框/文字为 `#9b6829`。
- Live Preview 当前表现：
  - workspace chrome 已接近新版设计，但 Mermaid SVG 内部仍更像旧主题。
  - actor 框、箭头、文字比例、note 色彩和 intro demo 不完全一致。
  - preview 画布使用 28px 点阵，与 intro demo 的 18px 点阵不同。
  - `#graphDiv` 当前 `width: 100%` 会让 SVG 在 fit 模式中过度铺开，序列图视觉尺度偏大。

## 代码边界

- `app/index.html`
  - Live Preview DOM：`section.diagram > .previewToolbar > .previewBody > #chart`。
  - 已有 toolbar：`Fit`、`100%`、disabled `Dark`。
- `app/css/main.css`
  - 控制 workspace split、preview body、点阵背景、`#graphDiv` fit/actual 模式。
  - 当前 `.diagram` 点阵为 `28px 28px`，`.chart` padding 为 32px，`#graphDiv` width 为 100%。
- `app/css/chart-default.css`
  - 控制 Mermaid SVG 内部元素：actor、actor-line、messageLine、messageText、note、flowchart node/edge/cluster。
  - 当前已使用部分 design tokens 对应色值，但没有完全匹配 intro demo。
- `app/js/app.js`
  - Mermaid 初始化位置在 `mermaidAPI.initialize`。
  - `cloneCssStyles: true` 让 CSS 覆盖是首选路径。
  - `sequenceDiagram` 现有几何参数：`width: 150`、`height: 65`、`actorMargin: 120`。
- `.maestro/flows/`
  - 现有 `web-smoke.yaml` 覆盖 editor 基本加载和创建 flowchart。
  - 现有 `web-create-sequence.yaml` 覆盖 sequence 创建，但未专门覆盖 preview toolbar/渲染内容。

## 关键约束

- 不改 `intro.html` 的 hero SVG，除非发现它和 DESIGN.md 明确冲突。本任务以 intro demo 作为目标参照。
- 不改 Mermaid parser/translator 行为。
- 不改 localStorage schema。
- 不新增运行时依赖。
- 不将 disabled `Dark` 模式变成可用功能。
- 不把 preview 样式调成完全手工 SVG；仍使用 Mermaid 输出，只通过 CSS/theme 和轻量几何参数拉齐视觉语言。

## 待实施决策

- 推荐方案：CSS-first + very small Mermaid geometry tuning only if screenshot verification proves necessary。
- `chart-default.css` 应优先改 Mermaid 元素样式。
- `main.css` 应优先改 preview viewport framing 和 `#graphDiv` fit/actual 尺寸策略。
- `app.js` 只在 CSS 无法解决序列图比例时调整 `sequenceDiagram` 的 `actorMargin` / `width` / `height`。

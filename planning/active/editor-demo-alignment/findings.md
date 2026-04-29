# Findings

- 首页 hero demo 的核心体验是一个统一的文件窗口：顶部文件标题栏、左右 50/50 split、左侧代码、右侧点阵画布与序列图预览。
- 当前真实 app 已经有 Stripe token、nav、workspace header、quick insert、preview toolbar，但仍呈现为两个并列大卡片，和首页 demo 的统一文件壳不一致。
- 当前真实 app 左侧编辑器宽度约 36%，右侧 preview 占剩余空间；首页 demo 是近似 50/50 split，更强调“代码直接变图”的并置关系。
- 当前真实 app preview 外壳是大白卡 + 说明文字，首页 demo preview 是更安静的点阵工作区，视觉焦点落在图本身。
- 当前 `app/index.html` 已保留 UAT 关键文本和按钮 id，后续 plan 应避免破坏这些 contract。
- 当前 `app/js/app.js` 已提供 quick insert、preview fit/actual、drawer、export、syntax modal 行为；B 方案应尽量复用，不引入新交互系统。
- 当前 `app/css/main.css` 的大圆角 `20px/22px` 和页面级渐变背景比首页 demo 更“app dashboard”，首页 demo 角半径更克制，窗口感更强。
- 主要落点预计是 `app/index.html` 小幅结构调整与 `app/css/main.css` 大幅视觉收敛；`app/js/app.js` 只有在新增 file title/status 同步需要时才碰。
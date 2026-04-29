# Stripe Design MD 对齐任务

## 目标
- 在 ChartMage 仓库中安装 getdesign.md 的 `stripe` design.md。
- 基于安装结果与现有静态前端结构，产出一份待评审的设计语言对齐实施计划。

## 当前状态
Status: waiting_review
Archive Eligible: no
Close Reason:

Companion plan: `docs/superpowers/plans/2026-04-29-stripe-design-md-align.md`
Companion summary: 以 `design-tokens.css` 为共享 token 层，按 intro -> app shell -> modal/form -> browser fallback 的顺序完成 Stripe 设计语言对齐。
Sync-back status: companion plan written and synced

Implementation commit: `b863194`

## 阶段
1. 收集仓库结构与现有 UI 约束（已完成）
2. 安装 `getdesign@latest add stripe`（已完成）
3. 记录安装落点与兼容性影响（已完成）
4. 输出待评审 implementation plan（已完成）
5. 执行 design token 接入与页面对齐（已完成）
6. 完成可用验证并记录测试限制（已完成）
7. 追加 desktop polish 并整理产品提交（已完成）
8. 走查主功能流程并二次对齐输入/输出工作台（已完成）

## 已知约束
- 仓库是以 `app/` 为核心的静态前端项目。
- 现阶段先安装并规划，不直接大规模改造 UI。
- `getdesign` 安装结果为仓库根目录新增 `DESIGN.md`，未自动改写现有前端文件。
- 仓库 `npm test` 仅输出 `Error: no test specified` 并退出 1，当前没有项目级自动化测试套件可通过。

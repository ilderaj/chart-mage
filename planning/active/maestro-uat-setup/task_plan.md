# Maestro UAT 接入任务

## Goal
- 在 ChartMage 仓库中接入可复用的 Maestro Web UAT 测试框架，并完成一次真实 smoke 验证。

## Current State
Status: complete
Archive Eligible: no
Close Reason: Maestro Web smoke flow now passes locally after removing the ChartMage-specific DOM trigger that caused `CdpWebDriver.parseDomAsTreeNodes` to receive object-valued attributes, and after switching the flow to stable deterministic selectors.

## Current Phase
Phase 3

## Phases
1. 盘点仓库结构、Maestro Web 能力与最小 UAT 场景（已完成）
2. 新增仓库级 Maestro 工作区、脚本与运行入口（已完成）
3. 安装 CLI 并执行 smoke flow 验证（已完成）
4. 补充项目文档与后续用例生成策略说明（已完成）

## Risk Assessment

| 风险 | 触发条件 | 影响范围 | 缓解 / 已落盘的回退方案 |
|---|---|---|---|
| Web flow 选择器不稳定 | DOM 文本或 modal 行为与预期不一致 | smoke flow 首次执行失败 | 先以最小主链路落地，优先使用 id/text，可再局部调 flow |
| 本机缺少 Java 或 Maestro | CLI 无法运行 | 无法完成真实验证 | 提供安装脚本并在执行前显式检查依赖 |
| macOS 本机安装依赖失败 | Homebrew / 网络 / 权限问题 | 验证阶段卡住 | 记录失败点，必要时切换到用户已安装 JDK 或仅交付仓库接入 |
| Maestro Web / DOM 选择器稳定性 | 页面 DOM 存在对象型属性或 UI 入口只靠文本匹配 | 本地 smoke 在入口阶段失败 | 通过本地页面结构修复和稳定 id 选择器消除仓库侧触发器；若后续再遇到同类异常，优先检查 DOM 属性类型与关键入口 selector |

## Key Questions
1. 这个静态 Web 项目是否能直接用 Maestro Web 模式覆盖主 UAT 流程？
2. 哪条用户路径最适合作为第一条稳定 smoke flow？
3. 后续 spec / UI 设计是否能自动产出 Maestro 用例，边界在哪里？

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 使用 Maestro Web 模式而不是移动端 appId 流程 | ChartMage 是静态浏览器应用，直接指向本地 URL 最贴合真实 UAT |
| 采用 `.maestro/` 作为仓库工作区 | 与 Maestro 社区约定一致，便于未来扩展更多 flows |
| 第一条用例只做 smoke 主链路 | 先验证接入和执行通路，再逐步补全更细粒度 UAT 覆盖 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Java Runtime missing on host | 1 | 先确认可用包管理器，再安装 Java 17+ 后重跑 smoke 验证 |
| Maestro Web `ClassCastException` on DOM parsing | 1 | 已定位为 ChartMage 页面中 `form.name` 暴露对象型属性触发 `CdpWebDriver` 强制字符串转换；仓库侧已修复并完成 smoke 复验 |
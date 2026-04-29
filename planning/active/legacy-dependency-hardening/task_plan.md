# Legacy Dependency Hardening 任务

## Goal
- 将当前仓库的 legacy dependency / `npm audit` 风险收敛成一个可执行、可验证、可分阶段回滚的独立治理任务，不与 UX redesign 混写。

## Current State
Status: waiting_review
Archive Eligible: no
Close Reason:

Companion plan: `docs/superpowers/plans/2026-04-29-legacy-dependency-hardening.md`
Companion summary: 先稳住构建与 UAT 链，再按风险和破坏性分层升级 Gulp 生态、老旧 PostCSS/CSS minify 链和其余 devDependencies。
Sync-back status: companion plan written, summary synced to active task files

## Current Phase
Phase 0

## Phases
1. 建立基线与风险分层（待执行）
2. 收敛构建链高风险依赖（待执行）
3. 处理无法直接修复的 CSS / PostCSS 旧链（待执行）
4. 升级剩余低优先级工具依赖（待执行）
5. 完整验证与文档收口（待执行）

## Scope

**In scope**
- `package.json` / `package-lock.json` 的 dependency hardening
- `npm audit` 中 direct / transitive 风险分层与治理
- Gulp 构建链相关依赖升级与兼容性修复
- 必要的 `gulpfile.js` / 构建脚本调整
- `npm install`、`npm audit`、`npm run uat:smoke`、`./node_modules/.bin/gulp` 级别验证

**Out of scope**
- 继续做新的 UX / 产品功能改造
- 将静态站点整体迁移到新 bundler / framework
- 与安全治理无关的代码风格重构
- 生产运行时依赖替换（当前项目以 dev/build tooling 为主）

## Verified Baseline
- 当前 lockfile 为 `lockfileVersion=3`。
- `npm audit --json` 当前汇总为：`54` 个漏洞，其中 `2 low / 39 moderate / 13 high / 0 critical`。
- `npm outdated --json` 显示多个核心 devDependencies 与最新版本存在明显代差：
  - `gulp` `4.0.2 -> 5.0.1`
  - `gulp-autoprefixer` `3.1.1 -> 10.0.0`
  - `gulp-uglify` `2.1.2 -> 3.0.2`
  - `gulp-useref` `3.1.6 -> 5.0.0`
  - `del` `2.2.2 -> 8.0.1`
- 已知高风险热点集中在构建链：`gulp`, `gulp-autoprefixer`, `gulp-util`, `glob-watcher`, `cssnano` 及其旧 PostCSS 生态。

## Risk Assessment

| 风险 | 触发条件 | 影响范围 | 缓解 / 回退 |
|---|---|---|---|
| 构建链升级造成 `gulp` 任务语义变化 | `gulp` 5 / 插件升级引入 API 变化 | `dist/` 无法产出 | 每阶段只升级一层依赖并立即重跑本地 build |
| PostCSS / cssnano 旧链缺少无破坏性修复路径 | `gulp-cssnano` 绑定老 `cssnano` | CSS 压缩链需要替换 | 允许改为替代插件组合，但必须保留产物语义 |
| UAT 与构建链相互干扰 | 构建脚本或 HTML 入口变更 | Maestro smoke 回归失败 | 每个阶段后重跑 `npm run uat:smoke` |
| 大版本升级过多导致问题难以定位 | 同时改多个核心包 | 排障困难 | 按 phase 分层推进，避免一次性大升级 |

## Key Questions
1. 哪些漏洞可以通过非破坏性升级直接消除，哪些需要更换工具链组件？
2. 是否应该停在“风险显著下降且 build/smoke 稳定”，还是追求 `npm audit` 清零？
3. `gulp-cssnano` 是否应被替换为更现代、维护中的 CSS 压缩方案？
4. `gulp` 是否需要继续追到 5.x，还是 4.x + 部分插件升级就足够？

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 将依赖治理单独立成新 tracked task | 避免与已完成的 redesign 任务混淆，便于独立 review 与回滚 |
| 先产出 planning 和 companion impl plan，再决定是否执行 | 该任务包含多处大版本升级，先做分层设计更稳妥 |
| 以 build / smoke 可持续通过为第一优先级 | 依赖治理不能破坏当前可工作的产品入口 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `npm audit` 输出过大，不适合直接纳入 planning | 1 | 先提炼为摘要基线：漏洞总量、严重级别分布、主要高风险热点 |

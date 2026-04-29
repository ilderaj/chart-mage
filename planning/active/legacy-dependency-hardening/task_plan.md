# Legacy Dependency Hardening 任务

## Goal
- 将当前仓库的 legacy dependency / `npm audit` 风险收敛成一个可执行、可验证、可分阶段回滚的独立治理任务，不与 UX redesign 混写。

## Current State
Status: waiting_integration
Archive Eligible: no
Close Reason:

Companion plan: `docs/superpowers/plans/2026-04-29-legacy-dependency-hardening.md`
Companion summary: 已按分层计划完成依赖治理：升级 Gulp 生态、替换旧 `gulp-cssnano` 链、移除 `del`，最终 `npm audit` 与 `npm outdated` 均为 0。
Sync-back status: execution results synced to active task files and companion plan

## Current Phase
Phase 5

## Phases
1. 建立基线与风险分层（已完成）
2. 收敛构建链高风险依赖（已完成）
3. 处理无法直接修复的 CSS / PostCSS 旧链（已完成）
4. 升级剩余低优先级工具依赖（已完成）
5. 完整验证与文档收口（已完成，等待集成）

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
- 执行期基线：
  - `./node_modules/.bin/gulp` 通过。
  - `npm run uat:smoke` 通过；执行前已清理遗留 PID `84314`，该进程占用 `:8000` 且返回 empty reply。
  - direct vulnerabilities 分类：
    - `browser-sync` high，`fixAvailable: true`，来源 `localtunnel` / `send` / `serve-static`。
    - `gulp` high，修复建议为 `gulp@5.0.1`（semver-major）。
    - `gulp-autoprefixer` high，修复建议为 `gulp-autoprefixer@10.0.0`（semver-major）。
    - `gulp-cssnano` moderate，`fixAvailable: false`。
  - `gulp-cssnano` / `cssnano` / old PostCSS 链是 structural modernization，不适合 `npm audit fix` 盲跑。
- 最终验证：
  - `npm audit --audit-level=low` 通过，`0` vulnerabilities。
  - `npm outdated --json` 返回空对象，当前 devDependencies 无 outdated 项。
  - `./node_modules/.bin/gulp` 通过。
  - `npm run uat:smoke` 通过。
  - 抽样确认 `dist/images` 二进制产物与 `app/images` 源文件一致，避免 Gulp 5 / `vinyl-fs@4` 默认 UTF-8 转码破坏图片。

## Risk Assessment

| 风险 | 触发条件 | 影响范围 | 缓解 / 回退 |
|---|---|---|---|
| 构建链升级造成 `gulp` 任务语义变化 | `gulp` 5 / 插件升级引入 API 变化 | `dist/` 无法产出 | 每阶段只升级一层依赖并立即重跑本地 build |
| PostCSS / cssnano 旧链缺少无破坏性修复路径 | `gulp-cssnano` 绑定老 `cssnano` | CSS 压缩链需要替换 | 允许改为替代插件组合，但必须保留产物语义 |
| UAT 与构建链相互干扰 | 构建脚本或 HTML 入口变更 | Maestro smoke 回归失败 | 每个阶段后重跑 `npm run uat:smoke` |
| 大版本升级过多导致问题难以定位 | 同时改多个核心包 | 排障困难 | 按 phase 分层推进，避免一次性大升级 |
| 终止占用 `:8000` 的遗留验证进程 | 需要恢复标准 `npm run uat:smoke` 验证锚点；目标命令为 `kill 84314`，目标进程为 `/opt/homebrew/.../Python`，cwd 为 `/Users/jared/Vibings/ChartMage/.worktrees/cloudflare-pages-deploy` | 仅终止一个监听 TCP `:8000` 的 Python http server；不删除或改写文件；跨当前 worktree 但仍在同一 repo 的另一个 worktree 内 | 执行前确认 PID 与 cwd；无法用 `./scripts/harness checkpoint . --quiet`，因为本仓库没有 `scripts/harness`；回滚方式为从对应 worktree 重新启动需要的 http server |

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
| Phase 2 优先处理 `browser-sync` 与非核心插件升级，再处理 `gulp` / CSS minify | `browser-sync` audit fix 路径清晰；`gulp` 和 CSS minify 都可能引入构建语义变化，应单独隔离 |
| 替换 `gulp-cssnano` 为 `gulp-postcss` + `cssnano` | 旧 `gulp-cssnano` 无 audit fix，直接绑定老 PostCSS / cssnano 生态；新组合保留 CSS minify 行为并消除该风险链 |
| 升级到 `gulp@5.0.1` | CSS minify 链替换后，剩余全部 audit 风险都来自 `gulp@4` watcher/CLI 链；单独升级并验证通过 |
| 移除 `del`，改用 `fs.rmSync` | `del` 只用于清理 `dist`，用 Node 内置 API 可消除最后一个 outdated direct dependency |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `npm audit` 输出过大，不适合直接纳入 planning | 1 | 先提炼为摘要基线：漏洞总量、严重级别分布、主要高风险热点 |
| 基线 smoke 前置 server 无法启动，`:8000` 已被遗留 Python 进程占用且返回 empty reply | 1 | 已定位 PID `84314`，cwd 为 `.worktrees/cloudflare-pages-deploy`；执行 `kill 84314` 前需用户确认 |
| 使用变量形式 `kill "$pid"` 被 shell 安全策略拒绝 | 1 | 改为显式 numeric PID 命令 `kill 84314` 并完成端口释放 |
| `gulp-autoprefixer@10` 构建时报 `autoPrefixer is not a function` | 1 | 确认 CJS `require` 返回 `{ default }`，改为 `require("gulp-autoprefixer").default`，并更新 options 为 `overrideBrowserslist` |
| `gulp@5` 初次构建后图片被 UTF-8 转码破坏 | 1 | 定位到 `vinyl-fs@4` 默认 `encoding: "utf8"`；为 `copyImages` 的 `gulp.src` 和 `gulp.dest` 设置 `{ encoding: false }` |

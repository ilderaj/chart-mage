# Progress — Legacy Dependency Hardening

## Current phase

Phase 5 — Final verification and integration readiness.

## Log

- **2026-04-29** — 新建独立 tracked task `legacy-dependency-hardening`，用于承接 redesign 之后的 dependency / audit 治理工作。
- **2026-04-29** — 已读取当前 `package.json`、现有 active task 目录、已有 companion plan 示例，确认本任务应单独维护 planning 与 impl plan。
- **2026-04-29** — 已提取 dependency baseline：
  - `lockfileVersion=3`
  - `npm audit` 汇总为 `54` vulnerabilities（`2 low / 39 moderate / 13 high / 0 critical`）
  - `npm outdated` 显示多个核心 devDependencies 存在明显 major gap
- **2026-04-29** — 已创建 `task_plan.md`、`findings.md`、`progress.md`，并生成 companion implementation plan。
- **2026-04-29** — 开始执行 dependency hardening，已在 `.worktrees/legacy-dependency-hardening` 创建隔离工作树并运行 `npm install`。
- **2026-04-29** — 基线 `./node_modules/.bin/gulp` 通过；`npm run uat:smoke` 的前置 server 无法绑定 `:8000`。
- **2026-04-29** — 已定位 `:8000` 占用源：PID `84314`，Python http server，cwd 为 `/Users/jared/Vibings/ChartMage/.worktrees/cloudflare-pages-deploy`，父进程为 `launchd`。`curl` 返回 empty reply，说明它不能作为当前 smoke 验证服务复用。
- **2026-04-29** — 风险记录：拟执行的清理命令是 `kill 84314`；影响范围为终止一个遗留监听进程，不触碰文件。仓库没有 `./scripts/harness`，因此无法创建 harness checkpoint；回滚方式是在对应 worktree 重新启动需要的 http server。
- **2026-04-29** — 用户确认后已执行 `kill 84314`，释放 `:8000`。基线 `npm run uat:smoke` 通过。
- **2026-04-29** — 完成 Phase 1 分类：direct high 为 `browser-sync`、`gulp`、`gulp-autoprefixer`；`gulp-cssnano` 为 direct moderate 且无 direct fix；CSS/PostCSS 链需要单独 Phase 3 处理。
- **2026-04-29** — 升级轻量 direct deps：`browser-sync@3.0.4`、`gulp-if@3.0.0`、`gulp-uglify@3.0.2`、`gulp-useref@5.0.0`；build / smoke 通过，audit 降至 `49`。
- **2026-04-29** — 升级 `gulp-autoprefixer@10.0.0`，修复 default export 与 `overrideBrowserslist` 兼容；build / smoke 通过，audit 降至 `46`。
- **2026-04-29** — 移除 `gulp-cssnano`，改用 `gulp-postcss@10.0.0` + `cssnano@7.1.7`；CSS dist 产物生成正常，audit 降至 `11`，剩余全部来自 `gulp@4`。
- **2026-04-29** — 升级 `gulp@5.0.1`，发现并修复 `vinyl-fs@4` 默认 UTF-8 转码导致图片复制损坏的问题；为图片 copy task 设置 `{ encoding: false }`。
- **2026-04-29** — 移除 `del`，改用 Node 内置 `fs.rmSync` 清理 `dist`；最终 `npm audit` 为 `0`，`npm outdated` 为 `0`。
- **2026-04-29** — 本地合并到 `main` 后发现 `:8000` 仍由验证残留 PID `14083` 监听；风险记录后准备执行 `kill 14083`，再用自启动 server 重跑 smoke。

## Next action

等待集成 / review。命令和前置条件未变化，因此无需更新 README。

## Verification status

| Item | Status | Notes |
|------|--------|-------|
| Task classification | pass | 已确认这是独立 tracked task |
| Dependency baseline | pass | 已记录 audit / outdated 摘要 |
| Planning files created | pass | active task 三件套已创建 |
| Companion impl plan created | pass | 待用户 review |
| Isolated worktree | pass | `.worktrees/legacy-dependency-hardening` |
| Baseline build | pass | `./node_modules/.bin/gulp` 通过 |
| Baseline smoke | pass | 释放 `:8000` 后 `npm run uat:smoke` 通过 |
| Audit classification | pass | direct/transitive 与 fix availability 已分类 |
| Direct dependency upgrades | pass | 分层升级并逐层验证通过 |
| CSS minify replacement | pass | `gulp-cssnano` 已替换为 `gulp-postcss` + `cssnano` |
| Gulp 5 decision | pass | 剩余风险全部来自 Gulp 4 链，因此已升级到 Gulp 5 |
| Final audit | pass | `0` vulnerabilities |
| Final outdated | pass | `0` outdated dependencies |
| Final build | pass | `./node_modules/.bin/gulp` 通过 |
| Final smoke | pass | `npm run uat:smoke` 通过 |
| Generated asset sanity | pass | 抽样图片 copy 与源文件一致 |

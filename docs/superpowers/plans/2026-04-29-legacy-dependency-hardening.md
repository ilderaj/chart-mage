# ChartMage Legacy Dependency Hardening Implementation Plan

> 针对后续执行代理：先按 phase 逐层推进，每一层结束后必须重跑 build 与 smoke，再进入下一层。不要一次性升级所有依赖。

## Active Task Link

- Active task path: `planning/active/legacy-dependency-hardening/`
- Lifecycle state: `waiting_integration`
- Sync-back status: execution complete, results synced to active task files

## Execution Result

- Upgraded legacy direct build dependencies in slices.
- Replaced `gulp-cssnano` with `gulp-postcss` + `cssnano`.
- Upgraded `gulp` to `5.0.1` after evidence showed all remaining audit risk was in the Gulp 4 watcher/CLI chain.
- Removed `del` and replaced its single usage with Node `fs.rmSync`.
- Final result: `npm audit` reports `0` vulnerabilities and `npm outdated` reports `0` outdated dependencies.
- Final validation passed: `./node_modules/.bin/gulp`, `npm run uat:smoke`, and binary asset copy sanity checks.

## Goal

在不破坏当前静态站点、Gulp 构建链和 Maestro smoke 的前提下，收敛当前仓库的 legacy build-tooling 风险，优先降低高风险和结构性过时依赖，再决定是否继续追求更深层 modernization。

## Architecture

把本任务视为“构建链治理”而不是“单纯的 npm audit 修复”。执行顺序必须遵守：

1. 固定验证锚点
2. 处理可明确升级的 direct dependencies
3. 单独拆解 `gulp-cssnano` / 旧 PostCSS 生态
4. 最后再考虑低价值的广泛更新

任何一个 phase 都不得同时引入：
- 多个核心构建器大版本变更
- CSS minify 方案更换
- 额外的应用层 HTML / JS / CSS 行为改造

## Current Findings That Shape The Plan

- `npm audit --json` 当前为 `54` 个漏洞，其中 `13` 个为 high。
- 风险热点集中在 Gulp 生态和旧 PostCSS/CSS 压缩链，而不是产品运行时代码。
- `gulp` 当前为 `4.0.2`，最新已到 `5.0.1`。
- `gulp-autoprefixer` 当前为 `3.1.1`，最新已到 `10.0.0`，说明现有链明显跨代。
- `gulp-cssnano` 当前链没有直接可用的 audit fix，意味着后续可能需要替换构建组件，而非简单升级版本号。
- 当前仓库已经有两条稳定验证锚点：
  - `./node_modules/.bin/gulp`
  - `npm run uat:smoke`

## Scope

### In Scope

- `package.json` / `package-lock.json` 中 devDependencies 的安全与维护性治理
- `gulpfile.js` 的最小必要兼容改动
- old PostCSS / cssnano 生态的替换或升级设计
- 构建与 UAT 级别验证

### Out Of Scope

- 前端框架迁移
- redesign / UI polish
- Mermaid / CodeMirror 功能层改造
- 非依赖治理驱动的重构

## File Map

### Likely Modify

- `package.json`
- `package-lock.json`
- `gulpfile.js`
- `README.md`（仅在命令或构建步骤变化时）

### Likely Create

- 无强制新增代码文件
- 如需记录迁移说明，可新增轻量文档，但不是首选

## Execution Plan

### Phase 1: Freeze Baseline And Classify Risk

**Files:**
- Review `package.json`
- Review `package-lock.json`
- Review `gulpfile.js`

- [ ] 保存当前 `npm audit --json` 结果摘要，并按 direct / transitive 分类
- [ ] 标记哪些问题是 `fixAvailable: true` 且非 major，哪些需要 semver-major 升级
- [ ] 把漏洞分为三类：`must-fix now`, `tooling-modernization`, `deferable`
- [ ] 记录执行前的验证基线：`./node_modules/.bin/gulp`、`npm run uat:smoke`

**Exit criteria:**
- 有一份明确的升级顺序，不再靠 `npm audit fix` 盲跑

### Phase 2: Upgrade Direct Dependencies With Clear Paths

**Files:**
- Modify `package.json`
- Modify `package-lock.json`
- Modify `gulpfile.js` if required

- [ ] 优先处理 `gulp-autoprefixer`, `gulp-uglify`, `gulp-if`, `gulp-useref`, `browser-sync`, `del` 中升级路径清晰的 direct deps
- [ ] 每次只升级一组语义接近的包，避免把错误来源混在一起
- [ ] 若某个升级导致 `gulpfile.js` API 变化，只做最小必要修复
- [ ] 每组升级后运行 `npm install`, `./node_modules/.bin/gulp`, `npm run uat:smoke`

**Exit criteria:**
- direct dependency 风险明显下降，且 build / smoke 持续通过

### Phase 3: Replace Or Rework Legacy CSS Minify Chain

**Files:**
- Modify `package.json`
- Modify `package-lock.json`
- Modify `gulpfile.js`

- [ ] 评估是否继续保留 `gulp-cssnano`
- [ ] 如果 audit 仍无可用修复，选择维护中的 CSS 压缩替代方案
- [ ] 确保产出的 CSS 仍能被当前 `useref` 流程消费
- [ ] 对 `dist/` 关键 CSS 产物做最小人工检查，避免压缩器替换引发样式破坏

**Exit criteria:**
- `gulp-cssnano` 所代表的旧 `cssnano` / PostCSS 高噪音风险被消除或显著下降

### Phase 4: Re-assess Whether Gulp 5 Is Worth It

**Files:**
- Modify `package.json` only if approved by evidence
- Modify `gulpfile.js` only if required

- [ ] 在前几阶段完成后重新评估 `gulp@5.0.1` 的收益与风险
- [ ] 如果 remaining audit risk 的主要来源仍落在 `gulp@4` 链上，再考虑单独升级到 `gulp@5`
- [ ] 若 `gulp@4` 已满足“风险显著下降 + build/smoke 稳定”，则允许停留，不为追新而追新

**Exit criteria:**
- 对“是否升到 Gulp 5”有明确、可辩护的决策，而不是默认升级

### Phase 5: Final Verification And Documentation

**Files:**
- Modify `README.md` if commands or prerequisites changed
- Update planning files

- [ ] 运行最终验证：`npm audit`, `./node_modules/.bin/gulp`, `npm run uat:smoke`
- [ ] 记录 remaining vulnerabilities 与选择 defer 的理由
- [ ] 若命令或前置条件变化，更新 README
- [ ] 将结论同步回 active task planning files

**Exit criteria:**
- 用户能清楚看到：修了什么、还剩什么、为什么剩、验证是否通过

## Validation Strategy

- Security baseline: `npm audit --json`
- Build validation: `./node_modules/.bin/gulp`
- Behavior validation: `npm run uat:smoke`
- If CSS minifier changes: inspect generated `dist/` surfaces for obvious regressions

## Risks And Mitigations

- **Risk:** major dependency jumps can silently change Gulp plugin behavior.
  **Mitigation:** upgrade in narrow slices and rerun build/smoke after each slice.

- **Risk:** replacing `gulp-cssnano` can alter CSS output unexpectedly.
  **Mitigation:** treat CSS minification as its own phase with explicit output verification.

- **Risk:** chasing zero vulnerabilities may force low-value modernization work.
  **Mitigation:** stop when residual risk is understood, documented, and proportionate to the project.

## Approval Gate

本计划默认先做“依赖治理分层执行”，而不是直接运行全量 `npm audit fix`。如果用户批准执行，建议从 Phase 1 开始，逐 phase 提交验证结果。

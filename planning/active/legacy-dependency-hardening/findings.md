# Findings — Legacy Dependency Hardening

## 当前目标
- 以独立任务方式梳理并规划当前仓库的 dependency hardening 工作。
- 输出可 review 的 implementation plan，而不是立即实施升级。

## 已验证事实
- 项目当前为静态前端应用，核心运行依赖很轻，风险主要集中在 dev/build tooling。
- 当前构建链已经从旧的 `gulp@3` 调整到可运行的 `gulp@4` 语义，但依赖面仍明显老旧。
- `package.json` 当前 devDependencies 为：
  - `browser-sync@^2.17.5`
  - `del@^2.2.2`
  - `gulp@^4.0.2`
  - `gulp-autoprefixer@^3.1.1`
  - `gulp-cssnano@^2.1.2`
  - `gulp-if@^2.0.1`
  - `gulp-uglify@^2.0.0`
  - `gulp-useref@^3.1.6`
- `npm audit --json` 摘要：`54` vulnerabilities，分布为 `2 low / 39 moderate / 13 high / 0 critical`。
- `npm outdated --json` 摘要：
  - `browser-sync` 当前 `2.29.3`，最新 `3.0.4`
  - `del` 当前 `2.2.2`，最新 `8.0.1`
  - `gulp` 当前 `4.0.2`，最新 `5.0.1`
  - `gulp-autoprefixer` 当前 `3.1.1`，最新 `10.0.0`
  - `gulp-if` 当前 `2.0.2`，最新 `3.0.0`
  - `gulp-uglify` 当前 `2.1.2`，最新 `3.0.2`
  - `gulp-useref` 当前 `3.1.6`，最新 `5.0.0`

## 高风险热点
- `gulp` 通过 `glob-watcher` 带出高风险链，`npm audit` 已提示修复可落到 `gulp@5.0.1`（major）。
- `gulp-autoprefixer` 当前版本链带出 `gulp-util`、旧 `postcss`、旧 `autoprefixer` 风险，修复建议同样是 major upgrade。
- `gulp-cssnano` 绑定旧 `cssnano` 生态，当前 audit 显示 `fixAvailable: false`，说明大概率不是简单升 patch 能解决。
- 若继续依赖 `gulp-cssnano`，很可能需要改为新的 CSS 压缩方案而不是只做版本 bump。

## 任务约束
- 必须保住两个关键验证锚点：
  - `./node_modules/.bin/gulp`
  - `npm run uat:smoke`
- 不能把 dependency hardening 扩大成整体前端迁移。
- 应优先处理 direct dependency 和高风险 transitive 链，避免一开始就做低价值全量升级。

## 初步结论
- 这是一个“构建链治理”任务，不是纯粹的 `npm audit fix` 任务。
- 仅依赖 `npm audit fix` 很可能无法解决 `gulp-cssnano` / 旧 PostCSS 生态的结构性问题。
- 最合理的执行顺序是：
  1. 先冻结验证基线
  2. 再处理 `gulp` / `gulp-autoprefixer` 这类可明确升级路径的 direct deps
  3. 然后单独设计 CSS minify 旧链替代方案

## 待验证问题
- `gulp@5` 是否会引入新的 `gulpfile.js` 兼容调整需求。
- `gulp-autoprefixer@10` 对当前 `gulpfile.js` API 需要哪些最小改动。
- 替换 `gulp-cssnano` 的最小稳定方案是什么。

# Findings & Decisions

## Requirements
- 对齐 `app/intro.html` 与 `app/index.html` 到 `prototypes/redesign-v3/` 的视觉方向。
- 保留 intro 入口行为：`window.__chartMageIsMaestro`、GA 跳过、favicon、`js/maestro-observer.js`、`.start-drawing` 写入 `localStorage.visited`。
- 保留主功能页关键 legacy id、`spells` / `lastOpenID` storage key、本地 `mermaidAPI.min.js`、现有 UAT 文案与路由。
- 不修改 `prototypes/redesign-v3/` 素材，不提交 git commit，除非用户后续明确要求。

## Research Findings
- 当前 `app/intro.html` 仍是单屏卡片式 landing；缺少计划要求的 `.site-nav`、`.hero`、`#try-it`、`.features-section`、`.site-footer` 结构。
- 当前 `app/index.html` 已有部分 redesign 导航与 toolbar，但 `<main>` 还不是 `class="app-layout"`，也没有 `.mobile-gate`，HTML shell 未完全对齐计划。
- 当前 `app/css/landing.css` 仍依赖装饰性 radial-gradient 背景与旧 intro card 布局；当前 `app/css/main.css` 仍保留浮动导航、`min-width: 768px` 与渐变背景。
- `app/css/design-tokens.css` 已含多数 redesign 颜色 token，但仍缺 `--color-warn`、`--nav-h`、`--shadow-overlay`、`--color-editor-text`/syntax alias 等计划要求的 token。
- `app/js/app.js` 已绑定 `#show-charts-button`、`#new-chart-button`、`#current-chart-pill`、`#export-diagram`、`#show-syntax`，且继续使用 `spells` / `lastOpenID` 合约；桥接层只需最小调整。
- worktree 基线 `npm test` 已通过（10/10）；说明现有 JS 逻辑基线干净，可在此基础上做 TDD 递进。
- 新增 `tests/ui-alignment-contract.test.js` 后，红灯精确落在 `intro` 缺 `.site-nav`、`main` 缺 `.app-layout` / `.mobile-gate`、token 缺 `--color-warn` 等计划预期缺口上。

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| 将 long-form companion plan 保持在 `docs/superpowers/plans/...`，执行细节写回 `planning/active/...` | 符合 planning-with-files 的 companion-plan patch |
| 先做 Node 静态 contract tests，再重构 intro/main | UI 重构范围大，先锁 contract 能减少 selector 与文案回归 |
| 主功能页保留现有库链路（jQuery/CodeMirror/mermaidAPI） | plan 明确要求仅做 selector bridge，不引入 prototype 的新运行时 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| `scripts/harness worktree-name` 在此仓库没有可用输出 | 手动采用任务 id `intro-main-ui-alignment` 作为 worktree/branch 名称 |
| 新 contract tests 失败 | 属于预期红灯，不是基线回归；作为后续改造护栏继续推进 |

## Destructive Operations Log
| Command | Target | Checkpoint | Rollback |
|---------|--------|------------|----------|
| 无 | - | - | - |

## Resources
- Companion plan: `docs/superpowers/plans/2026-05-05-intro-main-ui-alignment.md`
- Worktree root: `/Users/jared/Vibings/ChartMage/.worktrees/intro-main-ui-alignment`
- Design reference: `prototypes/redesign-v3/index.html`
- Design reference: `prototypes/redesign-v3/app.html`
- Existing smoke runner: `scripts/run-maestro-web-smoke.sh`

## Visual/Browser Findings
- `prototypes/redesign-v3/index.html` 明确采用 `site-nav` + `hero` + `try-it-section` + `features-section` + `site-footer` 结构，intro live demo 是真正可编辑的左右分栏 editor shell。
- `prototypes/redesign-v3/app.html` 明确采用固定 52px nav、全视口 split editor、drawer overlay 与 mobile gate；生产页需要映射这些视觉角色，但保持现有 DOM id。

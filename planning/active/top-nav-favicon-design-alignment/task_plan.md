# Top Nav And Favicon Design Alignment Plan

## Current State
Status: waiting_review
Archive Eligible: no
Close Reason:

## Goal
全面检视 ChartMage 当前编辑器顶栏、favicon、设计规格与 Maestro 覆盖，制定严格对齐新设计的实施方案；本轮只输出计划供 review，不改业务代码。

## Scope
- 对齐编辑器顶栏到设计稿中的单一浮动玻璃栏：brand lockup、chart pill/rename trigger、save state、search、My Charts、Help、Export、primary New action。
- 对齐 favicon 与浏览器标签页表现，覆盖 `index.html`、`intro.html`、`browser.html` 以及对应图标资产。
- 更新规格文档与 Maestro/UAT cases，让设计约束可回归验证。
- 使用 subagents 做分域审查，并设置交叉检查环节，避免实现、spec、UAT 各自漂移。

## Non-Goals
- 本轮不执行代码修改。
- 不重构 Mermaid/CodeMirror 核心逻辑。
- 不变更部署路径；当前部署仍以 Cloudflare Worker 静态资产为准。

## Design/Implementation Gap Matrix

| Requirement | Current State | Target | Verification |
|---|---|---|---|
| Floating glass editor nav | `app/css/main.css` makes `.app-nav` full-width, 78px tall, attached to viewport top with bottom rule | One visually detached, rounded glass bar with constrained width and workspace gap, matching `prototypes/redesign-v2/index.html` top nav anatomy | Playwright screenshot desktop; CSS inspection for radius/shadow/backdrop; Maestro visible assertions |
| Brand lockup | CSS-built `.brand-mark` and lowercase `chartmage` wordmark in editor; intro uses separate inline `cm-mark` sprite | 28px brand mark, `ChartMage` wordmark, consistent mark geometry between nav, splash, intro, favicon | Screenshot comparison; inspect shared CSS/SVG values |
| Chart pill rename trigger | Chart name/type displayed in non-interactive `.nav-chart-pill`; rename only exists in drawer rows | Chart pill is a button with current type/name/caret and opens existing rename modal for current chart | Maestro taps `current-chart-pill`, renames, asserts nav/file frame update |
| Save state | `#save-state-pill` says `Saved locally`; workspace header duplicates status | Keep visible compact state in nav: dot + `Saved locally` or spec-approved copy; update alongside workspace status | Maestro assert visible; JS unit-by-behavior via browser interaction |
| Cmd-K search | No top-nav search; drawer search exists only after opening My Charts | Add nav search input with visible `Search charts` and shortcut hint; focus with Cmd-K; route query to drawer search/results | Maestro tap/search path; Playwright keyboard shortcut check |
| My Charts | `#show-charts-button` exists and opens drawer | Keep same id/behavior; restyle as text+icon nav action | Existing flows plus nav-specific flow |
| Help | `#show-syntax` is icon-only | Text+icon `Help` action opens existing syntax modal based on current chart type | New Maestro `web-nav-actions.yaml` |
| Export | `#export-diagram` is icon-only; preview footer also has `.export-trigger` | Text+icon `Export` action keeps existing export handler | Maestro entry-point assertion; manual/download limitation noted |
| Primary new action | Two nav buttons: `New Sequence Diagram` and `New Flowchart` | One primary `+ New chart` action; preserve old modal ids via a picker or delegated buttons | Updated smoke/create-sequence flows |
| Favicon | `favicon.svg` is new mark; `favicon.png` is old black arrow; `browser.html` only references PNG | SVG and PNG fallback show the same new brand mark; all HTML entrypoints use consistent icon links | Browser tab screenshot; file/asset inspection; HTML grep |

## Implementation Plan For Review

### Phase 1: Spec And Acceptance Criteria
Status: waiting_review

Files to modify after approval:
- `DESIGN.md`
- `.maestro/README.md`
- `backlogs/maestro-coverage.md`
- `planning/active/top-nav-favicon-design-alignment/{task_plan.md,findings.md,progress.md}`

Steps:
- Add a ChartMage editor top-nav spec under the adoption notes in `DESIGN.md`: one floating rounded glass bar, 28px brand lockup, chart pill rename trigger, save state, Cmd-K search, My Charts, Help, Export, and one primary `+ New chart` CTA.
- Add favicon identity acceptance criteria: `favicon.svg` is the source visual, `favicon.png` is a matching fallback, and `index.html`, `intro.html`, and `browser.html` all declare the same icon set.
- Update `.maestro/README.md` to list the new nav/fav flows and clarify which visual checks require Playwright/manual screenshot because Maestro cannot inspect browser tab favicon pixels or `backdrop-filter` quality.
- Update `backlogs/maestro-coverage.md`: add rows for editor top-nav anatomy, chart pill rename, Cmd-K nav search, top-nav action continuity, favicon entrypoint consistency; mark them `missing` before implementation and `covered` only after flows are added to the standard command or documented suite.

Acceptance gate:
- Every design requirement in the gap matrix maps to one spec line and one verification path.

### Phase 2: Favicon And Brand Asset Alignment
Status: waiting_review

Files to modify after approval:
- `app/images/favicon.svg`
- `app/images/favicon.png`
- `app/index.html`
- `app/intro.html`
- `app/browser.html`
- Generated `dist/` assets only through `npm run build`, if `dist/` is tracked in the checkout.

Steps:
- Treat `app/images/favicon.svg` as the visual source. Keep or refine it only if the design review finds mismatch with the current brand mark geometry.
- Replace `app/images/favicon.png` with a PNG fallback generated from the SVG; this is required because the current PNG is the old black arrow shown in the browser tab screenshot.
- Normalize all three HTML entrypoints to include SVG first and PNG fallback second, with explicit type metadata.
- Add an `apple-touch-icon` only if the generated PNG is suitable at the chosen size; otherwise keep favicon scope narrow and document touch-icon as out of scope.

Acceptance gate:
- Browser tab no longer shows the old black arrow after cache-clear or querystring refresh.
- Grep finds no HTML entrypoint that references only `images/favicon.png`.

### Phase 3: Editor Top Nav DOM And Behavior
Status: waiting_review

Files to modify after approval:
- `app/index.html`
- `app/js/app.js`

Steps:
- Restructure `<nav class="app-nav">` into three logical regions matching the prototype: left brand/chart state, center search, right actions.
- Preserve existing behavior ids: `show-charts-button`, `show-syntax`, `export-diagram`, `new-flowchart-button`, `current-chart-name`, `current-chart-type`, `save-state-pill`.
- Add `current-chart-pill` as a real button and also bind it into the existing rename path by setting `data-chart-id` and `data-chart-name` in `updateShellMeta()`.
- Add `nav-search-input`; clicking or Cmd-K opens the drawer, mirrors the value into `drawer-search`, and calls existing `renderChartsCollections()` so search behavior remains single-sourced.
- Replace the two visible nav creation buttons with one visible `+ New chart` CTA. Preferred implementation: open a small `new-chart-picker` modal/popover with Flowchart and Sequence choices that delegate to existing `#newFlowchart` and `#newSequenceDiagram`; fallback if scope must stay smaller: primary CTA opens existing flowchart modal while a sequence path remains available inside the picker. The final implementation must keep `new-flowchart-button` and `new-sequence-diagram-button` available as stable ids, even if one is nested in the picker instead of the main bar.
- Keep About and mail links out of the primary top nav unless a spec update explicitly says they remain top-level; current design only calls for Help and Export.

Acceptance gate:
- Existing create flowchart, create sequence, drawer, rename, delete, syntax help, and export entry behavior still works.
- Chart pill rename updates `#current-chart-name`, `#workspace-file-name`, and drawer row text.

### Phase 4: Editor Top Nav CSS Alignment
Status: waiting_review

Files to modify after approval:
- `app/css/design-tokens.css`
- `app/css/main.css`

Steps:
- Add or reuse tokens for nav glass surface, compact nav shadow, brand mark gradient, nav item hover, and search input border.
- Change `.app-nav` from attached full-width header to a visually detached rounded bar: constrained max width, margin/gap from viewport and workspace, 4px-8px radius, white translucent background, blue-tinted shadow, backdrop blur.
- Adjust `main` top offset/padding so the workspace sits below the floating bar without overlap at the repo's current `min-width: 768px` constraint.
- Style `.chart-pill`, `.nav-search`, `.nav-btn`, `.save-state`, and primary CTA to match prototype proportions while staying within `DESIGN.md` radius and color rules.
- Keep text inside buttons from wrapping awkwardly; long chart names truncate inside the chart pill only.
- Add focus-visible states for chart pill, nav search, and all nav actions using existing `--focus-ring`.

Acceptance gate:
- Desktop screenshot resembles prototype: one rounded glass bar, no separate `Current chart` caption, no separate visible `New Sequence Diagram` and `New Flowchart` buttons.
- Long chart name does not resize the nav or overlap actions.

### Phase 5: Maestro And Visual Regression Coverage
Status: waiting_review

Files to modify after approval:
- `.maestro/flows/web-smoke.yaml`
- `.maestro/flows/web-create-sequence.yaml`
- `.maestro/flows/web-rename-chart.yaml`
- `.maestro/flows/web-delete-chart.yaml`
- New `.maestro/flows/web-top-nav-alignment.yaml`
- New `.maestro/flows/web-nav-search.yaml`
- New `.maestro/flows/web-chart-pill-rename.yaml`
- New `.maestro/flows/web-favicon-entrypoints.yaml` if Maestro can reliably inspect page source/DOM links; otherwise document this as Playwright-only.
- `scripts/run-maestro-web-smoke.sh`
- `package.json`

Steps:
- Update existing create flows so they use the new single `+ New chart` surface while still selecting Flowchart/Sequence deterministically.
- Add `web-top-nav-alignment.yaml` assertions: `ChartMage`, `Sample sequence diagram`, `Saved locally`, `Search charts`, `My Charts`, `Help`, `Export`, `New chart` are visible on first editor load.
- Add `web-nav-search.yaml`: create/search/filter through nav search, assert drawer results and empty state.
- Add `web-chart-pill-rename.yaml`: tap chart pill, rename current chart, assert nav and workspace file name update.
- Add or document a favicon check. Maestro likely cannot validate tab favicon pixels, so use Playwright/browser screenshot as the strict visual check and reserve Maestro for HTML entrypoint reachability.
- Update runner from one hardcoded flow to either a documented suite list or an optional flow argument that runs all standard flows. The standard `npm run uat:smoke` should cover every flow marked `covered` in `backlogs/maestro-coverage.md`.

Acceptance gate:
- `npm run uat:smoke` passes after implementation and includes the updated/new nav flows.
- Any visual-only assertions not covered by Maestro are explicitly listed with a screenshot verification command/checklist.

### Phase 6: Build, Browser Verification, And Cross-Agent Review
Status: waiting_review

Verification commands after approval and implementation:
- `npm run build`
- Start/reuse local server: `python3 -m http.server 8000 --directory app`
- `npm run uat:smoke`
- Playwright/browser checks at desktop width and the repo's minimum width edge: nav shape, no overlap, drawer/search, favicon tab rendering.

Cross-agent protocol:
- Design/spec subagent reviews implemented UI against `DESIGN.md` and `prototypes/redesign-v2/index.html`, then explicitly signs off or lists mismatches.
- Implementation subagent reviews changed DOM/CSS/JS/assets, especially preserved ids, event bindings, long-name overflow, and generated asset consistency.
- UAT subagent reviews Maestro flows, runner coverage, and any visual/manual gaps.
- Cross-check requirement: each subagent must read the other two summaries and identify contradictions. Main agent only marks the task complete after contradictions are resolved in planning files and verification reruns pass.

Acceptance gate:
- Planning files contain final decisions, verification results, and any known non-automated visual checks.
- No spec row is marked covered without an actual flow or documented Playwright/manual fallback.

## Decisions
- 使用新 task id `top-nav-favicon-design-alignment`，不复用 `cloudflare-pages-deploy`，避免部署任务与设计对齐任务混杂。
- 当前任务状态为 `waiting_review`，因为用户要求先分析并输出 implementation plan。

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|

## Open Questions
- 新 favicon 的目标源是否就是设计稿截图中的紫色渐变节点图标，还是已有 `app/images/favicon.svg` 应进一步更新？需要检视资产后给出建议。
- 顶栏中的 search 是否已有隐藏/未实现入口，还是需要新增前端搜索行为？需要检视 `app/js/app.js` 后确定。
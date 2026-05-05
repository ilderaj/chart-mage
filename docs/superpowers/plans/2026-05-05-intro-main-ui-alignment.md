# Intro And Main UI Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将生产 `app/intro.html` 与 `app/index.html` 对齐到设计师提供的 `prototypes/redesign-v3/index.html` 和 `prototypes/redesign-v3/app.html` 视觉方向，同时保留现有静态应用的存储、编辑、渲染、导出和 Maestro UAT 合约。

**Architecture:** 采用渐进式移植，不复制 prototype 的整套运行时。`app/css/design-tokens.css` 继续作为共享 token 层，`app/css/landing.css` 负责 intro，`app/css/main.css` 负责主功能页；`app/js/app.js` 只做必要桥接，继续使用现有 jQuery、CodeMirror、`mermaidAPI.min.js`、localStorage schema 和 UAT selector。

**Tech Stack:** Static HTML/CSS/JS, jQuery, CodeMirror, Mermaid legacy `mermaidAPI`, Node built-in test runner, Gulp build, Maestro web flows.

---

Active task path: `planning/active/intro-main-ui-alignment/`
Lifecycle state: `waiting_review`
Sync-back status: companion plan written and synced

## 审阅假设

- “intro” 指生产入口页 `app/intro.html` 与 `app/css/landing.css`。
- “主功能页” 指生产编辑器 `app/index.html`、`app/css/main.css`、必要的 `app/js/app.js` 小改。
- `prototypes/redesign-v3/` 是设计参考和用户侧素材，执行时不得修改、移动、压缩或清理。
- `browser.html` 不纳入 UI 对齐范围，只在 favicon 和 smoke 中做不回归检查。
- 不提交 git commit，除非用户在 review 后明确要求。

## 不能破坏的合约

- App route 保持 `app/index.html`，prototype 中所有 `app.html` 链接在生产页中必须映射为 `index.html`。
- Intro 继续保留 `window.__chartMageIsMaestro`、Google Analytics 跳过逻辑、favicon 链接、`js/maestro-observer.js`、`.start-drawing` 写入 `localStorage.visited`。
- 主功能页继续保留这些 id：`code`、`chart`、`current-chart-pill`、`current-chart-name`、`current-chart-type`、`save-state-pill`、`show-charts-button`、`show-syntax`、`export-diagram`、`new-chart-button`、`new-chart-picker`、`charts-drawer`、`drawer-backdrop`、`drawer-search`、`drawer-list`、`drawer-count`。
- `app/js/app.js` 继续使用 `spells` 和 `lastOpenID` localStorage keys，不引入 prototype 的 `cm_charts` 或 `cm_active_id`。
- Mermaid 继续使用本地 `app/js/lib/mermaidAPI.min.js`，不得在生产 `app/` 页面引入 `https://cdn.jsdelivr.net/npm/mermaid@10`。
- 现有 UAT 可见文案仍需存在或可被新版等价路径覆盖：`Sample sequence diagram`、`Sample flowchart`、`New chart`、`My Charts`、`Help`、`Export`、`Diagram Input`、`Live Preview`、`Maestro Smoke Flow`。

## 文件结构

- Modify: `app/css/design-tokens.css` - 补齐 redesign-v3 需要的 token，保留现有 token 名称。
- Modify: `app/intro.html` - 移植 redesign-v3 landing 的 nav、hero、live demo、features、footer 结构。
- Modify: `app/css/landing.css` - 将 intro 样式从单屏卡片收敛为 redesign-v3 landing 页面风格。
- Modify: `app/index.html` - 将主功能页 shell 对齐到 redesign-v3 app 的固定 nav、split editor、drawer、modal、mobile gate 语言，同时保留 legacy ids。
- Modify: `app/css/main.css` - 将现有浮动 dashboard 风格重塑为全视口编辑器 UI。
- Modify: `app/js/app.js` - 只做 selector 桥接、mobile gate、状态同步小改。
- Create: `tests/ui-alignment-contract.test.js` - 静态 UI 合约测试。
- Create: `.maestro/flows/web-intro-ui-alignment.yaml` - intro 入口和跳转 UAT。
- Modify: `scripts/run-maestro-web-smoke.sh` - 将新 intro flow 加入默认 smoke 列表。

## Task 1: 写静态 UI 合约测试

**Files:**
- Create: `tests/ui-alignment-contract.test.js`

- [ ] **Step 1: Add failing static contract tests**

```js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assertIncludes(source, needle, label) {
  assert.ok(source.includes(needle), `${label} should include ${needle}`);
}

test("intro uses redesigned landing structure while preserving entry gates", () => {
  const html = read("app/intro.html");
  assertIncludes(html, "class=\"site-nav\"", "intro nav");
  assertIncludes(html, "class=\"hero\"", "intro hero");
  assertIncludes(html, "id=\"try-it\"", "intro live demo anchor");
  assertIncludes(html, "id=\"landing-textarea\"", "intro demo textarea");
  assertIncludes(html, "id=\"landing-canvas\"", "intro demo canvas");
  assertIncludes(html, "class=\"features-section\"", "intro feature band");
  assertIncludes(html, "class=\"site-footer\"", "intro footer");
  assertIncludes(html, "window.__chartMageIsMaestro", "maestro flag");
  assertIncludes(html, "localStorage.setItem(\"visited\"", "visited gate");
  assertIncludes(html, "js/maestro-observer.js", "maestro observer");
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/mermaid/i, "intro should not use CDN Mermaid");
  assert.doesNotMatch(html, /href=\"app\.html\"/, "production intro links should target index.html");
});

test("main app keeps legacy behavior selectors and adopts redesigned shell selectors", () => {
  const html = read("app/index.html");
  [
    "id=\"code\"",
    "id=\"chart\"",
    "id=\"current-chart-pill\"",
    "id=\"current-chart-name\"",
    "id=\"current-chart-type\"",
    "id=\"save-state-pill\"",
    "id=\"show-charts-button\"",
    "id=\"show-syntax\"",
    "id=\"export-diagram\"",
    "id=\"new-chart-button\"",
    "id=\"new-chart-picker\"",
    "id=\"charts-drawer\"",
    "id=\"drawer-backdrop\"",
    "id=\"drawer-search\"",
    "id=\"drawer-list\"",
    "id=\"drawer-count\""
  ].forEach((selector) => assertIncludes(html, selector, "main app selector contract"));

  assertIncludes(html, "class=\"app-layout", "redesigned app layout");
  assertIncludes(html, "class=\"editor-grid", "editor grid");
  assertIncludes(html, "class=\"mobile-gate", "mobile gate");
  assert.doesNotMatch(html, /id=\"btn-my-charts\"|id=\"btn-help\"|id=\"btn-export\"|id=\"btn-new\"/, "prototype-only ids should not replace legacy ids");
});

test("main app JavaScript continues to use the existing storage and rendering contracts", () => {
  const js = read("app/js/app.js");
  assertIncludes(js, "localStorage.setItem(\"spells\"", "legacy chart storage");
  assertIncludes(js, "localStorage.setItem(\"lastOpenID\"", "legacy active chart storage");
  assertIncludes(js, "mermaidAPI.render('graphDiv'", "legacy Mermaid render path");
  assertIncludes(js, "#show-charts-button", "charts drawer handler");
  assertIncludes(js, "#new-chart-button", "new chart handler");
  assert.doesNotMatch(js, /cm_charts|cm_active_id|mermaid\.initialize|document\.getElementById\('btn-new'\)/, "prototype runtime should not be copied into app.js");
});

test("CSS consumes shared tokens and avoids prototype-only one-off palettes", () => {
  const tokens = read("app/css/design-tokens.css");
  const landingCss = read("app/css/landing.css");
  const mainCss = read("app/css/main.css");

  ["--color-warn", "--nav-h", "--color-canvas-bg", "--color-editor-gutter", "--shadow-elevated"].forEach((token) => {
    assertIncludes(tokens, token, "shared token");
  });

  assertIncludes(landingCss, "var(--color-bg)", "landing token usage");
  assertIncludes(landingCss, ".site-nav", "landing nav styles");
  assertIncludes(landingCss, ".editor-shell", "landing live demo styles");
  assertIncludes(mainCss, "var(--nav-h)", "main nav height token");
  assertIncludes(mainCss, ".drawer.open", "drawer open state");
  assertIncludes(mainCss, ".modal-overlay.open", "modal open state");
  assert.doesNotMatch(`${landingCss}\n${mainCss}`, /radial-gradient\([^)]*(top left|top right|circle at)/i, "background should not rely on decorative gradient orbs");
});
```

- [ ] **Step 2: Run the new tests and confirm they fail for the right reason**

Run: `npm test`

Expected before implementation: FAIL in `tests/ui-alignment-contract.test.js` because production intro/main do not yet expose the redesigned selectors.

## Task 2: 补齐共享 design tokens

**Files:**
- Modify: `app/css/design-tokens.css`

- [ ] **Step 1: Add only missing redesign-v3 tokens without renaming existing tokens**

Add these variables inside `:root` next to related colors and layout tokens:

```css
--color-warn: #f59e0b;
--color-overlay-soft: rgba(6, 27, 49, 0.35);
--shadow-overlay: rgba(6, 27, 49, 0.35) 0 0 0 100vmax;
--nav-h: 52px;
--app-shell-gap: 0px;
```

If an equivalent token already exists, keep the existing name and add an alias rather than rewriting all consumers.

- [ ] **Step 2: Normalize logo and editor primitive tokens**

Ensure existing tokens cover the prototype names used by both pages:

```css
--color-editor-text: var(--color-text-muted);
--color-syn-kw: var(--color-syntax-keyword);
--color-syn-str: var(--color-syntax-string);
--color-syn-arr: var(--color-syntax-arrow);
--color-syn-cmt: var(--color-syntax-comment);
```

- [ ] **Step 3: Run contract tests**

Run: `npm test`

Expected: token-related assertions PASS; intro/main structure assertions still FAIL until later tasks.

## Task 3: 对齐 intro 页面结构

**Files:**
- Modify: `app/intro.html`
- Modify: `app/css/landing.css`

- [ ] **Step 1: Replace intro body structure with production-safe redesign-v3 landing structure**

Use `prototypes/redesign-v3/index.html` as visual source, with these production edits:

- Keep existing `<head>` analytics, favicon, and build comments.
- Keep stylesheet pipeline as `normalize.css`, `design-tokens.css`, `landing.css`.
- Do not add CDN Mermaid.
- Change every prototype `href="app.html"` to `href="index.html"`.
- Keep all editor-opening anchors carrying `class="start-drawing"` so the existing visited gate remains intact.
- Use visible sections: `.site-nav`, `.hero`, `#try-it.try-it-section`, `.features-section`, `.site-footer`.
- Preserve product copy from prototype unless it conflicts with local-first or route behavior.

- [ ] **Step 2: Add intro live demo DOM using stable selectors**

The live demo must include:

```html
<textarea id="landing-textarea" class="code-textarea" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" aria-label="Mermaid diagram code">sequenceDiagram
  Alice->>Bob: Hi Bob
  Bob-->>Alice: Hi Alice
  Alice->>Bob: How are you?
  Bob-->>Alice: I'm good
  Note over Alice,Bob: handshake complete</textarea>
<div class="canvas-stage" id="landing-canvas" aria-label="Rendered diagram"></div>
```

- [ ] **Step 3: Rebuild `landing.css` around redesign-v3 sections**

Required style outcomes:

- `.site-nav` sticky, 56px tall, white glass background, bottom border.
- `.hero` centered, max-width 1080px, responsive H1 using `clamp(38px, 5.5vw, 60px)`.
- `.try-it-section` full-width band using `var(--color-bg)`, not a floating outer card.
- `.editor-shell` only frames the live demo itself, max-width 960px, border radius 12px.
- `.features-grid` three columns on desktop, one column below 720px.
- No decorative gradient orb backgrounds.
- Mobile widths below 500px hide `.nav-links` and keep CTA text fitting.

- [ ] **Step 4: Preserve the visited gate script**

Keep this behavior at the bottom of `app/intro.html`:

```js
Array.prototype.forEach.call(document.querySelectorAll(".start-drawing"), function(link) {
  link.addEventListener("click", function() {
    localStorage.setItem("visited", Date.now());
  });
});
```

## Task 4: Implement intro live demo with local Mermaid API

**Files:**
- Modify: `app/intro.html`

- [ ] **Step 1: Load the existing Mermaid library locally**

Add before the intro demo script:

```html
<script src="js/lib/mermaidAPI.min.js"></script>
```

- [ ] **Step 2: Add a scoped intro render script**

```js
(function() {
  var textarea = document.getElementById("landing-textarea");
  var canvas = document.getElementById("landing-canvas");
  var gutter = document.getElementById("landing-gutter");
  var status = document.getElementById("landing-status");
  var renderStatus = document.getElementById("landing-render-status");
  var renderTime = document.getElementById("landing-render-time");
  var lineCount = document.getElementById("landing-line-count");
  var chartLabel = document.getElementById("landing-chart-label");
  var timer = null;
  var counter = 0;

  if (!textarea || !canvas || !window.mermaidAPI) return;

  mermaidAPI.initialize({
    startOnLoad: false,
    cloneCssStyles: true,
    flowchart: { useMaxWidth: true },
    sequenceDiagram: { useMaxWidth: true, actorMargin: 80 }
  });

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function detectType(code) {
    var text = code.trim().toLowerCase();
    if (text.indexOf("sequencediagram") === 0) return "sequence";
    if (text.indexOf("graph") === 0 || text.indexOf("flowchart") === 0) return "flow";
    return "diagram";
  }

  function updateGutter() {
    var lines = textarea.value.split("\n");
    if (gutter) {
      gutter.innerHTML = lines.map(function(_, index) {
        return "<span>" + (index + 1) + "</span>";
      }).join("");
    }
    if (lineCount) {
      lineCount.textContent = lines.length + (lines.length === 1 ? " line" : " lines");
    }
  }

  function render() {
    var code = textarea.value.trim();
    if (!code) {
      canvas.innerHTML = "";
      return;
    }

    var started = performance.now();
    counter += 1;

    try {
      mermaidAPI.parse(code);
      mermaidAPI.render("landing-diag-" + counter, code, function(svg) {
        canvas.innerHTML = svg;
        var svgElement = canvas.querySelector("svg");
        if (svgElement) {
          svgElement.style.maxWidth = "90%";
          svgElement.style.maxHeight = "90%";
        }
        var elapsed = Math.round(performance.now() - started);
        if (renderTime) renderTime.textContent = elapsed + " ms";
        if (status) status.textContent = "● rendered";
        if (renderStatus) renderStatus.textContent = "● rendered";
        if (chartLabel) chartLabel.textContent = detectType(code) + " · demo";
      });
    } catch (error) {
      canvas.innerHTML = "<div class=\"demo-error\">" + escapeHtml(error.message || error) + "</div>";
      if (status) status.textContent = "● parse error";
      if (renderStatus) renderStatus.textContent = "● parse error";
      if (renderTime) renderTime.textContent = "— ms";
    }
  }

  function scheduleRender() {
    clearTimeout(timer);
    timer = setTimeout(render, 380);
  }

  textarea.addEventListener("input", function() {
    updateGutter();
    scheduleRender();
  });

  textarea.addEventListener("scroll", function() {
    if (gutter) gutter.scrollTop = textarea.scrollTop;
  });

  textarea.addEventListener("keydown", function(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      var start = textarea.selectionStart;
      var value = textarea.value;
      textarea.value = value.slice(0, start) + "  " + value.slice(textarea.selectionEnd);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      updateGutter();
      scheduleRender();
    }
  });

  updateGutter();
  render();
})();
```

- [ ] **Step 3: Run tests**

Run: `npm test`

Expected: intro structural tests PASS; main app tests may still FAIL.

## Task 5: 对齐主功能页 HTML shell

**Files:**
- Modify: `app/index.html`

- [ ] **Step 1: Replace visual shell, not legacy runtime contracts**

Use `prototypes/redesign-v3/app.html` as visual source, but map prototype ids to existing ids:

| Visual role | Prototype id | Production id to keep |
|---|---|---|
| Chart pill | `chart-pill-btn` | `current-chart-pill` |
| Chart name | `pill-name` | `current-chart-name` |
| Chart type | `chart-type-label` | `current-chart-type` |
| Save state | `save-state` | `save-state-pill` |
| My Charts | `btn-my-charts` | `show-charts-button` |
| Help | `btn-help` | `show-syntax` |
| Export | `btn-export` | `export-diagram` |
| New chart | `btn-new` | `new-chart-button` |
| Drawer | `drawer` | `charts-drawer` |
| Drawer overlay | `drawer-overlay` | `drawer-backdrop` |
| Editor textarea | `code-textarea` | `code` |
| Preview canvas | `canvas-stage` | `chart` |

- [ ] **Step 2: Adopt fixed app layout structure**

The production page should include these classes while keeping legacy ids:

```html
<nav class="app-nav hidden" role="navigation" aria-label="App navigation">...</nav>
<main role="main" class="app-layout hidden">
  <div class="editor-shell">
    <div class="editor-grid" id="editor-grid">
      <section class="editor-pane" role="region" aria-label="Diagram code input">...</section>
      <div class="editor-resizer" id="editor-resizer" aria-hidden="true" role="separator" aria-orientation="vertical"></div>
      <section class="preview-pane" role="region" aria-label="Diagram preview">...</section>
    </div>
  </div>
</main>
```

- [ ] **Step 3: Preserve CodeMirror mount point**

The editor pane must still contain exactly one textarea:

```html
<textarea id="code" name="code"></textarea>
```

Do not replace CodeMirror with the prototype plain `<textarea>` runtime.

- [ ] **Step 4: Preserve modal ids and create flow**

Keep existing modal ids: `new-chart-picker`, `newFlowchart`, `newSequenceDiagram`, `rename-chart-modal`, `flowchart-syntax`, `sequence-diagram-syntax`, `can-not-export-flowchart`, `can-not-export-seq`.

Restyle their internal markup only where needed. Do not remove the `rel="modal:open"` flow used by `jquery.modal.min.js`.

- [ ] **Step 5: Add mobile gate markup**

Add a `.mobile-gate` section matching redesign-v3 copy, with `href="intro.html"` for the back link. This is the only intentional behavior change proposed for mobile: the app can show a desktop-only notice instead of bouncing every small viewport back through intro.

## Task 6: 对齐主功能页 CSS

**Files:**
- Modify: `app/css/main.css`

- [ ] **Step 1: Convert app shell to full viewport layout**

Required outcomes:

- `html, body` keep `height: 100%` but remove `min-width: 768px`.
- `body` background uses `var(--color-bg)` without decorative radial gradients.
- `.app-nav` becomes fixed top, `height: var(--nav-h)`, full width, 1px bottom border, no floating outer card.
- `.app-layout` is fixed from `top: var(--nav-h)` to bottom and contains the editor split.
- `.editor-shell` fills available space and is not a decorative card.
- `.editor-grid` uses `grid-template-columns: 1fr 4px 1fr` and fills height.

- [ ] **Step 2: Align editor and preview primitives**

- `.editor-pane` and `.preview-pane` are un-nested surfaces inside the split grid.
- `.pane-header` is 44px tall, compact, tokenized, and consistent between intro and app.
- CodeMirror surfaces consume `--color-editor-bg`, `--color-editor-gutter`, `--color-heading`, and `--font-mono`.
- Preview `.chart` is centered on a dotted canvas using `--color-canvas-grid`.
- Existing `.preview-chip`, `.export-trigger`, and CodeMirror hint styles remain usable.

- [ ] **Step 3: Align drawer, modals, and buttons**

- `.workspaceBackdrop` may be renamed visually through CSS, but `#drawer-backdrop` remains the DOM id.
- `#charts-drawer` slides from the right with `.hidden` as the closed state.
- Modal styling uses `.modal`, `.modal-headline`, `.modal-text`, `.new-chart-picker-options`, and existing `jquery.modal` generated wrappers.
- Buttons use 5px to 7px radii, not oversized pills, except search/count metadata where pill shape is semantically useful.

- [ ] **Step 4: Implement mobile gate CSS**

At `max-width: 767px`:

```css
.mobile-gate { display: flex; }
.app-layout,
.app-nav { display: none; }
```

The mobile gate text must fit at 320px width without horizontal scrolling.

## Task 7: Minimal JavaScript bridge updates

**Files:**
- Modify: `app/js/app.js`
- Modify: `app/index.html`

- [ ] **Step 1: Keep current handler ids stable**

Do not rename existing handlers in `app/js/app.js`. The following handlers must still bind:

```js
$("#show-charts-button").click(...);
$("#new-chart-button").click(...);
$("#current-chart-pill").click(...);
$(document).on("click", "#export-diagram, .export-trigger", ...);
$("#show-syntax").click(...);
```

- [ ] **Step 2: Update mobile redirect gate**

Change the early redirect logic from a hard small-viewport redirect to a first-visit desktop gate:

```js
if (!isMaestroAutomation && !localStorage.getItem("visited"))
  window.location.replace("intro.html");
if (/*@cc_on!@*/false || !!document.documentMode)
  window.location.replace("browser.html");
```

The `.mobile-gate` CSS handles small viewports after the page loads.

- [ ] **Step 3: Keep shell metadata sync intact**

If markup changes introduce new labels, update `updateShellMeta()` only by adding selectors, not replacing existing ones. Existing selectors remain source of truth:

```js
$("#current-chart-name").text(chartName);
$("#current-chart-type").text(chartType);
$("#save-state-pill").text("Saved locally");
```

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: all Node tests PASS.

## Task 8: Add intro UAT flow

**Files:**
- Create: `.maestro/flows/web-intro-ui-alignment.yaml`
- Modify: `scripts/run-maestro-web-smoke.sh`

- [ ] **Step 1: Add Maestro intro flow**

```yaml
url: http://127.0.0.1:8000/intro.html?maestro=1
---
- openLink: http://127.0.0.1:8000/intro.html?maestro=1
- assertVisible: "ChartMage"
- assertVisible: "Beautiful diagrams from"
- assertVisible: "Open editor"
- assertVisible: "Live demo"
- assertVisible: "Diagram Input"
- assertVisible: "Live Preview"
- tapOn: "Open editor"
- assertVisible: "Sample sequence diagram"
- assertVisible: "My Charts"
- assertVisible: "New chart"
```

- [ ] **Step 2: Add the flow to `DEFAULT_FLOWS`**

Insert after `web-favicon-entrypoints.yaml` or near other entrypoint checks:

```bash
".maestro/flows/web-intro-ui-alignment.yaml"
```

- [ ] **Step 3: Run targeted UAT flow**

Start server if needed: `npm run serve:app`

Run: `npm run uat:suite -- .maestro/flows/web-intro-ui-alignment.yaml`

Expected: PASS.

## Task 9: Strict verification matrix

**Files:**
- No source edits unless verification uncovers a defect.

- [ ] **Step 1: Static tests**

Run: `npm test`

Expected: PASS for `tests/input-normalization.test.js` and `tests/ui-alignment-contract.test.js`.

- [ ] **Step 2: Build check**

Run: `npm run build`

Expected: Gulp build completes without errors and produces minified build artifacts according to existing gulpfile behavior.

- [ ] **Step 3: HTTP smoke**

Run server: `npm run serve:app`

In another terminal run:

```bash
curl -I "http://127.0.0.1:8000/intro.html?maestro=1"
curl -I "http://127.0.0.1:8000/index.html?maestro=1"
curl -I "http://127.0.0.1:8000/css/landing.css"
curl -I "http://127.0.0.1:8000/css/main.css"
curl -I "http://127.0.0.1:8000/js/app.js"
```

Expected: every response is `HTTP/1.0 200 OK` or `HTTP/1.1 200 OK`.

- [ ] **Step 4: Full Maestro smoke**

Run: `npm run uat:smoke`

Expected: all default flows PASS, including existing chart create, rename, delete, nav, top action, favicon, and new intro flow.

- [ ] **Step 5: Browser visual verification - desktop intro**

Open: `http://127.0.0.1:8000/intro.html?maestro=1`

Viewport: 1440 x 900.

Assertions via browser tools:

```js
return {
  hasNav: !!document.querySelector(".site-nav"),
  hasHero: !!document.querySelector(".hero"),
  hasDemoSvg: !!document.querySelector("#landing-canvas svg"),
  overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  heroBottom: document.querySelector(".hero").getBoundingClientRect().bottom,
  tryItTop: document.querySelector("#try-it").getBoundingClientRect().top
};
```

Expected: `hasNav` true, `hasHero` true, `hasDemoSvg` true, `overflowX` false, and the next section starts close enough to be discoverable after the hero.

- [ ] **Step 6: Browser visual verification - desktop app**

Open: `http://127.0.0.1:8000/index.html?maestro=1`

Viewport: 1440 x 900.

Assertions via browser tools:

```js
return {
  hasNav: !!document.querySelector(".app-nav"),
  hasLayout: !!document.querySelector(".app-layout"),
  hasEditor: !!document.querySelector(".CodeMirror"),
  hasChartSvg: !!document.querySelector("#chart svg"),
  overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  navHeight: Math.round(document.querySelector(".app-nav").getBoundingClientRect().height),
  editorWidth: Math.round(document.querySelector(".editor-pane").getBoundingClientRect().width),
  previewWidth: Math.round(document.querySelector(".preview-pane").getBoundingClientRect().width)
};
```

Expected: nav/layout/editor/chart true, overflow false, nav height near 52px, editor and preview widths both above 300px.

- [ ] **Step 7: Browser interaction verification**

On desktop app:

- Click `My Charts`, expect drawer opens, `#charts-drawer` visible, chart count visible.
- Click chart pill, expect same drawer opens.
- Click `New chart`, expect `#new-chart-picker` modal visible.
- Click `Help`, expect sequence or flowchart syntax modal visible.
- Click `Export`, expect existing PNG export behavior still routes through current modal/download logic.
- Type invalid syntax in editor, expect parse error marking remains visible and app does not crash.
- Type valid sequence syntax again, expect `#chart svg` returns.

- [ ] **Step 8: Browser visual verification - mobile**

Viewports: 390 x 844 and 320 x 568.

Intro expectations:

- `.site-nav` visible or mobile-appropriate nav visible.
- Hero text fits without overlap.
- Live demo stacks vertically.
- No horizontal scroll.

App expectations:

- `.mobile-gate` visible.
- `.app-layout` and `.app-nav` hidden.
- Back link points to `intro.html`.
- No horizontal scroll.

- [ ] **Step 9: Diagnostics**

Use VS Code diagnostics on:

- `app/intro.html`
- `app/index.html`
- `app/css/landing.css`
- `app/css/main.css`
- `app/css/design-tokens.css`
- `app/js/app.js`
- `tests/ui-alignment-contract.test.js`

Expected: no errors. Warnings are acceptable only if they already existed and are documented.

## Self-review checklist

- Spec coverage: intro, main app shell, tokens, runtime preservation, UAT, visual verification all map to explicit tasks.
- Placeholder scan: no placeholder markers or vague catch-all work items remain.
- Type and selector consistency: legacy app ids are preserved; prototype-only ids are used only as source mapping references.
- Risk note: the mobile behavior change is intentional and isolated. If reviewer rejects it, Task 5 Step 5 and Task 7 Step 2 should be removed before execution.

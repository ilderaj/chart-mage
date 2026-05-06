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

test("landing demo footers keep compact height with top-aligned mono metadata", () => {
  const landingCss = read("app/css/landing.css");
  const paneFooterBlock = landingCss.match(/\.pane-footer\s*\{[^}]*display\s*:\s*flex;[^}]*\}/s)?.[0] || "";
  const paneFooterSpanBlock = landingCss.match(/\.pane-footer\s*>\s*span\s*\{[^}]*\}/s)?.[0] || "";

  assertIncludes(landingCss, ".pane-footer", "landing pane footer styles");
  assert.match(paneFooterBlock, /height\s*:\s*36px/, "pane footer should keep the compact prototype height");
  assert.match(paneFooterBlock, /align-items\s*:\s*flex-start/, "pane footer metadata should anchor to the top of the footer bar");
  assert.match(paneFooterBlock, /padding\s*:\s*7px 14px 0/, "pane footer should use top-biased padding to visually center the mono text");
  assert.match(paneFooterBlock, /font-feature-settings\s*:\s*"tnum"/, "pane footer should use tabular figures");
  assert.match(paneFooterSpanBlock, /top\s*:\s*0/, "pane footer spans should not require extra baseline offsets once the footer layout is corrected");
});

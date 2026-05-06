const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("non-fingerprinted css and js assets must revalidate", () => {
  const headers = read("app/_headers");

  assert.match(
    headers,
    /\/css\/\*[\s\S]*Cache-Control:\s*public,\s*max-age=0,\s*must-revalidate/,
    "css assets should revalidate immediately because their filenames are stable"
  );
  assert.match(
    headers,
    /\/js\/\*[\s\S]*Cache-Control:\s*public,\s*max-age=0,\s*must-revalidate/,
    "js assets should revalidate immediately because their filenames are stable"
  );
});

test("build pipeline must copy deployment headers into dist", () => {
  const gulpfile = read("gulpfile.js");

  assert.match(
    gulpfile,
    /gulp\.src\(\[?"app\/_headers"|gulp\.src\([^\n]*_headers/,
    "build pipeline should copy _headers so deployed assets keep the intended cache policy"
  );
});

test("build pipeline must preserve intro runtime scripts outside the main bundle", () => {
  const gulpfile = read("gulpfile.js");

  assert.match(
    gulpfile,
    /base:\s*"app\/js"/,
    "build should preserve intro runtime subpaths relative to app/js"
  );
  assert.match(
    gulpfile,
    /app\/js\/lib\/mermaidAPI\.min\.js/,
    "build should copy the intro Mermaid runtime into dist"
  );
  assert.match(
    gulpfile,
    /gulp\.dest\("dist\/js"/,
    "build should preserve the intro maestro observer under dist/js"
  );
  assert.match(
    gulpfile,
    /app\/js\/maestro-observer\.js/,
    "build should copy the intro maestro observer into dist"
  );
});

test("entry html should version bundled asset URLs to break existing stale caches", () => {
  const introHtml = read("app/intro.html");
  const indexHtml = read("app/index.html");
  const gulpfile = read("gulpfile.js");

  assert.match(
    introHtml,
    /build:css\s+css\/intro\.min\.css\s-->/,
    "intro source html should keep a stable bundle filename for useref output"
  );
  assert.match(
    indexHtml,
    /build:css\s+css\/style\.min\.css\s-->/,
    "main source html should keep a stable css bundle filename for useref output"
  );
  assert.match(
    indexHtml,
    /build:js\s+js\/bundle\.js\s-->/,
    "main source html should keep a stable js bundle filename for useref output"
  );
  assert.match(
    gulpfile,
    /replace\(\/css\\\/intro\\\.min\\\.css\(\?!\\\?v=\)\/g,\s*"css\/intro\.min\.css\?v=" \+ deployAssetVersion\)/,
    "build should append a version query to intro bundle URLs after useref runs"
  );
  assert.match(
    gulpfile,
    /replace\(\/css\\\/style\\\.min\\\.css\(\?!\\\?v=\)\/g,\s*"css\/style\.min\.css\?v=" \+ deployAssetVersion\)/,
    "build should append a version query to main css bundle URLs after useref runs"
  );
  assert.match(
    gulpfile,
    /replace\(\/js\\\/bundle\\\.js\(\?!\\\?v=\)\/g,\s*"js\/bundle\.js\?v=" \+ deployAssetVersion\)/,
    "build should append a version query to main js bundle URLs after useref runs"
  );
});
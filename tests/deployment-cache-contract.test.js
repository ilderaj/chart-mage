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

test("entry html should version bundled asset URLs to break existing stale caches", () => {
  const introHtml = read("app/intro.html");
  const indexHtml = read("app/index.html");

  assert.match(
    introHtml,
    /build:css\s+css\/intro\.min\.css\?v=/,
    "intro bundle target should carry a deployment version query"
  );
  assert.match(
    indexHtml,
    /build:css\s+css\/style\.min\.css\?v=/,
    "main css bundle target should carry a deployment version query"
  );
  assert.match(
    indexHtml,
    /build:js\s+js\/bundle\.js\?v=/,
    "main js bundle target should carry a deployment version query"
  );
});
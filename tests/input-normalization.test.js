const test = require("node:test");
const assert = require("node:assert/strict");

const inputNormalizer = require("../app/js/input-normalization.js");

test("normalizes a fullwidth message delimiter for sequence diagrams", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("sequenceDiagram", "participant Alice\nparticipant Bob\nAlice ->> Bob：你好"),
    "participant Alice\nparticipant Bob\nAlice ->> Bob:你好"
  );
});

test("preserves fullwidth punctuation inside the message body", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("sequenceDiagram", "Alice ->> Bob：你好：世界"),
    "Alice ->> Bob:你好：世界"
  );
});

test("normalizes note over syntax with fullwidth comma and colon", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("sequenceDiagram", "Note over Alice，Bob：状态：正常"),
    "Note over Alice, Bob:状态：正常"
  );
});

test("leaves non-sequence input unchanged", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("flowchart", "开始：准备 ->> 结束"),
    "开始：准备 ->> 结束"
  );
});

test("normalizes fullwidth terminal delimiters for flowcharts", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("flowchart", "（（Start）） ->> Has draft？\nHas draft？ - yes ->> Open editor"),
    "((Start)) ->> Has draft？\nHas draft？ - yes ->> Open editor"
  );
});

test("leaves fullwidth question marks in flowchart labels unchanged", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("flowchart", "((Start)) ->> Has draft？"),
    "((Start)) ->> Has draft？"
  );
});

test("normalizes fullwidth sequence arrows and activation markers", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("sequenceDiagram", "Alice －＞＞＋ Bob：你好\nBob －－＞＞－ Alice：收到"),
    "Alice ->>+ Bob:你好\nBob -->>- Alice:收到"
  );
});

test("normalizes fullwidth flowchart arrows", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("flowchart", "Start －＞＞ End\nDecision？ － yes －＞＞ End"),
    "Start ->> End\nDecision？ - yes ->> End"
  );
});

test("normalizes mixed sequence arrows that use Chinese angle quotes", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("sequenceDiagram", "Alice -》》 Bob：你好\nBob --》 Alice：收到"),
    "Alice ->> Bob:你好\nBob --> Alice:收到"
  );
});

test("normalizes mixed flowchart arrows that use Chinese angle quotes", function() {
  assert.equal(
    inputNormalizer.normalizeDiagramInput("flowchart", "Start -》 End\nDecision？ - yes -》》 End"),
    "Start -> End\nDecision？ - yes ->> End"
  );
});
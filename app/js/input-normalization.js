(function(root, factory) {
  if (typeof module == "object" && module.exports)
    module.exports = factory();
  else
    root.ChartMageInputNormalizer = factory();
})(typeof self != "undefined" ? self : this, function() {
  "use strict";

  function normalizeSequenceLine(line) {
    var normalizedLine = line;
    var notePattern = /^(\s*(?:Note|note)\s+(?:right of |left of |over )[^：:\n]*)(：)(.*)$/;
    var messagePattern = /^(\s*.*?(?:-->>|-->|->>|->|--x|-x)(?:\s*)(?:\+|-)?\s*[^：:\n]+)(：)(.*)$/;

    if (notePattern.test(normalizedLine)) {
      normalizedLine = normalizedLine.replace(notePattern, function(match, prefix, colon, suffix) {
        return prefix.replace(/，/g, ", ") + ":" + suffix;
      });
      return normalizedLine;
    }

    if (messagePattern.test(normalizedLine))
      normalizedLine = normalizedLine.replace(messagePattern, "$1:$3");

    return normalizedLine;
  }

  function normalizeDiagramInput(type, input) {
    if (typeof input != "string" || input.indexOf("：") == -1)
      return input;

    if (type != "sequenceDiagram")
      return input;

    return input.split("\n").map(normalizeSequenceLine).join("\n");
  }

  return {
    normalizeDiagramInput: normalizeDiagramInput,
    normalizeSequenceLine: normalizeSequenceLine
  };
});
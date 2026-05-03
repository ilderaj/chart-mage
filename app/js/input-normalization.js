(function(root, factory) {
  if (typeof module == "object" && module.exports)
    module.exports = factory();
  else
    root.ChartMageInputNormalizer = factory();
})(typeof self != "undefined" ? self : this, function() {
  "use strict";

  function normalizeFlowchartLine(line) {
    return line
      .replace(/[(（][(（]/g, "((")
      .replace(/[)）][)）]/g, "))");
  }

  function normalizeSequenceLine(line) {
    var normalizedLine = line;
    var notePattern = /^(\s*(?:Note|note)\s+(?:right of |left of |over )[^：:\n]*)(：)(.*)$/;
    var messagePattern = /^(\s*.*?(?:-->>|-->|->>|->|--x|-x)(?:\s*)(?:\+|-)?\s*[^：:\n]+)(：)(.*)$/;

    if (notePattern.test(normalizedLine)) {
      normalizedLine = normalizedLine.replace(notePattern, function(match, prefix, colon, suffix) {
        return prefix.replace(/\s*，\s*/g, ", ") + ":" + suffix;
      });
      return normalizedLine;
    }

    if (messagePattern.test(normalizedLine))
      normalizedLine = normalizedLine.replace(messagePattern, "$1:$3");

    return normalizedLine;
  }

  function normalizeDiagramInput(type, input) {
    if (typeof input != "string")
      return input;

    if (type == "sequenceDiagram") {
      if (input.indexOf("：") == -1 && input.indexOf("，") == -1)
        return input;

      return input.split("\n").map(normalizeSequenceLine).join("\n");
    }

    if (type == "flowchart") {
      if (!/[（）」]/.test(input) && !/[)）][)）]/.test(input) && !/[(（][(（]/.test(input))
        return input;

      return input.split("\n").map(normalizeFlowchartLine).join("\n");
    }

    return input;
  }

  return {
    normalizeDiagramInput: normalizeDiagramInput,
    normalizeFlowchartLine: normalizeFlowchartLine,
    normalizeSequenceLine: normalizeSequenceLine
  };
});
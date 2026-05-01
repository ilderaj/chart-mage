(function() {
  "use strict";

  var searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get("maestro") !== "1") {
    return;
  }

  function getPageName() {
    var pathName = window.location.pathname.split("/").pop();
    return pathName || "index.html";
  }

  function ensureObserverRoot() {
    var existingRoot = document.getElementById("maestro-observer");
    if (existingRoot) {
      return existingRoot;
    }

    var root = document.createElement("div");
    root.id = "maestro-observer";
    root.setAttribute("role", "status");
    root.setAttribute("aria-live", "polite");
    root.style.position = "fixed";
    root.style.left = "12px";
    root.style.bottom = "12px";
    root.style.zIndex = "2147483647";
    root.style.maxWidth = "min(520px, calc(100vw - 24px))";
    root.style.padding = "8px 10px";
    root.style.border = "1px solid rgba(15, 23, 42, 0.12)";
    root.style.borderRadius = "10px";
    root.style.background = "rgba(255, 255, 255, 0.96)";
    root.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.12)";
    root.style.color = "#0f172a";
    root.style.font = "12px/1.45 monospace";
    root.style.pointerEvents = "auto";

    var actionStatus = document.createElement("div");
    actionStatus.id = "maestro-action-status";
    root.appendChild(actionStatus);

    var faviconStatus = document.createElement("div");
    faviconStatus.id = "maestro-favicon-status";
    faviconStatus.style.marginTop = "4px";
    root.appendChild(faviconStatus);

    var shortcutButton = document.createElement("button");
    shortcutButton.id = "maestro-trigger-nav-search-shortcut";
    shortcutButton.type = "button";
    shortcutButton.textContent = "Trigger Cmd-K search";
    shortcutButton.style.marginTop = "6px";
    shortcutButton.style.padding = "4px 8px";
    shortcutButton.style.border = "1px solid rgba(15, 23, 42, 0.12)";
    shortcutButton.style.borderRadius = "6px";
    shortcutButton.style.background = "#ffffff";
    shortcutButton.style.color = "#0f172a";
    shortcutButton.style.cursor = "pointer";
    shortcutButton.style.font = "12px/1.4 monospace";
    shortcutButton.addEventListener("click", function() {
      if (window.ChartMageMaestro && typeof window.ChartMageMaestro.triggerNavSearchShortcut == "function") {
        window.ChartMageMaestro.triggerNavSearchShortcut();
      }
    });
    root.appendChild(shortcutButton);

    (document.body || document.documentElement).appendChild(root);
    return root;
  }

  function updateLine(id, text) {
    ensureObserverRoot();
    var target = document.getElementById(id);
    if (target) {
      target.textContent = text;
    }
  }

  function collectFaviconContract() {
    var iconLinks = Array.prototype.slice.call(document.querySelectorAll("link[rel*='icon']"));

    return iconLinks.map(function(link) {
      return "rel=" + (link.getAttribute("rel") || "") +
        " href=" + (link.getAttribute("href") || "") +
        " type=" + (link.getAttribute("type") || "");
    });
  }

  function publishFaviconLine(container, id, text, withMargin) {
    var line = document.getElementById(id);

    if (!line) {
      line = document.createElement("div");
      line.id = id;
      if (withMargin) {
        line.style.marginTop = "2px";
      }
      container.appendChild(line);
    }

    line.textContent = text;
  }

  function publishAction(action) {
    updateLine("maestro-action-status", "Maestro action: " + action);
  }

  function publishFaviconContract() {
    ensureObserverRoot();

    var faviconStatus = document.getElementById("maestro-favicon-status");
    var contracts = collectFaviconContract();
    var lineIndex;

    if (!faviconStatus) {
      return;
    }

    faviconStatus.replaceChildren();
    publishFaviconLine(faviconStatus, "maestro-favicon-page", "Maestro favicon page: " + getPageName(), false);

    for (lineIndex = 0; lineIndex < contracts.length; lineIndex += 1) {
      publishFaviconLine(
        faviconStatus,
        "maestro-favicon-link-" + lineIndex,
        "Maestro favicon link: " + contracts[lineIndex],
        true
      );
    }
  }

  function initializeObserver() {
    ensureObserverRoot();
    publishAction("ready:" + getPageName());
    publishFaviconContract();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeObserver);
  } else {
    initializeObserver();
  }

  window.ChartMageMaestro = {
    publishAction: publishAction,
    publishFaviconContract: publishFaviconContract
  };
})();
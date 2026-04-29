#!/usr/bin/env bash

set -euo pipefail

ensure_java() {
  if command -v java >/dev/null 2>&1 && java -version >/dev/null 2>&1; then
    return 0
  fi

  if command -v brew >/dev/null 2>&1; then
    brew install openjdk@17

    if [[ -x "/opt/homebrew/opt/openjdk@17/bin/java" ]]; then
      export PATH="/opt/homebrew/opt/openjdk@17/bin:${PATH}"
      return 0
    fi

    if [[ -x "/usr/local/opt/openjdk@17/bin/java" ]]; then
      export PATH="/usr/local/opt/openjdk@17/bin:${PATH}"
      return 0
    fi
  fi

  echo "Java 17+ is required for Maestro. Install it and retry."
  exit 1
}

ensure_java

curl -fsSL "https://get.maestro.mobile.dev" | bash

echo "Maestro CLI installation completed."
echo "If your shell cannot find 'maestro' yet, restart the shell or add ~/.maestro/bin to PATH."
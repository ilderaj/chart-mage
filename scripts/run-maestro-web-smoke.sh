#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FLOW_PATH="${ROOT_DIR}/.maestro/flows/web-smoke.yaml"
DEBUG_OUTPUT_DIR="${ROOT_DIR}/.maestro/debug-output"
MAESTRO_BIN="${MAESTRO_BIN:-maestro}"
HEADLESS=true

ensure_java() {
  if command -v java >/dev/null 2>&1 && java -version >/dev/null 2>&1; then
    return 0
  fi

  if [[ -x "/opt/homebrew/opt/openjdk@17/bin/java" ]]; then
    export PATH="/opt/homebrew/opt/openjdk@17/bin:${PATH}"
    return 0
  fi

  if [[ -x "/usr/local/opt/openjdk@17/bin/java" ]]; then
    export PATH="/usr/local/opt/openjdk@17/bin:${PATH}"
    return 0
  fi

  echo "Java is required for Maestro. Install Java 17+ and retry."
  exit 1
}

resolve_maestro() {
  if command -v "${MAESTRO_BIN}" >/dev/null 2>&1; then
    return 0
  fi

  if [[ "${MAESTRO_BIN}" == "maestro" && -x "${HOME}/.maestro/bin/maestro" ]]; then
    MAESTRO_BIN="${HOME}/.maestro/bin/maestro"
    return 0
  fi

  echo "Maestro CLI is not installed. Run ./scripts/install-maestro.sh first."
  exit 1
}

if [[ "${1:-}" == "--headed" ]]; then
  HEADLESS=false
  shift
elif [[ "${1:-}" == "--headless" ]]; then
  shift
fi

ensure_java
resolve_maestro

mkdir -p "${DEBUG_OUTPUT_DIR}"

cmd=("${MAESTRO_BIN}" "--platform" "web" "test" "--debug-output=${DEBUG_OUTPUT_DIR}")

if [[ "${HEADLESS}" == "true" ]]; then
  cmd+=("--headless")
fi

cmd+=("${FLOW_PATH}")

if [[ "$#" -gt 0 ]]; then
  cmd+=("$@")
fi

exec "${cmd[@]}"
#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEBUG_OUTPUT_DIR="${ROOT_DIR}/.maestro/debug-output"
MAESTRO_BIN="${MAESTRO_BIN:-maestro}"
HEADLESS=true
DEFAULT_FLOWS=(
  ".maestro/flows/web-smoke.yaml"
  ".maestro/flows/web-create-sequence.yaml"
  ".maestro/flows/web-rename-chart.yaml"
  ".maestro/flows/web-delete-chart.yaml"
  ".maestro/flows/web-top-nav-alignment.yaml"
  ".maestro/flows/web-nav-search.yaml"
  ".maestro/flows/web-chart-pill-rename.yaml"
  ".maestro/flows/web-top-nav-actions.yaml"
  ".maestro/flows/web-favicon-entrypoints.yaml"
)

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

resolve_flow_path() {
  local flow_path="$1"

  if [[ "${flow_path}" == /* ]]; then
    printf '%s\n' "${flow_path}"
    return 0
  fi

  flow_path="${flow_path#./}"
  printf '%s\n' "${ROOT_DIR}/${flow_path}"
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

flows=("${DEFAULT_FLOWS[@]}")

if [[ "$#" -gt 0 ]]; then
  flows=("$@")
fi

for flow in "${flows[@]}"; do
  flow_path="$(resolve_flow_path "${flow}")"
  flow_name="$(basename "${flow_path}" .yaml)"

  mkdir -p "${DEBUG_OUTPUT_DIR}/${flow_name}"

  cmd=("${MAESTRO_BIN}" "--platform" "web" "test" "--debug-output=${DEBUG_OUTPUT_DIR}/${flow_name}")

  if [[ "${HEADLESS}" == "true" ]]; then
    cmd+=("--headless")
  fi

  cmd+=("${flow_path}")

  echo "Running Maestro flow: ${flow_name}"
  "${cmd[@]}"
done
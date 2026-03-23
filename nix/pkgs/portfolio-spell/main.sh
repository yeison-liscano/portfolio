# shellcheck shell=bash

function check {
  local files=${1:-"all"}
  local config_file
  config_file="$(git rev-parse --show-toplevel)/.cspell.json"

  case "${files}" in
    "all")
      echo "[INFO] Checking all files"
      cspell "**" "--config" "${config_file}"
      return $?
      ;;
    "only-changed-files")
      echo "[INFO] Checking only changed files"
      git diff-tree --no-commit-id --name-only --diff-filter=d -r HEAD | cspell --config "${config_file}" --file-list stdin --no-must-find-files
      return $?
      ;;
    *)
      echo "[INFO] Checking specified files: ${files}"
      cspell "${files}" "--config" "${config_file}"
      return $?
      ;;
  esac
}

function main {
  check "${@}"
}

main "${@}"

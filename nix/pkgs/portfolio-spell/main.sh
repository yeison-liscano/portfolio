# shellcheck shell=bash

function check {
  local files=${1:-"all"}
  local config_file=".cspell.json"

  case "${files}" in
    "all")
      cspell "**" "--config" "${config_file}"
      return $?
      ;;
    "only-changed-files")
      git diff-tree --no-commit-id --name-only --diff-filter=d -r HEAD | cspell --config "${config_file}" --file-list stdin --no-must-find-files
      return $?
      ;;
    *)
      cspell "${files}" "--config" "${config_file}"
      return $?
      ;;
  esac
}

function main {
  # Initialize spell checker dictionaries
  if command -v cspell-dict-fr-fr-link > /dev/null 2>&1; then
    cspell-dict-fr-fr-link
  fi

  if command -v cspell-dict-es-es-link > /dev/null 2>&1; then
    cspell-dict-es-es-link
  fi

  check "${@}"
}

main "${@}"

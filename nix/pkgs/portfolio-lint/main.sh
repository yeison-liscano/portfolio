# shellcheck shell=bash

function _get_tracked_files {
  local target="${1}"
  local pattern="${2}"
  local files_tmp="${3}"

  # Get all tracked files matching pattern and filter out non-existent ones
  while IFS= read -r file; do
    if [[ -f ${file} ]]; then
      echo "${file}"
    fi
  done < <(git ls-files "${target}/${pattern}" | sort --ignore-case) > "${files_tmp}"
}

function _lint_secrets {
  echo "[INFO] Linting no secrets are leaked in the commit"

  if git --no-pager log HEAD^..HEAD | grep -q -- "- no-leaks-test"; then
    return 0
  fi

  gitleaks --verbose detect --log-opts="HEAD...HEAD^"
}

function _lint_commit {
  local commitlint_config="${1}"
  local commitlint_parser="${2}"

  echo "[INFO] Linting Commit messages"

  git log -1 --pretty=%B HEAD | commitlint --parser-preset "${commitlint_parser}" --config "${commitlint_config}"
}

function _lint_nix {
  local target="${1}"
  local files_tmp

  echo "[INFO] Linting Nix files"

  files_tmp="$(mktemp)"
  _get_tracked_files "${target}" "*.nix" "${files_tmp}"

  if ! xargs nixfmt --check < "${files_tmp}"; then
    xargs nixfmt < "${files_tmp}"
    return 1
  fi

  if ! statix check "${target}"; then
    statix fix "${target}"
    return 1
  fi
}

function _lint_shell {
  local target="${1}"
  local shellcheck_args=(
    --external-sources
  )
  local shfmt_args=(
    --binary-next-line
    --case-indent
    --indent 2
    --simplify
    --space-redirects
  )
  local files_tmp

  echo "[INFO] Linting Shell files"

  files_tmp="$(mktemp)"
  _get_tracked_files "${target}" "*.sh" "${files_tmp}"

  if ! xargs shellcheck "${shellcheck_args[@]}" < "${files_tmp}"; then
    return 1
  fi

  if ! xargs shfmt -d "${shfmt_args[@]}" < "${files_tmp}"; then
    xargs shfmt -w "${shfmt_args[@]}" < "${files_tmp}"
    return 1
  fi
}

function main {
  local commitlint_config="${1}"
  local commitlint_parser="${2}"
  local target

  target="$(git rev-parse --show-toplevel)"

  _lint_secrets
  _lint_commit "${commitlint_config}" "${commitlint_parser}"
  _lint_nix "${target}"
  _lint_shell "${target}"
  portfolio-markdownlint
  portfolio-spell only-changed-files
}

main "${@}"

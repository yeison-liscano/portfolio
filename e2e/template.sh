# shellcheck shell=bash

function _create_tmp_dir {
  local source="${1}"
  local target="${2}"

  : && info "Cleaning ${target}" \
    && rm -rf "${target}" \
    && info "Copying ${source} to ${target}" \
    && copy "${source}" "${target}"
}

function run_cypress {
  local browser="${1-}"
  local action="${2-}"
  local spec="${3-}"
  local cypress_bin
  local cypress_run
  local custom_tmp_dir="custom/tmp"
  export CYPRESS_RUN_BINARY

  : \
    && mkdir -p "${custom_tmp_dir}" \
    && export TMPDIR="${custom_tmp_dir}" \
    && cypress_bin="${PWD}/cypress" \
    && if test -n "${spec}"; then
      : && info "Running cypress tests only for ${spec}" \
        && args+=(--spec "${spec}")
    else
      info "Running cypress tests for all specs"
    fi \
    && _create_tmp_dir "__argCypress__/." "${cypress_bin}" \
    && if test -n "__argIsLinux__"; then
      CYPRESS_RUN_BINARY="${cypress_bin}/bin/Cypress"
      cypress_run=(xvfb-run pnpm exec cypress run --browser "${browser}" --headless "${args[@]}")
    else
      CYPRESS_RUN_BINARY="${cypress_bin}/Cypress.app/Contents/MacOS/Cypress"
      cypress_run=(pnpm exec cypress run --browser electron "${args[@]}")
    fi \
    && case "${action}" in
      run) "${cypress_run[@]}" ;;
      open) pnpm exec cypress open ;;
      *) error 'First argument must be one of: run, open' ;;
    esac
}

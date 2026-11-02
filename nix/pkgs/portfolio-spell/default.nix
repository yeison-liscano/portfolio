{ pkgs, projectPath }:
pkgs.writeShellApplication {
  name = "portfolio-spell";
  runtimeInputs = [
    pkgs.git
    pkgs.nodejs_26
    pkgs.pnpm
  ];
  text = ''
    cd "$(git rev-parse --show-toplevel)"
    CYPRESS_INSTALL_BINARY=0 pnpm install --frozen-lockfile
    # shellcheck disable=SC1091
    source "${./main.sh}"  "$@"
  '';
}

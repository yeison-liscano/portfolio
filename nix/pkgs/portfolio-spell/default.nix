{ pkgs, projectPath }:
pkgs.writeShellApplication {
  name = "portfolio-spell";
  runtimeInputs = [
    pkgs.nodePackages.cspell
    pkgs.git
    pkgs.nodejs_22
  ];
  text = ''
    npm install --no-package-lock --prefix "nix/pkgs/portfolio-spell"
    # shellcheck disable=SC1091
    source "${./main.sh}"  "$@"
  '';
}

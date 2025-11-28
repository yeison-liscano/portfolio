{ pkgs, self' }:
let
  commitlint_config = ./config.js;
  commitlint_parser = ./parser.js;
in
pkgs.writeShellApplication {
  name = "portfolio-lint";
  runtimeInputs = pkgs.lib.flatten [
    pkgs.findutils
    pkgs.git

    pkgs.gnugrep
    pkgs.gitleaks

    pkgs.commitlint

    pkgs.nixfmt
    pkgs.statix

    pkgs.shellcheck
    pkgs.shfmt

    self'.packages.portfolio-markdownlint
    self'.packages.portfolio-spell
  ];
  text = ''
    # shellcheck disable=SC1091
    source "${./main.sh}" \
      "${commitlint_config}" \
      "${commitlint_parser}" \
      "$@"
  '';
}

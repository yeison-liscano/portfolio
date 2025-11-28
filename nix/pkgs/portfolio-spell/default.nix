{ pkgs, projectPath }:
let
  nodeModules = pkgs.stdenv.mkDerivation {
    name = "portfolio-spell-node-modules";
    src = ./.;
    buildInputs = [ pkgs.nodejs_22 ];
  };
in
pkgs.writeShellApplication {
  name = "portfolio-spell";
  runtimeInputs = [
    pkgs.nodePackages.cspell
    pkgs.git
    pkgs.nodejs_22
  ];
  text = ''
    # shellcheck disable=SC1091
    source "${./main.sh}"
    main "$@"
  '';
}

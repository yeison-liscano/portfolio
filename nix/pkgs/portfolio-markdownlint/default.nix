{ pkgs, projectPath }:
let
  configPath = projectPath "/nix/pkgs/portfolio-markdownlint/.markdownlint.json";
in
pkgs.writeShellApplication {
  name = "portfolio-markdownlint";
  runtimeInputs = [
    pkgs.markdownlint-cli
    pkgs.git
  ];
  text = ''
    # Change to git root to ensure relative paths work correctly
    cd "$(git rev-parse --show-toplevel)"
    markdownlint --fix --config "${configPath}" "./src/blog"
  '';
}

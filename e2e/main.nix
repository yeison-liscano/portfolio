{
  inputs,
  isLinux,
  makeTemplate,
  __system__,
  ...
}:
let
  version = "16.2.1";
  srcs = {
    aarch64-linux = {
      platform = "linux-arm64";
      sha256 = "sha256-m6kgLcQE8drGGv+2ZgkytnEPyVfBbEJShGOz4cDGZPw=";
    };
    x86_64-linux = {
      platform = "linux-x64";
      sha256 = "sha256-mS6tiWbkbp5IiQ6zYbMzhZGmefMsnVC2maGaakgxys4=";
    };
  };
  currentPlatform = builtins.currentSystem;
  platformInfo = builtins.getAttr currentPlatform srcs;
  bin =
    if isLinux then
      (inputs.nixpkgs.cypress.overrideAttrs (_: {
        inherit version;
        src = inputs.nixpkgs.fetchzip {
          url = "https://cdn.cypress.io/desktop/${version}/${platformInfo.platform}/cypress.zip";
          sha256 = "${platformInfo.sha256}";
        };
      }))
    else
      inputs.nixpkgs.fetchzip {
        url = "https://cdn.cypress.io/desktop/${version}/darwin-arm64/cypress.zip";
        sha256 = "sha256-r8akzSxrjRrwE/Y5Y3rHgG4yr4FPRSX9eM5J7mriR6k=";
        stripRoot = false;
      };
in
makeTemplate {
  template = ./template.sh;
  name = "cypress";
  replace = {
    __argCypress__ = bin;
    __argIsLinux__ = builtins.toString isLinux;
  };
  searchPaths = {
    bin = [
      inputs.nixpkgs.bash
      inputs.nixpkgs.git
      inputs.nixpkgs.nodejs_26
      inputs.nixpkgs.pnpm
    ]
    ++ inputs.nixpkgs.lib.optionals isLinux [
      inputs.nixpkgs.cypress
      inputs.nixpkgs.gnugrep
      inputs.nixpkgs.gnused
      inputs.nixpkgs.firefox
      inputs.nixpkgs.chromium
      inputs.nixpkgs.xvfb-run # required for headless mode
    ];
  };
}

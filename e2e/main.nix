{
  inputs,
  isLinux,
  makeTemplate,
  __system__,
  ...
}:
let
  version = "13.13.3";
  srcs = {
    aarch64-linux = {
      platform = "linux-arm64";
      sha256 = "sha256-VgX8xaYCwyjAZh1HZOooFygUUyPnk2nAO9WvfieQyA0=";
    };
    x86_64-linux = {
      platform = "linux-x64";
      sha256 = "sha256-3Imr4KA4n47Ja9W4Wwl9UfSler3O2W5eJ6nxrHItuxE=";
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
        url = "https://cdn.cypress.io/desktop/13.13.3/darwin-arm64/cypress.zip";
        sha256 = "sha256-a0Pe+GsH07Ru55PFndp/oHVLPbs/VamYJd2pEJwbVjQ=";
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
      inputs.nixpkgs.nodejs_22
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

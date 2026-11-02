{
  description = "Yeison Liscano portfolio";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts/ea2630b7470978622c7689a1ff75d2b389175399?shallow=1";
    nixpkgs.url = "github:nixos/nixpkgs/be854059b22f5f33bd31ab61c835a55a58fd8839?shallow=1";
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      debug = false;

      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-linux"
      ];

      perSystem =
        {
          inputs',
          pkgs,
          self',
          system,
          ...
        }:
        let
          projectPath = path: ./. + path;
          lib' = { inherit pkgs; };
        in
        {
          devShells = import ./nix/shells.nix {
            inherit
              inputs'
              lib'
              pkgs
              self'
              ;
          };
          packages = import ./nix/pkgs { inherit pkgs self' projectPath; };
        };
    };
}

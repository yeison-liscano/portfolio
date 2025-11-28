{
  description = "Yeison Liscano portfolio";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts/f4330d22f1c5d2ba72d3d22df5597d123fdb60a9?shallow=1";
    nixpkgs.url = "github:nixos/nixpkgs/64d369e1590b976e18a69b335390c2f6e4b512d2?shallow=1";
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

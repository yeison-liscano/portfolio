{
  inputs',
  lib',
  pkgs,
  self',
}:
{
  default = pkgs.mkShell {
    packages = pkgs.lib.flatten [
      # Runtime for the Astro site, npm scripts and Cypress; matches CI (node 22)
      pkgs.nodejs_22
      pkgs.git

      (pkgs.lib.attrValues self'.packages)
    ];
  };
}

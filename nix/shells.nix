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
      # Runs the agent skill scripts, such as score-blog-post's score_metrics.py
      pkgs.python3

      (pkgs.lib.attrValues self'.packages)
    ];
  };
}

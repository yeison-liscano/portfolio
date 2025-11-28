{
  pkgs,
  self',
  projectPath,
}:
{
  portfolio-lint = pkgs.callPackage ./portfolio-lint { inherit pkgs self'; };
  portfolio-markdownlint = pkgs.callPackage ./portfolio-markdownlint { inherit pkgs projectPath; };
  portfolio-spell = pkgs.callPackage ./portfolio-spell { inherit pkgs projectPath; };
}

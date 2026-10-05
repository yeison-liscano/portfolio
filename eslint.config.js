import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import * as mdx from "eslint-plugin-mdx";
import markdown from "@eslint/markdown";
import globals from "globals";

export default [
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  ...eslintPluginAstro.configs.recommended,
  // Directory patterns (trailing slash) ignore everything nested inside.
  // e2e/ has its own config: e2e/eslint.config.js.
  { ignores: ["node_modules/", ".astro/", "e2e/", "dist/"] },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs,astro}"],
    languageOptions: {
      // Pages and config run in Node at build time; component scripts in the browser.
      globals: { ...globals.node, ...globals.browser },
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    files: ["**/*.{js,astro,mdx}"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["**/*.mdx"],
    ...mdx.flat,
    rules: {
      ...mdx.flat.rules,
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },
  // Lint the code blocks inside Markdown files, as eslint-plugin-markdown did.
  ...markdown.configs.processor,
];

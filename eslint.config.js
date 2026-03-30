import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import * as mdx from "eslint-plugin-mdx";
import markdown from "eslint-plugin-markdown";

export default [
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  ...eslintPluginAstro.configs.recommended,
  { ignores: ["node_modules/*", ".astro/*", "e2e/*", "dist/*"] },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs,astro}"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "./tsconfig.json",
        tsconfigDirName: import.meta.dirname,
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
  // @ts-expect-error, types not yet updated
  ...markdown.configs.recommended,
];

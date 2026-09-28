import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import cypressPlugin from "eslint-plugin-cypress";
import functional from "eslint-plugin-functional";

export default [
  {
    files: ["e2e/**/*.ts"],
    plugins: {
      cypress: cypressPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  functional.configs.lite,
  prettierConfig,
  {
    rules: {
      "functional/no-return-void": "off",
    },
  },
];

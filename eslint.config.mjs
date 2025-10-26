import globals from "globals";
import parser from "astro-eslint-parser";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: [
      "**/.vscode/",
      "**/dist/",
      "**/node_modules/",
      "**/public/",
      ".astro",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.astro"],

    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      "prettier/prettier": "error",
    },
  },

  // Prettier integration: disables ESLint formatting rules that conflict with Prettier
  eslintConfigPrettier,
  {
    // Define the configuration for `<script>` tag.
    // Script in `<script>` is assigned a virtual file name with the `.js` extension.
    files: [
      "**/*.astro/*.js",
      "*.astro/*.js",
      "**/*.astro/*.ts",
      "*.astro/*.ts",
    ],
    rules: {
      "prettier/prettier": "off",
    },
  },
];

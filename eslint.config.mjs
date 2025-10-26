import globals from "globals";
import parser from "astro-eslint-parser";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";

export default [
    {
        ignores: ["**/.vscode/", "**/dist/", "**/node_modules/", "**/public/", ".astro"],
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

        rules: {
            semi: ["error", "always"],

            quotes: ["error", "double", {
                allowTemplateLiterals: true,
            }],

            "@typescript-eslint/triple-slash-reference": "off",
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

        rules: {},
    }
];
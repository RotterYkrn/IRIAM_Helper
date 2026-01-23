import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        ignores: ["**/node_modules/**", "**/dist/**"],
        plugins: {
            js,
            import: importPlugin,
            react,
        },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
        rules: {
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
            "no-redeclare": "off",
            "no-undef": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    // インターフェースや型定義での引数を無視するように設定
                    args: "after-used",
                    argsIgnorePattern: "^_", // _ で始まる引数は無視
                    varsIgnorePattern: "^_",
                },
            ],
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/prop-types": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    prettier,
]);

import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // Files to ignore
  {
    ignores: [".meteor/**", "node_modules/**", "public/**", "private/**", "_build/**"],
  },

  // Base JS rules
  js.configs.recommended,

  // Main config
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser + Node
        ...globals.browser,
        ...globals.node,
        // Meteor globals
        Meteor: "readonly",
        Mongo: "readonly",
        Session: "readonly",
        Template: "readonly",
        check: "readonly",
        Match: "readonly",
        Tracker: "readonly",
        ReactiveVar: "readonly",
        ReactiveDict: "readonly",
        EJSON: "readonly",
        DDP: "readonly",
        DDPRateLimiter: "readonly",
        Accounts: "readonly",
        Email: "readonly",
        Assets: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "warn",
      "react/display-name": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*", ".expo/*", "node_modules/*"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
    },
    rules: {
      "react/no-unescaped-entities": "off", // Allow (') and (") in JSX
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]);

import globals from "globals";
import pluginJs from "@eslint/js";
/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: "commonjs" },
    rules: {
      "no-multiple-empty-lines": {
        max: 1,
        maxEOF: 0,
        maxBOF: 0
      }
    }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
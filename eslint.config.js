import configPrettier from "eslint-config-prettier";
import parserTypeScript from "@typescript-eslint/parser";
import pluginPrettier from "eslint-plugin-prettier";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules/", "dist/"],
    languageOptions: {
      parser: parserTypeScript,
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript,
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginTypeScript.configs.recommended.rules,
      ...configPrettier.rules,
      "prettier/prettier": "error",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },

    // overrides: [
    //   {
    //     files: ["*.ts", "*.tsx"],
    //     rules: {
    //       "@typescript-eslint/explicit-module-boundary-types": "off",
    //     },
    //   },
    // ],
  },
];

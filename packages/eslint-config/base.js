import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"
import globals from "globals"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "max-lines": ["warn", { max: 400, skipBlankLines: true, skipComments: true }],
      "max-len": ["warn", { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
      "@typescript-eslint/no-magic-numbers": ["warn", { 
        ignore: [-1, 0, 1, 2, 10, 100, 1000],
        ignoreArrayIndexes: true,
        enforceConst: true,
        detectObjects: false,
      }],
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/explicit-function-return-type": "off", // Keep off for now to avoid massive noise, but available if needed
      "no-restricted-imports": ["warn", {
        paths: [
          {
            name: "lucide-react",
            message: "Please consider using internal UI abstractions if appropriate, or ensure icons are consistently sized."
          }
        ],
        patterns: [
          {
            group: ["*/components/ui/*"],
            message: "UI components have moved to @core/ui. Please import from there."
          }
        ]
      }]
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**", ".next/**", "**/.turbo/**", "**/coverage/**"],
  },
]

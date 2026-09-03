import js from "@eslint/js"
import pluginNext from "@next/eslint-plugin-next"
import eslintConfigPrettier from "eslint-config-prettier"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"
import unusedImports from "eslint-plugin-unused-imports"
import pluginZustand from "eslint-plugin-zustand"

import { config as baseConfig } from "./base.js"

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
      "unused-imports": unusedImports,
      zustand: pluginZustand,
    },
    settings: { react: { version: "detect" } },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      ...pluginReactHooks.configs.recommended.rules,
      "zustand/no-destructure": "warn",
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-comment-textnodes": "off",
      "@next/next/no-img-element": "off",
      "react/jsx-max-depth": ["warn", { max: 6 }],
      "max-lines": ["warn", 400],
    },
  },
  {
    files: ["**/components/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@views/*", "**/views/*", "**/app/*"],
              message:
                "Architectural Boundary Violation: reusable components must NOT import from @views or app routing layers.",
            },
            {
              group: [
                "@/components/ui/legacy-visual-*",
                "@/lib/legacy-visual-*",
                "**/legacy-visual-*",
              ],
              message:
                "Semantic Naming Violation: Do not use legacy visual import paths. Use canonical packages (@workspace/ui, @workspace/hooks, @workspace/error).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/components/**", "**/views/**", "**/app/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Identifier[name=/^(HUD_TOKENS|HudAccentColor|HudPanelLevel|HUDPanel|HUDBreadcrumb|HUDResourceTable|HUDErrorBoundary|useHUDModal)$/]",
          message:
            "Enterprise Semantic Violation: Do not use legacy HUD_* naming. Use clean Enterprise UI variants (e.g. THEME_TOKENS, Panel, Breadcrumb, ResourceTable, ErrorBoundary, useModal).",
        },
        {
          selector:
            "VariableDeclarator[id.name=/^(mock|fake|dummy|MOCK|FAKE|DUMMY).*/i] > ArrayExpression",
          message:
            "Architecture Violation: Do not hardcode mockup arrays inside UI components. Use @moon/client typed helpers and useResource.",
        },
      ],
    },
  },
]

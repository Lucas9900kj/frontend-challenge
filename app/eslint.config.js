
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "public/mockServiceWorker.js",
    "playwright-report",
    "test-results",
    "coverage",
  ]),

  {
    files: ["**/*.{ts,tsx}"],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
    },
  },

  // Componentes shadcn/ui exportam variantes de estilos.
  // Isso é esperado e não precisa bloquear o ESLint.
  {
    files: [
      "src/components/ui/button.tsx",
      "src/components/ui/badge.tsx",
    ],

    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
]);

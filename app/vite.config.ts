import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    clearMocks: true,

    // Vitest executa somente os testes unitários.
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],

    // Playwright executa os testes E2E separadamente.
    exclude: [
      "node_modules/**",
      "dist/**",
      "e2e/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
});

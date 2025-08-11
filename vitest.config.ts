import { defineConfig } from "vitest/config"
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.tsx"],
    globals: true,
    css: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
})


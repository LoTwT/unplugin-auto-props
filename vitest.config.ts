import { fileURLToPath, URL } from "node:url"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ["vitest"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    coverage: {
      enabled: true,
      include: ["ast", "generate", "transform", "utils"].map(
        (n) => `src/core/${n}.ts`,
      ),
    },
  },
})

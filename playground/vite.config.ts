import path from "node:path"
import { fileURLToPath } from "node:url"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { defineConfig } from "vite"
// import AutoProps from "unplugin-auto-props/vite"
import AutoProps from "../src/vite"

const _dirname = fileURLToPath(new URL(".", import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoProps({
      tsconfigPath: path.resolve(_dirname, "tsconfig.app.json"),
    }),
  ],
})

import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { build } from "vite"

export async function getTransformCode(ids: string[]) {
  const transformCodes: Record<string, string> = {}

  if (!ids.length) return transformCodes

  await build({
    plugins: [
      vue(),
      vueJsx(),
      {
        name: "vite:get-transform-code",
        transform(code, id) {
          transformCodes[id] = code.replaceAll("/* @__PURE__ */ ", "")
        },
      },
    ],
    build: {
      rollupOptions: {
        input: ids,
        external: ["vue"],
        output: {
          format: "es",
        },
      },
    },
  })

  return transformCodes
}

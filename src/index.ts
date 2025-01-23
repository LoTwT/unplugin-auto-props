import type { UnpluginFactory } from "unplugin"
import type { MetaCheckerOptions } from "vue-component-meta"
import type { Options } from "./types"
import { resolve } from "node:path"
import { cwd } from "node:process"
// import { fileURLToPath } from "node:url"
import { createUnplugin } from "unplugin"
import { createChecker } from "vue-component-meta"
import { transformDefineComponent } from "./core/transform"

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options,
) => {
  // const _dirname = fileURLToPath(new URL(".", import.meta.url))

  const tsconfigPath = options?.tsconfigPath || resolve(cwd(), "tsconfig.json")

  const checkerOptions: MetaCheckerOptions = options?.checkerOptions || {}

  const checker = createChecker(tsconfigPath, checkerOptions)
  return {
    name: "unplugin-auto-props",
    async transform(code, id) {
      if (id.endsWith(".tsx") || id.endsWith(".ts")) {
        const s = await transformDefineComponent(code, id, checker)

        if (!s) return

        return {
          code: s.toString(),
          map: s.generateMap(),
        }
      }
    },
    vite: {
      async handleHotUpdate({ file, read, server }) {
        if (file.endsWith(".tsx") || file.endsWith(".ts")) {
          const newCode = await read()

          checker.updateFile(file, newCode)

          server.ws.send({ type: "full-reload", path: "*" })
        }
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

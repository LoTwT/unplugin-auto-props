import type { UnpluginFactory } from "unplugin"
import type { MetaCheckerOptions } from "vue-component-meta"
import type { Options } from "./types"
import { resolve } from "node:path"
import { cwd } from "node:process"
import { Lang, parseAsync } from "@ast-grep/napi"
// import { fileURLToPath } from "node:url"
import MagicString from "magic-string"
import { createUnplugin } from "unplugin"
import { createChecker } from "vue-component-meta"
import { generatePropsDefinition, mapRuntimeProp } from "./core/utils"

const EXTERNAL_PROPS = ["key", "ref", "ref_for", "ref_key", "class", "style"]

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
        const astRoot = (await parseAsync(Lang.JavaScript, code)).root()
        const defaultExport = astRoot.find(`export default $DEFAULT_EXPORT`)

        if (!defaultExport) return

        const compVariable = defaultExport.getMatch("DEFAULT_EXPORT")!.text()

        const meta = checker.getComponentMeta(id)

        const props = meta.props
          .filter((prop) => !EXTERNAL_PROPS.includes(prop.name))
          .reduce<Record<string, any>>((res, prop) => {
            res[prop.name] = mapRuntimeProp(prop)
            return res
          }, {})

        const propsDefinition = generatePropsDefinition(compVariable, props)

        const s = new MagicString(code)

        s.appendLeft(defaultExport.range().start.index, propsDefinition)

        return {
          code: s.toString(),
          map: s.generateMap(),
        }
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

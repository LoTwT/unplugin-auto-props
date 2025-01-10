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
import { COMPONENT_OPTION_KEYS, EXTERNAL_META_PROPS } from "./core/constants"
import { generatePropsDefinition } from "./core/generate"
import { mapRuntimeProp } from "./core/utils"

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

        const componentOptionNode = astRoot.find({
          rule: {
            all: [
              {
                kind: "object",
              },
              {
                inside: {
                  kind: "variable_declarator",
                  has: {
                    kind: "identifier",
                    regex: compVariable,
                  },
                  stopBy: "end",
                },
              },
              {
                nthChild: 2,
              },
            ],
          },
        })

        if (
          componentOptionNode?.find({
            rule: {
              kind: "pair",
              has: {
                field: "key",
                regex: COMPONENT_OPTION_KEYS.PROPS,
              },
            },
          })
        ) {
          return
        }

        const meta = checker.getComponentMeta(id)

        const props = meta.props
          .filter((prop) => !EXTERNAL_META_PROPS.includes(prop.name))
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

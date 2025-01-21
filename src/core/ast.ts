import type { SgNode } from "@ast-grep/napi"
import type { Kinds, TypesMap } from "@ast-grep/napi/types/staticTypes"
import { Lang, parseAsync } from "@ast-grep/napi"
import { DEFINE_COMPONENT } from "./constants"

export async function parseJavaScript(code: string) {
  const astRoot = (await parseAsync(Lang.JavaScript, code)).root()
  return astRoot
}

export function getDefaultExport(node: SgNode<TypesMap, Kinds<TypesMap>>) {
  const defaultExportNode = node.find({
    rule: {
      pattern: "export default $DEFAULT_EXPORT",
      has: {
        field: "value",
        kind: "identifier",
      },
    },
  })
  const defaultExportVariableNode =
    defaultExportNode?.getMatch("DEFAULT_EXPORT") || null
  return {
    defaultExportNode,
    defaultExportVariableNode,
  }
}

export function getComponentDefinition(
  node: SgNode<TypesMap, Kinds<TypesMap>>,
  compVariable: string,
) {
  const componentDefinitionNode = node.find(
    `const ${compVariable} = ${DEFINE_COMPONENT}($FUNC,$OPTION)`,
  )

  const componentOptionNode =
    componentDefinitionNode?.getMatch("OPTION") || null

  return {
    componentDefinitionNode,
    componentOptionNode,
  }
}

export function getPair(
  node: SgNode<TypesMap, Kinds<TypesMap>>,
  keyRegex: string,
) {
  const pairNode = node.find({
    rule: {
      kind: "pair",
      all: [
        {
          has: {
            field: "key",
            regex: keyRegex,
          },
        },
        {
          has: {
            field: "value",
            pattern: "$VALUE",
          },
        },
      ],
    },
  })
  const pairValueNode = pairNode?.getMatch("VALUE") || null

  return {
    pairNode,
    pairValueNode,
  }
}

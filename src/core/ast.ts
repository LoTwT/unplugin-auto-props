import type { SgNode } from "@ast-grep/napi"
import type { Kinds, TypesMap } from "@ast-grep/napi/types/staticTypes"
import { Lang, parseAsync } from "@ast-grep/napi"
import { DEFINE_COMPONENT } from "./constants"

export async function parseJavaScript(code: string) {
  const astRoot = (await parseAsync(Lang.JavaScript, code)).root()
  return astRoot
}

export function getDefaultExport(node: SgNode<TypesMap, Kinds<TypesMap>>) {
  const defaultExportNode = node.find(`export default $DEFAULT_EXPORT`)
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
  const pairNode = node.find(`{${keyRegex}:$VALUE}`)
  const pairValueNode = pairNode?.getMatch("VALUE") || null

  return {
    pairNode,
    pairValueNode,
  }
}

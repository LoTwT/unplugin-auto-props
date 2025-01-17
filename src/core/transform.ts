import type { MetaChecker } from "./types"
import MagicString from "magic-string"
import {
  getComponentDefinition,
  getDefaultExport,
  getPair,
  parseJavaScript,
} from "./ast"
import { COMPONENT_OPTION_KEYS, EXTERNAL_META_PROPS } from "./constants"
import { generatePropsDefinition } from "./generate"
import { mapRuntimeProp } from "./utils"

export async function transformDefineComponent(
  code: string,
  id: string,
  checker: MetaChecker,
): Promise<MagicString | null> {
  const astRoot = await parseJavaScript(code)

  const { defaultExportNode, defaultExportVariableNode } =
    getDefaultExport(astRoot)

  if (!defaultExportNode || !defaultExportVariableNode) return null

  const defaultExportVariable = defaultExportVariableNode.text()

  const { componentDefinitionNode, componentOptionNode } =
    getComponentDefinition(astRoot, defaultExportVariable)

  if (componentDefinitionNode && componentOptionNode) {
    const { pairNode: propsNode } = getPair(
      componentOptionNode,
      COMPONENT_OPTION_KEYS.PROPS,
    )

    // TODO: incrementally update props
    if (propsNode) return null
  }

  const meta = checker.getComponentMeta(id)

  const props = meta.props
    .filter((prop) => !EXTERNAL_META_PROPS.includes(prop.name))
    .reduce<Record<string, any>>((res, prop) => {
      res[prop.name] = mapRuntimeProp(prop)
      return res
    }, {})

  const propsDefinition = generatePropsDefinition(defaultExportVariable, props)

  const s = new MagicString(code)

  s.appendLeft(defaultExportNode.range().start.index, propsDefinition)

  return s
}

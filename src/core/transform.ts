import type { MetaChecker } from "./types"
import MagicString from "magic-string"
import {
  getComponentDefinition,
  getDefaultExport,
  getPair,
  parseJavaScript,
} from "./ast"
import { COMPONENT_OPTION_KEYS, EXTERNAL_META_PROPS } from "./constants"
import { generateEmitsDefinition, generatePropsDefinition } from "./generate"
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

  let hasPropsNode = false
  let hasEmitsNode = false

  if (componentDefinitionNode && componentOptionNode) {
    const { pairNode: propsNode } = getPair(
      componentOptionNode,
      COMPONENT_OPTION_KEYS.PROPS,
    )

    const { pairNode: emitsNode } = getPair(
      componentOptionNode,
      COMPONENT_OPTION_KEYS.EMITS,
    )

    // TODO: incrementally update props
    if (propsNode) hasPropsNode = true

    if (emitsNode) hasEmitsNode = true
  }

  const meta = checker.getComponentMeta(id)

  const props = meta.props
    .filter((prop) => !EXTERNAL_META_PROPS.includes(prop.name))
    .reduce<Record<string, any>>((res, prop) => {
      res[prop.name] = mapRuntimeProp(prop)
      return res
    }, {})

  const emits = meta.events.map((event) => event.name)

  const needPropsDefinition = !hasPropsNode && Object.keys(props).length > 0
  const needEmitsDefinition = !hasEmitsNode && emits.length > 0

  if (!needPropsDefinition && !needEmitsDefinition) return null

  const s = new MagicString(code)

  if (needPropsDefinition) {
    const propsDefinition = generatePropsDefinition(
      defaultExportVariable,
      props,
    )

    s.appendLeft(defaultExportNode.range().start.index, propsDefinition)
  }

  if (needEmitsDefinition) {
    const emitsDefinition = generateEmitsDefinition(
      defaultExportVariable,
      emits,
    )

    s.appendLeft(defaultExportNode.range().start.index, emitsDefinition)
  }

  return s
}

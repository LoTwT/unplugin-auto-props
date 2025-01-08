import type { PropertyMeta } from "vue-component-meta"

export function generatePropsDefinition(
  compVariable: string,
  props: Record<string, any>,
) {
  return `Object.defineProperty(${compVariable}, "props", ${JSON.stringify({ value: props }, null, 2).replaceAll('"', "")});\n`
}

export interface MappedRuntimeProp {
  /**
   * String | Number | Boolean | Array | Object | Date | Function | Symbol | Error
   */
  type: string
  required?: boolean
}

export function mapRuntimeProp(prop: PropertyMeta): MappedRuntimeProp {
  const type = prop.required ? prop.type : prop.type.replace(" | undefined", "")

  return {
    type: `${type[0].toUpperCase()}${type.slice(1)}`,
    required: prop.required,
  }
}

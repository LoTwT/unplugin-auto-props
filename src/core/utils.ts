import type { PropertyMeta } from "vue-component-meta"

export interface MappedRuntimeProp {
  /**
   * String | Number | Boolean | Array | Object | Date | Function | Symbol | Error
   */
  type: string
  required: boolean
}

export function mapRuntimeProp(prop: PropertyMeta): MappedRuntimeProp {
  const type = prop.type.replace(" | undefined", "")

  return {
    type: `${type[0].toUpperCase()}${type.slice(1)}`,
    required: prop.required,
  }
}

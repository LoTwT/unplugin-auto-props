import type { PropertyMeta } from "vue-component-meta"
import type { MappedRuntimeProp } from "./types"

export function mapRuntimeProp(prop: PropertyMeta): MappedRuntimeProp {
  const type = prop.type.replace(" | undefined", "")

  return {
    type: `${type[0].toUpperCase()}${type.slice(1)}`,
    required: prop.required,
  }
}

import type { createChecker } from "vue-component-meta"

export interface MappedRuntimeProp {
  /**
   * String | Number | Boolean | Array | Object | Date | Function | Symbol | Error
   */
  type: string
  required: boolean
}

export type MetaChecker = ReturnType<typeof createChecker>

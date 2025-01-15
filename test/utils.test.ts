import type { PropertyMeta } from "vue-component-meta"
import { mapRuntimeProp } from "../src/core/utils"

describe("utils", () => {
  describe("mapRuntimeProp", () => {
    it("should map runtime prop", () => {
      const prop = {
        type: "string",
        required: true,
      } as PropertyMeta

      const mapped = mapRuntimeProp(prop)
      expect(mapped).toEqual({
        type: "String",
        required: true,
      })
    })

    it("should map runtime prop without required", () => {
      const prop = {
        type: "string | undefined",
        required: false,
      } as PropertyMeta

      const mapped = mapRuntimeProp(prop)
      expect(mapped).toEqual({
        type: "String",
        required: false,
      })
    })
  })
})

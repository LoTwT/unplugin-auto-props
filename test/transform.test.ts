import type { MetaChecker } from "../src/core/types"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createChecker } from "vue-component-meta"
import { transformDefineComponent } from "../src/core/transform"
import { getTransformCode } from "./helpers/get-transform-code"

describe("transform", () => {
  const _dirname = fileURLToPath(new URL(".", import.meta.url))

  let checker: MetaChecker
  let codesTransformed: Awaited<ReturnType<typeof getTransformCode>>
  let codesNotTransformed: Awaited<ReturnType<typeof getTransformCode>>

  beforeAll(async () => {
    const tsconfigPath = resolve(_dirname, "./__fixtures__/tsconfig.json")
    checker = createChecker(tsconfigPath, {})

    const idsShouldTransformed = ["base.tsx"].map((id) =>
      resolve(_dirname, "__fixtures__", id),
    )

    const idsShouldNotTransformed = ["base-has-options.tsx"].map((id) =>
      resolve(_dirname, "__fixtures__", id),
    )

    const transformResults = await Promise.all([
      getTransformCode(idsShouldTransformed),
      getTransformCode(idsShouldNotTransformed),
    ])

    codesTransformed = transformResults[0]

    codesNotTransformed = transformResults[1]
  })

  describe("transformDefineComponent", () => {
    it("should transform defineComponent", async () => {
      const codes = await Promise.all(
        Object.entries(codesTransformed).map(async ([id, code]) => {
          const s = await transformDefineComponent(code, id, checker)
          return s?.toString()
        }),
      )

      expect(codes.map((c) => c?.includes("Object.defineProperty"))).toEqual([
        true,
      ])

      expect(codes).toMatchSnapshot()
    })

    it("should not transform defineComponent with options", async () => {
      const codes = await Promise.all([
        transformDefineComponent("", "virtual-no-export-default.ts", checker),
        ...Object.entries(codesNotTransformed).map(async ([id, code]) => {
          const s = await transformDefineComponent(code, id, checker)
          return s?.toString()
        }),
      ])

      expect(codes).toEqual([null, undefined])
    })
  })
})

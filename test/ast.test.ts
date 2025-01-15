import {
  getComponentDefinition,
  getDefaultExport,
  getPair,
  parseJavaScript,
} from "../src/core/ast"

describe("ast", () => {
  describe("parseJavaScript", () => {
    it("should parse JavaScript code", async () => {
      const node = await parseJavaScript("const a = 1")
      expect(node).toBeDefined()
      expect(node.text()).toBe("const a = 1")
    })
  })

  describe("getDefaultExport", () => {
    it("should get default export", async () => {
      const node = await parseJavaScript("export default foo")
      const { defaultExportNode, defaultExportVariableNode } =
        getDefaultExport(node)
      expect(defaultExportNode).toBeDefined()
      expect(defaultExportVariableNode?.text()).toBe("foo")
    })

    it("should return null if no default export", async () => {
      const node = await parseJavaScript("export const foo = 1")
      const { defaultExportNode, defaultExportVariableNode } =
        getDefaultExport(node)
      expect(defaultExportNode).toBeNull()
      expect(defaultExportVariableNode).toBeNull()
    })
  })

  describe("getComponentDefinition", () => {
    it("should get component definition", async () => {
      const node = await parseJavaScript(
        `const comp = defineComponent(() => {}, { props: { a: String } })`,
      )
      const { componentDefinitionNode, componentOptionNode } =
        getComponentDefinition(node, "comp")
      expect(componentDefinitionNode).toBeDefined()
      expect(componentOptionNode).toBeDefined()
      expect(componentOptionNode?.text()).toBe("{ props: { a: String } }")
    })

    it("should return null if no component definition", async () => {
      const node = await parseJavaScript(
        `const comp = defineComponent(() => {})`,
      )
      const { componentDefinitionNode, componentOptionNode } =
        getComponentDefinition(node, "comp")
      expect(componentDefinitionNode).toBeNull()
      expect(componentOptionNode).toBeNull()
    })
  })

  describe("getPair", () => {
    it("should get pair", async () => {
      const node = await parseJavaScript("const a = { b: 1 }")
      const { pairNode, pairValueNode } = getPair(node, "b")
      expect(pairNode).toBeDefined()
      expect(pairValueNode?.text()).toBe("1")
    })

    it("should return null if no pair", async () => {
      const node = await parseJavaScript("const a = { b: 1 }")
      const { pairNode, pairValueNode } = getPair(node, "c")
      expect(pairNode).toBeNull()
      expect(pairValueNode).toBeNull()
    })

    it("should work with getComponentDefinition", async () => {
      const node = await parseJavaScript(
        `const comp = defineComponent(() => {}, { props: { a: String } })`,
      )
      const { componentOptionNode } = getComponentDefinition(node, "comp")
      const { pairNode, pairValueNode } = getPair(componentOptionNode!, "props")
      expect(pairNode).toBeDefined()
      expect(pairValueNode?.text()).toBe("{ a: String }")
      const { pairNode: pairNode2, pairValueNode: pairValueNode2 } = getPair(
        componentOptionNode!,
        "emits",
      )
      expect(pairNode2).toBeNull()
      expect(pairValueNode2).toBeNull()
    })
  })
})

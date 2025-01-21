import {
  generateEmitsDefinition,
  generatePropsDefinition,
} from "../src/core/generate"

describe("generate", () => {
  describe("generatePropsDefinition", () => {
    it("should generate props definition", () => {
      const propsDefinition = generatePropsDefinition("comp", {
        foo: { type: "String", required: true },
        disabled: { type: "Boolean", required: false },
      })

      expect(propsDefinition).toMatchInlineSnapshot(`
        "Object.defineProperty(comp, "props", {
          value: {
            foo: {
              type: String,
              required: true
            },
            disabled: {
              type: Boolean,
              required: false
            }
          }
        });
        "
      `)
    })
  })

  describe("generateEmitsDefinition", () => {
    it("should generate emits definition", () => {
      const emitsDefinition = generateEmitsDefinition("comp", ["foo", "bar"])

      expect(emitsDefinition).toMatchInlineSnapshot(`
        "Object.defineProperty(comp, "emits", {
          "value": [
            "foo",
            "bar"
          ]
        });
        "
      `)
    })
  })
})

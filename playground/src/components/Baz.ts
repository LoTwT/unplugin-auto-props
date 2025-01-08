import { defineComponent, h } from "vue"

interface BazProps {
  baz: string
  disabled?: boolean
}

const Baz = defineComponent<BazProps>({
  setup(props) {
    return () =>
      h(
        "div",
        {},
        `Baz: ${props.baz} - ${props.disabled} - ${typeof props.disabled}`,
      )
  },
})

export default Baz

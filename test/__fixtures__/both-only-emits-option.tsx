import { defineComponent } from "vue"

interface PropCompProps {
  foo: string
  disabled?: boolean
}

const PropComp = defineComponent<
  PropCompProps, // @ts-expect-error will fix in the future vue
  {
    click: [v: MouseEvent]
  }
>(
  (props, { emit }) =>
    () => (
      <button onClick={(e) => emit("click", e)}>
        Foo: {props.foo} - {props.disabled?.toString()} -{" "}
        {typeof props.disabled}
      </button>
    ),
  {
    emits: ["click"],
  },
)

export default PropComp

import { defineComponent } from "vue"

interface BothCompProps {
  foo: string
  disabled?: boolean
}

const BothComp = defineComponent<
  BothCompProps, // @ts-expect-error will fix in the future vue
  {
    click: [v: MouseEvent]
  }
>((props, { emit }) => () => (
  <button onClick={(e) => emit("click", e)}>
    Foo: {props.foo} - {props.disabled?.toString()} - {typeof props.disabled}
  </button>
))

export default BothComp

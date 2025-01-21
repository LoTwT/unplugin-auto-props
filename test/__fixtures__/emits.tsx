import { defineComponent } from "vue"

const EmitsComp = defineComponent<
  object,
  // @ts-expect-error will fix in the future vue
  {
    click: [v: MouseEvent]
  }
>((_, { emit }) => () => <button onClick={(e) => emit("click", e)}>Foo</button>)

export default EmitsComp

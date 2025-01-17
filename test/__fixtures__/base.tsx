import { defineComponent } from "vue"

interface FooProps {
  foo: string
  disabled?: boolean
}

const Foo = defineComponent((props: FooProps) => () => (
  <div>
    Foo: {props.foo} - {props.disabled?.toString()} - {typeof props.disabled}
  </div>
))

export default Foo

import { defineComponent } from "vue"

interface PropsCompProps {
  foo: string
  disabled?: boolean
}

const PropsComp = defineComponent<PropsCompProps>((props) => () => (
  <div>
    Foo: {props.foo} - {props.disabled?.toString()} - {typeof props.disabled}
  </div>
))

export default PropsComp

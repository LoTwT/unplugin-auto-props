import { defineComponent } from "vue"

interface BarProps {
  bar: string
}

export default defineComponent<BarProps>((props) => () => (
  <div>Bar: {props.bar}</div>
))

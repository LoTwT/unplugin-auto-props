export function generatePropsDefinition(
  compVariable: string,
  props: Record<string, any>,
) {
  return `Object.defineProperty(${compVariable}, "props", ${JSON.stringify({ value: props }, null, 2).replaceAll('"', "")});\n`
}

export function generateEmitsDefinition(compVariable: string, emits: string[]) {
  return `Object.defineProperty(${compVariable}, "emits", ${JSON.stringify({ value: emits }, null, 2)});\n`
}

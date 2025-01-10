export function generatePropsDefinition(
  compVariable: string,
  props: Record<string, any>,
) {
  return `Object.defineProperty(${compVariable}, "props", ${JSON.stringify({ value: props }, null, 2).replaceAll('"', "")});\n`
}

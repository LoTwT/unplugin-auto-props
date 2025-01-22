# unplugin-auto-props

[![NPM version](https://img.shields.io/npm/v/unplugin-auto-props?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-auto-props)

`unplugin-auto-props` registers props based on TypeScript types for components written in using `defineComponent`.

Before:

```tsx
import { defineComponent } from "vue"

interface Props {
  foo: string
}

interface Emits {
  update: [v: string]
}

// @ts-expect-error the generic param Emits supports named tuple syntax actually, it will fix in the future vue
const Foo = defineComponent<Props, Emits>(
  (props) => () => <div>{props.foo}</div>,
  {
    props: {
      foo: {
        type: String,
      },
    }, // 👈 You need to manually specify the props :(
    emits: ["update"], // 👈 You need to manually specify the emits :(
  },
)

export default Foo
```

After:

```tsx
import { defineComponent } from "vue"

interface Props {
  foo: string
}

interface Emits {
  update: [v: string]
}

// @ts-expect-error the generic param Emits supports named tuple syntax actually, it will fix in the future vue
const Foo = defineComponent<Props, Emits>((props) => () => (
  <div>{props.foo}</div>
))

Object.defineProperty(Foo, "props", {
  value: {
    foo: {
      type: String,
      required: true,
    },
  },
}) // 👈 This plugin will do it for you!

Object.defineProperty(Foo, "emits", {
  value: ["update"],
}) // 👈 This plugin will do it for you!

export default Foo
```

## Install

```bash
pnpm add -D unplugin-auto-props
```

<details open>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import AutoProps from "unplugin-auto-props/vite"

export default defineConfig({
  plugins: [
    AutoProps({
      /* options */
    }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import AutoProps from "unplugin-auto-props/rollup"

export default {
  plugins: [
    AutoProps({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("unplugin-auto-props/webpack")({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    [
      "unplugin-auto-props/nuxt",
      {
        /* options */
      },
    ],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require("unplugin-auto-props/webpack")({
        /* options */
      }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from "esbuild"
import AutoProps from "unplugin-auto-props/esbuild"

build({
  plugins: [AutoProps()],
})
```

<br></details>

### Options

```ts
import type { MetaCheckerOptions } from "vue-component-meta"

export interface Options {
  tsconfigPath?: string
  checkerOptions?: MetaCheckerOptions
}
```

## Thanks ♥️

- [so1ve/vue.ts](https://github.com/so1ve/vue.ts)
- [vuejs/language-tools](https://github.com/vuejs/language-tools)
- [volarjs/volar.js](https://github.com/volarjs/volar.js)

## LICENSE

MIT

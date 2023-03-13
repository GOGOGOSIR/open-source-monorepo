import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { PluginOption } from 'vite'
import { version } from './package.json'

function initPlugins() {
  const res: PluginOption[] = [
    tsconfigPaths(),
    dts({
      outputDir: 'dist/types',
    }),
  ]

  return res
}

export default defineConfig(() => {
  return {
    publicDir: false,
    clearScreen: false,
    define: {
      __VERSION__: JSON.stringify(version),
    },
    build: {
      outDir: 'dist',
      modulePreload: false,
      minify: true,
      lib: {
        entry: resolve(__dirname, 'core/index.ts'),
        formats: ['es', 'cjs', 'iife'],
        fileName: (format, entryName) => {
          const fileNameMap = {
            iife: `${entryName}.iife.js`,
            cjs: `${entryName}.cjs`,
            es: `${entryName}.mjs`,
          }
          return fileNameMap[format]
        },
        name: 'EricWanUse',
      },
      rollupOptions: {
        output: {
          globals: {
            vue: 'Vue',
          },
        },
        external: ['vue'],
      },
    },
    plugins: initPlugins(),
  }
})

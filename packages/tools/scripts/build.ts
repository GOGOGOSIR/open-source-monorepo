import { join, resolve } from 'node:path'
import consola from 'consola'
import { execaSync } from 'execa'
import fg from 'fast-glob'
import fs from 'fs-extra'

const dir = resolve(__dirname, '../core')
const ignoreDieName: string[] = []

async function updateImport() {
  const files = await fg('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignoreDieName,
    ],
  })

  const exportFiles = files
  exportFiles.sort()
  const imports = exportFiles.map(name => `export * from './${name}'`)

  await fs.writeFile(join(dir, 'index.ts'), `${imports.join('\n')}\n`)
}

async function build() {
  consola.info('生成import')
  await updateImport()
  consola.info('正在打包')
  execaSync('vite', ['build', '--config', 'vite.config.ts'], { stdio: 'inherit' })
}

async function main() {
  try {
    await build()
  }
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()

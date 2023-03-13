import consola from 'consola'
import { execaSync } from 'execa'

async function build() {
  consola.info('正在打包')
  execaSync('vite', ['build', '--config', 'vite.config.ts'], { stdio: 'inherit' })
  consola.info('正在打包样式')
  execaSync('pnpm', ['run', 'build:style'], { stdio: 'inherit' })
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

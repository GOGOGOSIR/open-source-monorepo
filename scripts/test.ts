import {

  getPackageInfo,

  run,
  step,
} from './release-utils'

async function main() {
  const pkgName = '@eric-wan/use'

  const { pkgDirName } = getPackageInfo(pkgName)
  console.log(pkgDirName)

  step(`Building ${pkgName} ...`)
  const buildArgs = [
    '--filter',
    `./packages/${pkgDirName}`,
    'run',
    'build',
  ]
  await run('pnpm', buildArgs)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

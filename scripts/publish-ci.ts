import semver from 'semver'
import {
  args,
  getActiveVersion,
  getPackageInfo,
  publishPackage,
  run,
  step,
} from './release-utils'

async function main() {
  const tag = args._[0]

  if (!tag)
    throw new Error('No tag specified')

  const version = tag.replace(/@eric-wan\/.*@/g, '')
  const versionReg = new RegExp(`@${version}`, 'g')
  const pkgName = tag.replace(versionReg, '')

  const { currentVersion, pkgDir, pkgDirName } = getPackageInfo(pkgName)
  if (currentVersion !== version) {
    throw new Error(
      `Package version from tag "${version}" mismatches with current version "${currentVersion}"`,
    )
  }

  const activeVersion = await getActiveVersion(pkgName)

  step(`Building ${pkgName} ...`)
  if (['tools'].includes(pkgDirName)) {
    await run('pnpm', [
      '--filter',
      './packages/use',
      'run',
      'build',
    ])
  }
  const buildArgs = [
    '--filter',
    `./packages/${pkgDirName}`,
    'run',
    'build',
  ]
  await run('pnpm', buildArgs)

  step('Publishing package...')
  const releaseTag = version.includes('beta')
    ? 'beta'
    : version.includes('alpha')
      ? 'alpha'
      : activeVersion && semver.lt(currentVersion, activeVersion)
        ? 'previous'
        : undefined
  await publishPackage(pkgDir, releaseTag)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

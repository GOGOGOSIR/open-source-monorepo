import semver from 'semver'
import {
  args,
  getActiveVersion,
  getPackageInfo,
  publishPackage,
  run,
  step,
} from './release-utils'

function getBuildStep() {
  const buildStep = new Map<string, { buildPkgName: string;  buildArgs: string[] }[]>()
  buildStep.set('@eric-wan/use', [
    {
      buildPkgName: '@eric-wan/use',
      buildArgs: [
        '--filter',
        './packages/use',
        'run',
        'build',
      ]
    },
  ])
  buildStep.set('@eric-wan/tools', [
    {
      buildPkgName: '@eric-wan/use',
      buildArgs: [
        '--filter',
        './packages/use',
        'run',
        'build',
      ]
    },
    {
      buildPkgName: '@eric-wan/tools',
      buildArgs: [
        '--filter',
        './packages/tools',
        'run',
        'build',
      ]
    }
  ])
  return buildStep
}

async function main() {
  const tag = args._[0]

  if (!tag) {
    throw new Error('No tag specified')
  }

  const buildStep = getBuildStep()
  const version = tag.replace(/@eric-wan\/.*@/g, '')
  const versionReg = new RegExp(`@${version}`, 'g')
  const pkgName = tag.replace(versionReg, '')

  const { currentVersion, pkgDir } = getPackageInfo(pkgName)
  if (currentVersion !== version) {
    throw new Error(
      `Package version from tag "${version}" mismatches with current version "${currentVersion}"`,
    )
  }

  const activeVersion = await getActiveVersion(pkgName)


  const steps = buildStep.get(pkgName)
  if (steps && steps.length) {
    for (const s of steps) {
      const { buildPkgName, buildArgs } =s
      step(`Building ${buildPkgName} ...`)
      await run('pnpm', buildArgs)
    }
  }

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

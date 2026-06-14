#!/usr/bin/env node

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { registryItems } from '@radcn/registry'

const CONFIG_FILE = 'components.json'

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})

async function main() {
  let { command, positional, flags } = parseArgs(process.argv.slice(2))

  if (flags.help || !command) {
    printHelp()
    return
  }

  let cwd = path.resolve(flags.cwd ?? process.cwd())

  if (command === 'init') {
    assertYes(flags)
    assertNoUnsupportedFlags(flags, ['cwd', 'yes', 'help'])
    await initProject(cwd)
    return
  }

  if (command === 'add') {
    assertYes(flags)
    assertNoUnsupportedFlags(flags, ['cwd', 'yes', 'help'])
    await addItems(cwd, positional)
    return
  }

  throw new Error(`Unsupported command '${command}'.`)
}

function parseArgs(args) {
  let [command, ...rest] = args
  let positional = []
  let flags = {}

  for (let index = 0; index < rest.length; index += 1) {
    let arg = rest[index]

    if (!arg.startsWith('--')) {
      positional.push(arg)
      continue
    }

    let [name, inlineValue] = arg.slice(2).split('=', 2)

    if (name === 'yes' || name === 'help') {
      flags[name] = true
      continue
    }

    let value = inlineValue ?? rest[index + 1]

    if (!value || value.startsWith('--')) {
      throw new Error(`Flag '--${name}' requires a value.`)
    }

    flags[name] = value

    if (inlineValue === undefined) {
      index += 1
    }
  }

  return { command, positional, flags }
}

function printHelp() {
  console.log(`Usage:
  radcn init --cwd <target> --yes
  radcn add button --cwd <target> --yes`)
}

function assertYes(flags) {
  if (!flags.yes) {
    throw new Error('This local proof requires --yes for deterministic execution.')
  }
}

function assertNoUnsupportedFlags(flags, supported) {
  for (let flag of Object.keys(flags)) {
    if (!supported.includes(flag)) {
      throw new Error(`Unsupported flag '--${flag}' in the local install-flow proof.`)
    }
  }
}

async function initProject(cwd) {
  await assertTargetProject(cwd)
  await assertTailwindV4(cwd)

  let config = {
    $schema: 'https://radcn.dev/schema/components.json',
    style: 'new-york',
    tsx: true,
    tailwind: {
      css: 'app/styles/tailwind.css',
      baseColor: 'neutral',
      cssVariables: true,
    },
    aliases: {
      components: 'app/components',
      ui: 'app/components/ui',
      utils: 'app/lib/utils',
      hooks: 'app/hooks',
    },
    registries: {
      '@radcn': 'workspace:@radcn/registry/{name}',
    },
  }

  await writeFileIfChanged(cwd, path.join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`)
}

async function addItems(cwd, names) {
  if (names.length === 0) {
    throw new Error('Specify at least one registry item to add.')
  }

  let config = await readConfig(cwd)
  await assertTargetProject(cwd)
  await assertTailwindV4(cwd)

  let orderedItems = resolveRegistryItems(names)

  for (let item of orderedItems) {
    for (let file of item.files) {
      let target = resolveTarget(cwd, config, file)
      await writeFileIfChanged(cwd, target, file.content)
    }
  }
}

async function assertTargetProject(cwd) {
  let packageJson = await readJson(path.join(cwd, 'package.json'), 'target package.json')

  if (packageJson.type !== 'module') {
    throw new Error('RadCN install-target proof requires a TypeScript ESM Remix 3 app.')
  }

  if (!hasDependency(packageJson, 'remix')) {
    throw new Error('RadCN install-target proof requires a Remix 3 target with a remix dependency.')
  }

  await fs.access(path.join(cwd, 'tsconfig.json'))
}

async function assertTailwindV4(cwd) {
  let packageJson = await readJson(path.join(cwd, 'package.json'), 'target package.json')
  let version =
    packageJson.dependencies?.tailwindcss ??
    packageJson.devDependencies?.tailwindcss ??
    packageJson.peerDependencies?.tailwindcss

  if (!version) {
    throw new Error('RadCN requires Tailwind v4 in the target project.')
  }

  if (typeof version === 'string' && !isTailwindV4Range(version)) {
    throw new Error(`RadCN requires Tailwind v4 in the target project; found '${version}'.`)
  }
}

function isTailwindV4Range(version) {
  return version === 'catalog:' || version.startsWith('^4.') || version.startsWith('~4.') || version.startsWith('4.')
}

function hasDependency(packageJson, name) {
  return Boolean(
    packageJson.dependencies?.[name] ??
      packageJson.devDependencies?.[name] ??
      packageJson.peerDependencies?.[name],
  )
}

async function readConfig(cwd) {
  let config = await readJson(path.join(cwd, CONFIG_FILE), CONFIG_FILE)

  if (config.tsx !== true) {
    throw new Error('RadCN only supports TypeScript/TSX generated output.')
  }

  for (let alias of ['components', 'ui', 'utils']) {
    if (typeof config.aliases?.[alias] !== 'string') {
      throw new Error(`components.json is missing aliases.${alias}.`)
    }
  }

  if (typeof config.tailwind?.css !== 'string') {
    throw new Error('components.json is missing tailwind.css.')
  }

  if (!config.registries?.['@radcn']) {
    throw new Error('components.json is missing the @radcn registry.')
  }

  return config
}

async function readJson(filePath, label) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch (error) {
    throw new Error(`Unable to read ${label}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function resolveRegistryItems(names) {
  let seen = new Set()
  let resolved = []

  function visit(name) {
    if (seen.has(name)) {
      return
    }

    let item = registryItems[name]

    if (!item) {
      throw new Error(`Unknown RadCN registry item '${name}'.`)
    }

    validateRegistryItem(item)
    seen.add(name)

    for (let dependency of item.registryDependencies ?? []) {
      visit(dependency)
    }

    resolved.push(item)
  }

  for (let name of names) {
    visit(name)
  }

  return resolved
}

function validateRegistryItem(item) {
  if (typeof item.name !== 'string' || item.name.length === 0) {
    throw new Error('Registry item is missing a name.')
  }

  if (typeof item.type !== 'string' || !item.type.startsWith('registry:')) {
    throw new Error(`Registry item '${item.name}' is missing a registry type.`)
  }

  if (
    item.registryDependencies !== undefined &&
    (!Array.isArray(item.registryDependencies) ||
      item.registryDependencies.some((dependency) => typeof dependency !== 'string'))
  ) {
    throw new Error(`Registry item '${item.name}' has invalid registryDependencies.`)
  }

  if (!Array.isArray(item.files) || item.files.length === 0) {
    throw new Error(`Registry item '${item.name}' must define at least one file.`)
  }

  for (let file of item.files) {
    if (typeof file.content !== 'string') {
      throw new Error(`Registry item '${item.name}' has a file without string content.`)
    }

    if (file.target !== undefined && typeof file.target !== 'string') {
      throw new Error(`Registry item '${item.name}' has a file with an invalid target.`)
    }

    if (file.targetAlias !== undefined && typeof file.targetAlias !== 'string') {
      throw new Error(`Registry item '${item.name}' has a file with an invalid targetAlias.`)
    }

    if (file.path !== undefined && typeof file.path !== 'string') {
      throw new Error(`Registry item '${item.name}' has a file with an invalid path.`)
    }

    if (!file.target && !(file.targetAlias && file.path)) {
      throw new Error(`Registry item '${item.name}' has a file without a target.`)
    }
  }
}

function resolveTarget(cwd, config, file) {
  let relativeTarget

  if (file.target) {
    relativeTarget = file.target
  } else if (file.targetAlias && file.path) {
    relativeTarget = path.join(config.aliases[file.targetAlias], file.path)
  } else {
    throw new Error(`Registry file for '${file.name ?? 'unknown'}' is missing a target.`)
  }

  let target = path.resolve(cwd, relativeTarget)
  let relative = path.relative(cwd, target)

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside target app: ${relativeTarget}`)
  }

  if (relative.split(path.sep).includes('vendor')) {
    throw new Error(`Refusing to write into vendor from target app: ${relativeTarget}`)
  }

  return target
}

async function writeFileIfChanged(cwd, filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })

  try {
    let current = await fs.readFile(filePath, 'utf8')

    if (current === content) {
      console.log(`skip ${path.relative(cwd, filePath)}`)
      return
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error
    }
  }

  await fs.writeFile(filePath, content)
  console.log(`write ${path.relative(cwd, filePath)}`)
}

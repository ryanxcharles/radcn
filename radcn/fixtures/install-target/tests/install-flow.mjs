import { spawn } from 'node:child_process'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const radcnRoot = path.resolve(new URL('../../..', import.meta.url).pathname)
const target = path.resolve(new URL('..', import.meta.url).pathname)
const cli = path.join(radcnRoot, 'packages/cli/bin/radcn.mjs')
const tailwind = path.join(
  target,
  'node_modules/.bin',
  process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss',
)

await resetGeneratedOutput()

let init = await run(process.execPath, [cli, 'init', '--cwd', target, '--yes'])
assert(init.stdout.includes('write components.json'), init.stdout)

let config = JSON.parse(await fs.readFile(path.join(target, 'components.json'), 'utf8'))
assert(config.tsx === true, 'components.json must require TSX output.')
assert(config.aliases.ui === 'app/components/ui', 'components.json must record the UI alias.')
assert(config.aliases.utils === 'app/lib/utils', 'components.json must record the utils alias.')
assert(config.tailwind.css === 'app/styles/tailwind.css', 'components.json must record Tailwind CSS path.')

let add = await run(process.execPath, [cli, 'add', 'button', '--cwd', target, '--yes'])
assert(add.stdout.includes('write app/styles/radcn-theme.css'), add.stdout)
assert(add.stdout.includes('write app/lib/utils/classes.ts'), add.stdout)
assert(add.stdout.includes('write app/components/ui/button.tsx'), add.stdout)

let rerun = await run(process.execPath, [cli, 'add', 'button', '--cwd', target, '--yes'])
assert(rerun.stdout.includes('skip app/styles/radcn-theme.css'), rerun.stdout)
assert(rerun.stdout.includes('skip app/lib/utils/classes.ts'), rerun.stdout)
assert(rerun.stdout.includes('skip app/components/ui/button.tsx'), rerun.stdout)

config.aliases.ui = '../outside'
await fs.writeFile(path.join(target, 'components.json'), `${JSON.stringify(config, null, 2)}\n`)
let unsafe = await run(process.execPath, [cli, 'add', 'button', '--cwd', target, '--yes'], {
  expectFailure: true,
})
assert(
  unsafe.stderr.includes('Refusing to write outside target app'),
  `Expected unsafe target refusal, received:\n${unsafe.stdout}\n${unsafe.stderr}`,
)

config.aliases.ui = 'app/components/ui'
await fs.writeFile(path.join(target, 'components.json'), `${JSON.stringify(config, null, 2)}\n`)

let buttonSource = await fs.readFile(path.join(target, 'app/components/ui/button.tsx'), 'utf8')
assert(buttonSource.includes("from '../../lib/utils/classes.ts'"), 'Button must import target-owned utils.')
assert(!buttonSource.includes("from 'radcn/button'"), 'Button source must not import the RadCN package Button.')

let themeSource = await fs.readFile(path.join(target, 'app/styles/radcn-theme.css'), 'utf8')
assert(themeSource.includes('@theme inline'), 'Generated theme must define Tailwind theme tokens.')

await run(tailwind, ['--input', 'app/styles/tailwind.css', '--output', 'app/assets/tailwind.generated.css'])

let css = await fs.readFile(path.join(target, 'app/assets/tailwind.generated.css'), 'utf8')
assert(css.includes('.bg-primary'), 'Tailwind output must include installed Button utilities.')

async function resetGeneratedOutput() {
  await Promise.all([
    fs.rm(path.join(target, 'components.json'), { force: true }),
    fs.rm(path.join(target, 'app/components'), { recursive: true, force: true }),
    fs.rm(path.join(target, 'app/lib'), { recursive: true, force: true }),
    fs.rm(path.join(target, 'app/styles/radcn-theme.css'), { force: true }),
    fs.rm(path.join(target, 'app/assets/tailwind.generated.css'), { force: true }),
  ])
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    let child = spawn(command, args, {
      cwd: options.cwd ?? target,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (options.expectFailure ? code !== 0 : code === 0) {
        resolve({ stdout, stderr })
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited ${code}\n${stdout}\n${stderr}`))
      }
    })
  })
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

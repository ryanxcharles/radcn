import { spawn } from 'node:child_process'

const port = 4613
const baseUrl = `http://127.0.0.1:${port}`

let server = spawn(
  process.execPath,
  ['--import', 'remix/node-tsx', 'server.ts'],
  {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
)

let output = ''
server.stdout.on('data', (chunk) => {
  output += chunk
})
server.stderr.on('data', (chunk) => {
  output += chunk
})

try {
  await waitForServer()

  let response = await fetch(baseUrl)
  let html = await response.text()

  assert(response.ok, `Expected successful response, received ${response.status}:\n${html}`)
  assert(html.includes('Installed Button'), 'Expected installed Button text in rendered HTML.')
  assert(html.includes('data-radcn-button'), 'Expected generated Button data hook in rendered HTML.')
  assert(!html.includes('radcn/button'), 'Rendered route must not expose a package Button import.')

  let css = await fetch(`${baseUrl}/assets/app/assets/tailwind.generated.css`).then((item) =>
    item.text(),
  )

  assert(css.includes('.bg-primary'), 'Expected Tailwind output to include Button bg-primary utility.')
  assert(css.includes('[data-radcn-button]') || html.includes('data-radcn-button'), 'Expected Button hook coverage.')
} finally {
  server.kill('SIGTERM')
}

async function waitForServer() {
  let startedAt = Date.now()

  while (Date.now() - startedAt < 10000) {
    if (output.includes(`Server listening on ${baseUrl}`) || output.includes('Server listening on http://localhost')) {
      return
    }

    if (server.exitCode !== null) {
      throw new Error(`Server exited before test could run:\n${output}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error(`Timed out waiting for server:\n${output}`)
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

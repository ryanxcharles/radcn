import { readFile } from 'node:fs/promises'

import { expect, test } from '@playwright/test'

const candidate = 'http://localhost:4602'
const repoRoot = new URL('../..', import.meta.url)

async function packageJson() {
  return JSON.parse(await readFile(new URL('packages/radcn/package.json', repoRoot), 'utf8')) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    exports?: Record<string, string>
  }
}

test('direction exports provider without React or Radix direction dependencies', async () => {
  let pkg = await packageJson()
  let deps = { ...pkg.dependencies, ...pkg.devDependencies }
  let source = await readFile(new URL('packages/radcn/src/components/direction.tsx', repoRoot), 'utf8')

  expect(pkg.exports?.['./direction']).toBe('./src/components/direction.tsx')
  expect(deps).not.toHaveProperty('react')
  expect(deps).not.toHaveProperty('react-dom')
  expect(deps).not.toHaveProperty('@radix-ui/react-direction')
  expect(deps).not.toHaveProperty('radix-ui')
  expect(source).toContain('export function DirectionProvider')
  expect(source).not.toContain('useDirection')
})

test('candidate direction provider renders native dir hooks alias and nested override', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/direction/ltr`)
  let provider = page.locator('[data-radcn-direction-provider]').first()
  await expect(provider).toHaveAttribute('dir', 'ltr')
  await expect(provider).toHaveAttribute('data-direction', 'ltr')
  await expect(page.locator('[data-radcn-direction-sample]').first()).toHaveCSS('direction', 'ltr')

  await page.goto(`${candidate}/fixtures/direction/rtl`)
  provider = page.locator('[data-radcn-direction-provider]').first()
  await expect(provider).toHaveAttribute('dir', 'rtl')
  await expect(provider).toHaveAttribute('data-direction', 'rtl')
  await expect(page.locator('[data-radcn-direction-sample]').first()).toHaveCSS('direction', 'rtl')

  await page.goto(`${candidate}/fixtures/direction/prop-alias`)
  await expect(page.locator('[data-radcn-direction-provider]').first()).toHaveAttribute('dir', 'rtl')

  await page.goto(`${candidate}/fixtures/direction/nested`)
  let providers = page.locator('[data-radcn-direction-provider]')
  await expect(providers.nth(0)).toHaveAttribute('dir', 'rtl')
  await expect(providers.nth(1)).toHaveAttribute('dir', 'ltr')
  await expect(page.locator('[data-radcn-direction-sample]').nth(1)).toHaveCSS('direction', 'ltr')
})

test('candidate direction exposes custom token hook', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/direction/custom-token`)
  let provider = page.locator('[data-radcn-direction-provider]').first()
  await expect(provider).toHaveClass(/radcn-fixture-custom-direction/)
  await expect(provider).toHaveCSS('background-color', 'rgb(240, 253, 250)')
})

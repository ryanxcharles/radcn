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

test('application shell exports resizable and sidebar without forbidden dependencies', async () => {
  let pkg = await packageJson()
  let deps = { ...pkg.dependencies, ...pkg.devDependencies }
  expect(pkg.exports?.['./resizable']).toBe('./src/components/resizable.tsx')
  expect(pkg.exports?.['./sidebar']).toBe('./src/components/sidebar.tsx')
  expect(deps).not.toHaveProperty('react-resizable-panels')
  expect(deps).not.toHaveProperty('react')
  expect(deps).not.toHaveProperty('react-dom')
  expect(deps).not.toHaveProperty('class-variance-authority')
  expect(deps).not.toHaveProperty('@radix-ui/react-slot')
})

test('candidate resizable exposes semantics pointer keyboard orientation and tokens', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/resizable/default`)
  let group = page.locator('[data-radcn-resizable-panel-group]')
  let handle = page.getByRole('separator', { name: 'Resize panels' })
  await expect(group).toHaveAttribute('data-orientation', 'horizontal')
  await expect(handle).toHaveAttribute('aria-orientation', 'horizontal')
  await expect(handle).toHaveAttribute('aria-valuenow', '50')

  await group.evaluate((node) => {
    node.addEventListener('radcn-resizable-change', (event) => {
      let detail = (event as CustomEvent).detail
      node.setAttribute('data-last-resize-index', String(detail.index))
      node.setAttribute('data-last-resize-size', String(detail.sizes[0]))
    })
  })
  await handle.focus()
  await page.keyboard.press('ArrowRight')
  await expect(handle).toHaveAttribute('aria-valuenow', '55')
  await expect(group).toHaveAttribute('data-last-resize-index', '0')
  await expect(group).toHaveAttribute('data-last-resize-size', '55')

  await page.goto(`${candidate}/fixtures/resizable/vertical`)
  await expect(page.getByRole('separator', { name: 'Resize panels' })).toHaveAttribute('aria-orientation', 'vertical')

  await page.goto(`${candidate}/fixtures/resizable/with-handle`)
  await expect(page.locator('[data-radcn-resizable-handle-grip]')).toBeVisible()

  await page.goto(`${candidate}/fixtures/resizable/custom-token`)
  await expect(page.locator('[data-radcn-resizable-panel-group]')).toHaveClass(/radcn-fixture-custom-resizable/)
  await expect(page.locator('[data-radcn-resizable-panel-group]')).toHaveCSS('background-color', 'rgb(240, 253, 250)')
})

test('candidate resizable covers named upstream examples', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/resizable/demo`)
  let groups = page.locator('[data-radcn-resizable-panel-group]')
  let handles = page.locator('[data-radcn-resizable-handle]')
  await expect(groups).toHaveCount(2)
  await expect(handles).toHaveCount(2)
  await expect(page.locator('[data-radcn-resizable-handle-grip]')).toHaveCount(0)
  await expect(page.getByText('One')).toBeVisible()
  await expect(page.getByText('Two')).toBeVisible()
  await expect(page.getByText('Three')).toBeVisible()
  await expect(groups.nth(0)).toHaveAttribute('data-orientation', 'horizontal')
  await expect(groups.nth(1)).toHaveAttribute('data-orientation', 'vertical')
  await expect(groups.nth(0).locator(':scope > [data-radcn-resizable-panel]').nth(0)).toHaveAttribute('data-size', '50')
  await expect(groups.nth(0).locator(':scope > [data-radcn-resizable-panel]').nth(1)).toHaveAttribute('data-size', '50')
  await expect(groups.nth(1).locator(':scope > [data-radcn-resizable-panel]').nth(0)).toHaveAttribute('data-size', '25')
  await expect(groups.nth(1).locator(':scope > [data-radcn-resizable-panel]').nth(1)).toHaveAttribute('data-size', '75')
  await expect(groups.nth(0).locator(':scope > [data-radcn-resizable-handle]')).toHaveCount(1)
  await expect(groups.nth(1).locator(':scope > [data-radcn-resizable-handle]')).toHaveCount(1)
  await expect(groups.nth(0).locator(':scope > [data-radcn-resizable-handle]')).toHaveAttribute('aria-orientation', 'horizontal')
  await expect(groups.nth(1).locator(':scope > [data-radcn-resizable-handle]')).toHaveAttribute('aria-orientation', 'vertical')

  let outer = groups.nth(0)
  let nested = groups.nth(1)
  await outer.evaluate((node) => {
    node.addEventListener('radcn-resizable-change', () => {
      node.setAttribute('data-resized', 'outer')
    })
  })
  await nested.evaluate((node) => {
    node.addEventListener('radcn-resizable-change', (event) => {
      event.stopPropagation()
      node.setAttribute('data-resized', 'nested')
    })
  })
  await groups.nth(1).locator(':scope > [data-radcn-resizable-handle]').focus()
  await page.keyboard.press('ArrowDown')
  await expect(nested).toHaveAttribute('data-resized', 'nested')
  await expect(outer).not.toHaveAttribute('data-resized', 'outer')
  await expect(groups.nth(1).locator(':scope > [data-radcn-resizable-handle]')).toHaveAttribute('aria-valuenow', '30')
  await groups.nth(0).locator(':scope > [data-radcn-resizable-handle]').focus()
  await page.keyboard.press('ArrowRight')
  await expect(outer).toHaveAttribute('data-resized', 'outer')
  await expect(groups.nth(0).locator(':scope > [data-radcn-resizable-handle]')).toHaveAttribute('aria-valuenow', '55')

  await page.goto(`${candidate}/fixtures/resizable/demo-with-handle`)
  await expect(page.locator('[data-radcn-resizable-panel-group]')).toHaveCount(2)
  await expect(page.locator('[data-radcn-resizable-handle-grip]')).toHaveCount(2)

  await page.goto(`${candidate}/fixtures/resizable/handle`)
  await expect(page.locator('[data-radcn-resizable-panel]').filter({ hasText: 'Sidebar' })).toBeVisible()
  await expect(page.locator('[data-radcn-resizable-panel]').filter({ hasText: 'Content' })).toBeVisible()
  let handleGroup = page.locator('[data-radcn-resizable-panel-group]')
  await expect(handleGroup.locator(':scope > [data-radcn-resizable-panel]').nth(0)).toHaveAttribute('data-size', '25')
  await expect(handleGroup.locator(':scope > [data-radcn-resizable-panel]').nth(1)).toHaveAttribute('data-size', '75')
  await expect(page.getByRole('separator', { name: 'Resize panels' })).toHaveAttribute('aria-orientation', 'horizontal')
  await expect(page.locator('[data-radcn-resizable-handle-grip]')).toHaveCount(1)
  await page.getByRole('separator', { name: 'Resize panels' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('separator', { name: 'Resize panels' })).toHaveAttribute('aria-valuenow', '30')

  await page.goto(`${candidate}/fixtures/resizable/vertical-upstream`)
  await expect(page.locator('[data-radcn-resizable-panel]').filter({ hasText: 'Header' })).toBeVisible()
  await expect(page.locator('[data-radcn-resizable-panel]').filter({ hasText: 'Content' })).toBeVisible()
  let verticalGroup = page.locator('[data-radcn-resizable-panel-group]')
  await expect(verticalGroup).toHaveAttribute('data-orientation', 'vertical')
  await expect(verticalGroup.locator(':scope > [data-radcn-resizable-panel]').nth(0)).toHaveAttribute('data-size', '25')
  await expect(verticalGroup.locator(':scope > [data-radcn-resizable-panel]').nth(1)).toHaveAttribute('data-size', '75')
  await expect(page.getByRole('separator', { name: 'Resize panels' })).toHaveAttribute('aria-orientation', 'vertical')
  await page.getByRole('separator', { name: 'Resize panels' }).focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('separator', { name: 'Resize panels' })).toHaveAttribute('aria-valuenow', '30')
})

test('candidate sidebar exposes shell slots variants toggles shortcut and tokens', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/sidebar/default`)
  await expect(page.locator('[data-radcn-sidebar-provider]')).toHaveAttribute('data-state', 'expanded')
  await expect(page.locator('[data-radcn-sidebar]')).toHaveAttribute('data-side', 'left')
  await expect(page.locator('[data-radcn-sidebar-header]')).toBeVisible()
  await expect(page.locator('[data-radcn-sidebar-menu-button][data-active="true"]')).toContainText('Dashboard')

  await page.locator('[data-radcn-sidebar-provider]').evaluate((node) => {
    node.addEventListener('radcn-sidebar-change', (event) => {
      node.setAttribute('data-last-sidebar-state', String((event as CustomEvent).detail.state))
    })
  })
  await page.locator('[data-radcn-sidebar-trigger]').click()
  await expect(page.locator('[data-radcn-sidebar-provider]')).toHaveAttribute('data-state', 'collapsed')
  await expect(page.locator('[data-radcn-sidebar-provider]')).toHaveAttribute('data-last-sidebar-state', 'collapsed')
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+B' : 'Control+B')
  await expect(page.locator('[data-radcn-sidebar-provider]')).toHaveAttribute('data-state', 'expanded')

  await page.goto(`${candidate}/fixtures/sidebar/right`)
  await expect(page.locator('[data-radcn-sidebar]')).toHaveAttribute('data-side', 'right')

  await page.goto(`${candidate}/fixtures/sidebar/floating`)
  await expect(page.locator('[data-radcn-sidebar]')).toHaveAttribute('data-variant', 'floating')

  await page.goto(`${candidate}/fixtures/sidebar/icon-collapsible`)
  await expect(page.locator('[data-radcn-sidebar-provider]')).toHaveAttribute('data-state', 'collapsed')
  await expect(page.locator('[data-radcn-sidebar]')).toHaveAttribute('data-collapsible', 'icon')

  await page.goto(`${candidate}/fixtures/sidebar/menu-states`)
  await expect(page.locator('[data-radcn-sidebar-menu-badge]')).toHaveText('3')
  await expect(page.locator('[data-radcn-sidebar-menu-action]')).toBeVisible()
  await expect(page.locator('[data-radcn-sidebar-menu-button]').last()).toBeDisabled()

  await page.goto(`${candidate}/fixtures/sidebar/submenu`)
  await expect(page.locator('[data-radcn-sidebar-menu-sub]')).toBeVisible()
  await expect(page.locator('[data-radcn-sidebar-menu-sub-button][data-active="true"]')).toHaveText('Button')

  await page.goto(`${candidate}/fixtures/sidebar/skeleton`)
  await expect(page.locator('[data-radcn-sidebar-menu-skeleton]')).toBeVisible()

  await page.goto(`${candidate}/fixtures/sidebar/custom-token`)
  await expect(page.locator('[data-radcn-sidebar-provider]')).toHaveClass(/radcn-fixture-custom-sidebar/)
  await expect(page.locator('[data-radcn-sidebar]')).toHaveCSS('background-color', 'rgb(240, 253, 250)')
})

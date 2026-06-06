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

test('notification cluster exports sonner and toast without React notification dependencies', async () => {
  let pkg = await packageJson()
  let deps = { ...pkg.dependencies, ...pkg.devDependencies }
  expect(pkg.exports?.['./sonner']).toBe('./src/components/sonner.tsx')
  expect(pkg.exports?.['./toast']).toBe('./src/components/toast.ts')
  expect(deps).not.toHaveProperty('sonner')
  expect(deps).not.toHaveProperty('next-themes')
  expect(deps).not.toHaveProperty('react')
  expect(deps).not.toHaveProperty('react-dom')
})

test('candidate toaster renders accessible initial notifications and variants', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/sonner/default`)
  await expect(page.getByRole('region', { name: 'Notifications' })).toHaveAttribute('data-radcn-toaster', '')
  await expect(page.getByRole('status', { name: /Notification ready/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]')).toHaveAttribute('data-type', 'default')

  await page.goto(`${candidate}/fixtures/sonner/success`)
  await expect(page.getByRole('status', { name: /Project published/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]')).toHaveAttribute('data-type', 'success')

  await page.goto(`${candidate}/fixtures/sonner/error`)
  await expect(page.getByRole('alert', { name: /Build failed/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]')).toHaveAttribute('data-type', 'error')

  await page.goto(`${candidate}/fixtures/sonner/loading`)
  await expect(page.getByRole('status', { name: /Syncing changes/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]')).toHaveAttribute('data-type', 'loading')
})

test('candidate toaster covers actions dismiss stack and custom tokens', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/sonner/action`)
  await expect(page.locator('[data-radcn-toast-action]')).toHaveText('Undo')
  await expect(page.locator('[data-radcn-toast-action]')).toHaveAttribute('href', '/fixtures/sonner/action?undo=1')

  await page.goto(`${candidate}/fixtures/sonner/dismiss`)
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(1)
  await page.getByRole('button', { name: 'Dismiss notification' }).click()
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(0)

  await page.goto(`${candidate}/fixtures/sonner/stack`)
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(3)
  await expect(page.locator('[data-radcn-toast][data-type="warning"]')).toContainText('Deploy paused')

  await page.goto(`${candidate}/fixtures/sonner/custom-token`)
  await expect(page.locator('[data-radcn-toaster]')).toHaveClass(/radcn-fixture-custom-toaster/)
  await expect(page.locator('[data-radcn-toast]')).toHaveCSS('background-color', 'rgb(240, 253, 250)')
})

test('candidate toaster covers named sonner demo and type examples', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/sonner/demo`)
  await expect(page.locator('[data-radcn-sonner-recipe="demo"]')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Notifications' })).toHaveAttribute('data-radcn-toaster', '')
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Show Toast' }).click()
  await expect(page.getByRole('status', { name: /Event has been created/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]')).toHaveAttribute('data-type', 'default')
  await expect(page.locator('[data-radcn-toast-title]')).toHaveText('Event has been created')
  await expect(page.locator('[data-radcn-toast-description]')).toHaveText('Sunday, December 03, 2023 at 9:00 AM')
  await expect(page.locator('[data-radcn-toast-action]')).toHaveText('Undo')
  await expect(page.locator('[data-radcn-toast-action]')).toHaveAttribute('href', '/fixtures/sonner/demo?undo=1')

  await page.goto(`${candidate}/fixtures/sonner/types`)
  await expect(page.locator('[data-radcn-sonner-recipe="types"]')).toBeVisible()
  await expect(page.locator('[data-radcn-sonner-promise-mapping]')).toContainText('toast.promise maps to app-owned orchestration')
  await expect(page.locator('[data-radcn-sonner-promise-mapping]')).toContainText('Event has been created')
  await expect(page.locator('[data-radcn-sonner-promise-mapping]')).toContainText('Error')
  await expect(page.getByRole('region', { name: 'Notifications' })).toHaveAttribute('data-radcn-toaster', '')
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(0)

  for (let label of ['Default', 'Success', 'Info', 'Warning', 'Error', 'Promise']) {
    await expect(page.getByRole('button', { name: label })).toBeVisible()
  }

  await page.getByRole('button', { name: 'Default' }).click()
  await expect(page.getByRole('status', { name: 'Event has been created' }).last()).toBeVisible()
  await expect(page.locator('[data-radcn-toast]').last()).toHaveAttribute('data-type', 'default')

  await page.getByRole('button', { name: 'Success' }).click()
  await expect(page.getByRole('status', { name: 'Event has been created' }).last()).toBeVisible()
  await expect(page.locator('[data-radcn-toast]').last()).toHaveAttribute('data-type', 'success')

  await page.getByRole('button', { name: 'Info' }).click()
  await expect(page.getByRole('status', { name: 'Be at the area 10 minutes before the event time' })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]').last()).toHaveAttribute('data-type', 'info')

  await page.getByRole('button', { name: 'Warning' }).click()
  await expect(page.getByRole('alert', { name: 'Event start time cannot be earlier than 8am' })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]').last()).toHaveAttribute('data-type', 'warning')

  await page.getByRole('button', { name: 'Error' }).click()
  await expect(page.getByRole('alert', { name: 'Event has not been created' })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]').last()).toHaveAttribute('data-type', 'error')

  await page.getByRole('button', { name: 'Promise' }).click()
  await expect(page.getByRole('status', { name: 'Loading...' })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]').last()).toHaveAttribute('data-type', 'loading')
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(6)
})

test('candidate toast event dispatches browser notifications', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/toast/event`)
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Show toast' }).click()
  await expect(page.getByRole('status', { name: /Event notification/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]')).toHaveAttribute('data-type', 'success')
  await expect(page.locator('[data-radcn-toast-description]')).toHaveText('The RadCN toaster listens for browser events.')
})

test('candidate toast covers deprecated shadcn toast examples', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/toast/demo`)
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Add to calendar' }).click()
  await expect(page.getByRole('status', { name: /Scheduled: Catch up/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast-title]')).toHaveText('Scheduled: Catch up')
  await expect(page.locator('[data-radcn-toast-description]')).toHaveText('Friday, February 10, 2023 at 5:57 PM')
  await expect(page.locator('[data-radcn-toast-action]')).toHaveText('Undo')
  await expect(page.locator('[data-radcn-toast-action]')).toHaveAttribute('href', '/fixtures/toast/demo?undo=1')

  await page.goto(`${candidate}/fixtures/toast/destructive`)
  await page.getByRole('button', { name: 'Show Toast' }).click()
  await expect(page.getByRole('alert', { name: /Uh oh! Something went wrong/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]')).toHaveAttribute('data-type', 'error')
  await expect(page.locator('[data-radcn-toast-action]')).toHaveText('Try again')

  await page.goto(`${candidate}/fixtures/toast/simple`)
  await page.getByRole('button', { name: 'Show Toast' }).click()
  await expect(page.getByRole('status', { name: /Your message has been sent/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast-title]')).toHaveCount(0)
  await expect(page.locator('[data-radcn-toast-description]')).toHaveText('Your message has been sent.')

  await page.goto(`${candidate}/fixtures/toast/with-action`)
  await page.getByRole('button', { name: 'Show Toast' }).click()
  await expect(page.getByRole('status', { name: /Uh oh! Something went wrong/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast-title]')).toHaveText('Uh oh! Something went wrong.')
  await expect(page.locator('[data-radcn-toast-description]')).toHaveText('There was a problem with your request.')
  await expect(page.locator('[data-radcn-toast-action]')).toHaveText('Try again')

  await page.goto(`${candidate}/fixtures/toast/with-title`)
  await page.getByRole('button', { name: 'Show Toast' }).click()
  await expect(page.getByRole('status', { name: /Uh oh! Something went wrong/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast-title]')).toHaveText('Uh oh! Something went wrong.')
  await expect(page.locator('[data-radcn-toast-description]')).toHaveText('There was a problem with your request.')
  await expect(page.locator('[data-radcn-toast-action]')).toHaveCount(0)
})

test('candidate toast disposition supports server rendered action and no-js initial patterns', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/toast/form-action`)
  await expect(page.locator('[data-radcn-toast-recipe]')).toHaveCount(1)
  await expect(page.getByRole('status', { name: /Changes saved/ })).toBeVisible()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page).toHaveURL(/\/fixtures\/toast\/form-action\?intent=notify$/)

  await page.goto(`${candidate}/fixtures/toast/no-js-initial`)
  await expect(page.getByRole('status', { name: /Server notification/ })).toBeVisible()
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(1)

  await page.goto(`${candidate}/fixtures/toast/empty-payload`)
  await expect(page.locator('[data-radcn-toast-recipe]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-toast]')).toHaveCount(0)
})

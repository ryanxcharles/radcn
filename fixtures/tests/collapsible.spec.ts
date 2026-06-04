import { expect, test } from '@playwright/test'

const candidate = 'http://localhost:4602'

test('candidate collapsible exposes native details summary hooks and closed state', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/collapsible/default`)

  let root = page.locator('[data-radcn-collapsible]')
  await expect(root).toHaveJSProperty('tagName', 'DETAILS')
  await expect(root).toHaveAttribute('data-state', 'closed')
  await expect(root).not.toHaveAttribute('open', '')
  await expect(page.locator('[data-radcn-collapsible-trigger]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-collapsible-trigger-text]')).toHaveText('Release notes')
  await expect(page.locator('[data-radcn-collapsible-icon]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-collapsible-content]')).toBeHidden()

  await page.locator('[data-radcn-collapsible-trigger]').click()
  await expect(root).toHaveAttribute('open', '')
  await expect(page.locator('[data-radcn-collapsible-content]')).toBeVisible()

  await page.locator('[data-radcn-collapsible-trigger]').focus()
  await page.keyboard.press('Enter')
  await expect(root).not.toHaveAttribute('open', '')

  await page.keyboard.press('Space')
  await expect(root).toHaveAttribute('open', '')
})

test('candidate collapsible exposes open disabled and custom token states', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/collapsible/open`)
  let openRoot = page.locator('[data-radcn-collapsible]')
  await expect(openRoot).toHaveAttribute('data-state', 'open')
  await expect(openRoot).toHaveAttribute('open', '')
  await expect(page.locator('[data-radcn-collapsible-content]')).toBeVisible()

  await page.goto(`${candidate}/fixtures/collapsible/disabled`)
  let disabled = page.locator('[data-radcn-collapsible]')
  await expect(disabled).toHaveJSProperty('tagName', 'DIV')
  await expect(disabled).toHaveAttribute('data-disabled', 'true')
  await expect(disabled).toHaveAttribute('data-state', 'closed')
  await expect(disabled.locator('[data-radcn-collapsible-trigger]')).toHaveJSProperty('tagName', 'DIV')
  await expect(disabled.locator('[data-radcn-collapsible-trigger]')).toHaveAttribute('aria-disabled', 'true')
  await expect(disabled.locator('[data-radcn-collapsible-trigger]')).toHaveCSS('pointer-events', 'none')
  await expect(disabled.locator('[data-radcn-collapsible-content]')).toBeHidden()
  await disabled.locator('[data-radcn-collapsible-trigger]').click({ force: true })
  await expect(disabled).not.toHaveAttribute('open', '')
  await disabled.locator('[data-radcn-collapsible-trigger]').focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await expect(disabled).not.toHaveAttribute('open', '')

  await page.goto(`${candidate}/fixtures/collapsible/custom-token`)
  let custom = page.locator('[data-radcn-collapsible]')
  await expect(custom).toHaveClass(/radcn-fixture-custom-collapsible/)
  await expect(custom).toHaveCSS('background-color', 'rgb(240, 253, 250)')
  await expect(custom).toHaveCSS('border-color', 'rgb(15, 118, 110)')
  await expect(custom).toHaveCSS('color', 'rgb(19, 78, 74)')
  await expect(page.locator('[data-radcn-collapsible-content]')).toHaveCSS('color', 'rgb(15, 118, 110)')
})

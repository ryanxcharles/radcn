import { expect, test } from '@playwright/test'

const candidate = 'http://localhost:4602'

test('candidate accordion exposes native details summary hooks and single behavior', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/accordion/single`)

  let root = page.locator('[data-radcn-accordion]')
  await expect(root).toHaveAttribute('data-type', 'single')
  await expect(root).toHaveAttribute('data-collapsible', 'true')
  await expect(root).toHaveAttribute('data-default-value', '')

  let items = page.locator('details[data-radcn-accordion-item]')
  await expect(items).toHaveCount(2)
  await expect(items.first()).toHaveAttribute('name', 'candidate-accordion-single')
  await expect(items.nth(1)).toHaveAttribute('name', 'candidate-accordion-single')
  await expect(items.first()).toHaveAttribute('open', '')
  await expect(items.nth(1)).not.toHaveAttribute('open', '')
  await expect(page.locator('[data-radcn-accordion-trigger]')).toHaveCount(2)
  await expect(page.locator('[data-radcn-accordion-content]')).toHaveCount(2)
  await expect(page.locator('[data-radcn-accordion-icon]')).toHaveCount(2)

  await page.getByText('Can it collapse?').click()
  await expect(items.first()).not.toHaveAttribute('open', '')
  await expect(items.nth(1)).toHaveAttribute('open', '')

  await page.getByText('Can it collapse?').click()
  await expect(items.nth(1)).not.toHaveAttribute('open', '')
})

test('candidate accordion supports multiple open panels and keyboard toggling', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/accordion/multiple`)

  let root = page.locator('[data-radcn-accordion]')
  await expect(root).toHaveAttribute('data-type', 'multiple')
  let items = page.locator('details[data-radcn-accordion-item]')
  await expect(items.first()).toHaveAttribute('open', '')
  await expect(items.nth(1)).toHaveAttribute('open', '')
  await expect(items.first()).not.toHaveAttribute('name', /.+/)

  let firstTrigger = page.locator('[data-radcn-accordion-trigger]').first()
  await firstTrigger.click()
  await expect(items.first()).not.toHaveAttribute('open', '')
  await expect(items.nth(1)).toHaveAttribute('open', '')

  await firstTrigger.focus()
  await page.keyboard.press('Enter')
  await expect(items.first()).toHaveAttribute('open', '')
  await expect(items.nth(1)).toHaveAttribute('open', '')
})

test('candidate accordion exposes disabled and customization hooks', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/accordion/disabled-item`)

  let disabled = page.locator('[data-radcn-accordion-item][data-value="two"]')
  await expect(disabled).toHaveAttribute('data-disabled', 'true')
  await expect(disabled).toHaveClass(/radcn-accordion-item--disabled/)
  await expect(disabled).not.toHaveAttribute('open', '')
  await expect(disabled).toHaveJSProperty('tagName', 'DIV')
  await expect(disabled.locator('[data-radcn-accordion-trigger]')).toHaveCSS('pointer-events', 'none')
  await expect(disabled.locator('[data-radcn-accordion-trigger]')).toHaveAttribute('aria-disabled', 'true')
  await expect(disabled.locator('[data-radcn-accordion-trigger]')).toHaveJSProperty('tagName', 'DIV')
  await expect(disabled.locator('[data-radcn-accordion-content]')).toBeHidden()

  await page.goto(`${candidate}/fixtures/accordion/custom-token`)
  let custom = page.locator('[data-radcn-accordion]')
  await expect(custom).toHaveClass(/radcn-fixture-custom-accordion/)
  await expect(custom).toHaveCSS('border-top-color', 'rgb(15, 118, 110)')
  await expect(page.locator('[data-radcn-accordion-trigger]')).toHaveCSS('color', 'rgb(19, 78, 74)')
  await expect(page.locator('[data-radcn-accordion-content]')).toHaveCSS('color', 'rgb(15, 118, 110)')
})

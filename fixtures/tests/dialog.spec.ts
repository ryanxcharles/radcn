import { expect, test } from '@playwright/test'

const candidate = 'http://localhost:4602'

async function openDialog(page: import('@playwright/test').Page, scenario = 'default') {
  await page.goto(`${candidate}/fixtures/dialog/${scenario}`)
  let trigger = page.locator('[data-radcn-dialog-trigger]')
  await trigger.click()
  return {
    content: page.locator('[data-radcn-dialog-content]'),
    trigger,
  }
}

test('candidate dialog opens with modal semantics and relationships', async ({ page }) => {
  let { content, trigger } = await openDialog(page)
  await expect(trigger).toHaveAttribute('data-state', 'open')
  await expect(content).toBeVisible()
  await expect(content).toHaveAttribute('role', 'dialog')
  await expect(content).toHaveAttribute('aria-modal', 'true')

  let titleId = await page.locator('[data-radcn-dialog-title]').getAttribute('id')
  let descriptionId = await page.locator('[data-radcn-dialog-description]').getAttribute('id')
  await expect(content).toHaveAttribute('aria-labelledby', titleId || '')
  await expect(content).toHaveAttribute('aria-describedby', descriptionId || '')
  await expect(page.locator('[data-radcn-portal-root] [data-radcn-dialog-portal]')).toHaveCount(1)
})

test('candidate dialog traps focus restores focus and locks scroll', async ({ page }) => {
  let { content, trigger } = await openDialog(page)
  await expect(page.locator('[data-dialog-name-input]')).toBeFocused()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('[data-radcn-dialog-close][aria-label="Close"]')).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.locator('[data-dialog-name-input]')).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(content).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('candidate dialog closes from close button and outside pointer', async ({ page }) => {
  let opened = await openDialog(page, 'close-button')
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(opened.content).toBeHidden()
  await expect(opened.trigger).toBeFocused()

  opened = await openDialog(page, 'outside-dismiss')
  await page.locator('[data-radcn-dialog-overlay]').click({ position: { x: 10, y: 10 } })
  await expect(opened.content).toBeHidden()
  await expect(opened.trigger).toBeFocused()
})

test('candidate dialog supports default open state and custom tokens', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/dialog/default-open`)
  let content = page.locator('[data-radcn-dialog-content]')
  await expect(content).toBeVisible()
  await expect(content).toHaveAttribute('data-state', 'open')
  await page.keyboard.press('Escape')
  await expect(content).toBeHidden()

  await page.goto(`${candidate}/fixtures/dialog/custom-token`)
  await page.locator('[data-radcn-dialog-trigger]').click()
  content = page.locator('[data-radcn-dialog-content]')
  await expect(content).toHaveClass(/radcn-fixture-custom-dialog/)
  await expect(content).toHaveCSS('border-color', 'rgb(15, 118, 110)')
  await expect(content).toHaveCSS('background-color', 'rgb(240, 253, 250)')
  await expect(page.locator('[data-radcn-dialog-overlay]')).toHaveCSS('background-color', 'rgba(15, 118, 110, 0.35)')
})

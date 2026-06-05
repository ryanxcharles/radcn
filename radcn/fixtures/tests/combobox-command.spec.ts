import { expect, test } from '@playwright/test'

const candidate = 'http://localhost:4602'

async function freshCombobox(page: import('@playwright/test').Page, scenario = 'default') {
  await page.goto(`${candidate}/fixtures/combobox/${scenario}`)
  let content = page.locator('[data-radcn-combobox-content]').first()
  let input = page.locator('[data-radcn-combobox-input]').first()
  if (await content.isVisible()) {
    await input.focus()
    await page.keyboard.press('Escape')
    await expect(content).toBeHidden()
  }
  return {
    content,
    input,
    hidden: page.locator('[data-radcn-combobox-hidden-input]').first(),
    root: page.locator('[data-radcn-combobox]').first(),
    trigger: page.locator('[data-radcn-combobox-trigger]').first(),
  }
}

async function freshCommand(page: import('@playwright/test').Page, scenario = 'default') {
  await page.goto(`${candidate}/fixtures/command/${scenario}`)
  return {
    input: page.locator('[data-radcn-command-input]').first(),
    list: page.locator('[data-radcn-command-list]').first(),
    root: page.locator('[data-radcn-command]').first(),
  }
}

function comboHighlight(page: import('@playwright/test').Page) {
  return page.locator('[data-radcn-combobox-item][data-highlighted="true"]')
}

function commandHighlight(page: import('@playwright/test').Page) {
  return page.locator('[data-radcn-command-item][data-highlighted="true"]')
}

test('candidate combobox opens filters selects and syncs form value', async ({ page }) => {
  let opened = await freshCombobox(page, 'default')
  await opened.trigger.click()
  await expect(opened.content).toBeVisible()
  await expect(opened.input).toHaveAttribute('role', 'combobox')
  await expect(opened.input).toHaveAttribute('aria-expanded', 'true')
  await expect(opened.input).toHaveAttribute('aria-controls', await page.locator('[data-radcn-combobox-list]').first().getAttribute('id') || '')
  await expect(page.locator('[data-radcn-portal-root] [data-radcn-combobox-portal]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-combobox-list]').first()).toHaveAttribute('role', 'listbox')
  await expect(page.getByRole('option', { name: /Remix/ })).toHaveAttribute('aria-selected', 'true')

  await opened.input.fill('sv')
  await expect(page.getByRole('option', { name: 'Svelte' })).toBeVisible()
  await expect(page.getByRole('option', { name: 'React' })).toBeHidden()
  await page.keyboard.press('Enter')
  await expect(opened.input).toHaveValue('Svelte')
  await expect(opened.hidden).toHaveValue('svelte')
  await expect(opened.content).toBeHidden()
})

test('candidate combobox keyboard roves skips disabled clears and closes safely', async ({ page }) => {
  let opened = await freshCombobox(page, 'groups')
  await opened.trigger.click()
  await page.keyboard.press('ArrowDown')
  await expect(comboHighlight(page)).toContainText('Remix')
  await page.keyboard.press('Home')
  await expect(comboHighlight(page)).toContainText('React')
  await page.keyboard.press('End')
  await expect(comboHighlight(page)).toContainText('SvelteKit')
  await page.keyboard.press('Escape')
  await expect(opened.content).toBeHidden()

  opened = await freshCombobox(page, 'clearable')
  await opened.trigger.click()
  await page.locator('[data-radcn-combobox-clear]').click()
  await expect(opened.input).toHaveValue('')
  await expect(opened.hidden).toHaveValue('')
  await expect(opened.input).toBeFocused()

  opened = await freshCombobox(page, 'default')
  await opened.trigger.click()
  await page.keyboard.press('Tab')
  await expect(opened.content).toBeHidden()
})

test('candidate combobox exposes chips invalid popper custom and form reset', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/combobox/disabled-invalid`)
  await expect(page.locator('#candidate-combobox-disabled [data-radcn-combobox-input]')).toBeDisabled()
  await expect(page.locator('#candidate-combobox-invalid [data-radcn-combobox-input]')).toHaveAttribute('aria-invalid', 'true')

  let opened = await freshCombobox(page, 'chips-multiple')
  await opened.trigger.click()
  await expect(page.locator('[data-radcn-combobox-chip]:visible')).toHaveCount(2)
  await page.getByRole('option', { name: 'Svelte' }).click()
  await expect(opened.hidden).toHaveValue('react,remix,svelte')

  opened = await freshCombobox(page, 'popper-placement')
  await opened.trigger.click()
  await expect(opened.content).toHaveAttribute('data-side', 'right')
  await expect(opened.content).toHaveAttribute('data-align', 'end')
  let box = await opened.content.boundingBox()
  let stage = await page.locator('[data-fixture-stage]').boundingBox()
  expect(box).not.toBeNull()
  expect(stage).not.toBeNull()
  expect(box!.x + box!.width).toBeLessThanOrEqual(stage!.x + stage!.width)

  opened = await freshCombobox(page, 'custom-token')
  await opened.trigger.click()
  await expect(opened.content).toHaveClass(/radcn-fixture-custom-combobox/)
  await expect(opened.content).toHaveCSS('border-color', 'rgb(15, 118, 110)')

  opened = await freshCombobox(page, 'form-submit-reset')
  await opened.trigger.click()
  await opened.input.fill('vue')
  await page.keyboard.press('Enter')
  await expect(opened.hidden).toHaveValue('vue')
  await page.getByRole('button', { name: 'Reset' }).click()
  await expect(opened.hidden).toHaveValue('react')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page).toHaveURL(/\/fixtures\/combobox\/form-submit-reset\?framework=react&intent=submit$/)
})

test('candidate command filters activates skips disabled and shows empty state', async ({ page }) => {
  let opened = await freshCommand(page)
  await expect(opened.list).toHaveAttribute('role', 'listbox')
  await opened.input.fill('set')
  await expect(page.getByRole('option', { name: /Settings/ })).toBeVisible()
  await expect(page.locator('[data-radcn-command-item][data-value="open-file"]')).toBeHidden()
  await page.keyboard.press('Enter')
  await expect(opened.root).toHaveAttribute('data-value', 'settings')

  opened = await freshCommand(page)
  await opened.input.focus()
  await page.keyboard.press('ArrowDown')
  await expect(commandHighlight(page)).toContainText('Open File')
  await page.keyboard.press('End')
  await expect(commandHighlight(page)).toContainText('Settings')
  await page.keyboard.press('Home')
  await expect(commandHighlight(page)).toContainText('Open File')
  await page.getByRole('option', { name: /Deploy disabled/ }).click({ force: true })
  await expect(opened.root).not.toHaveAttribute('data-value', 'deploy')
  await opened.input.fill('zzzz')
  await expect(page.locator('[data-radcn-command-empty]')).toBeVisible()
})

test('candidate command exposes groups shortcuts checked dialog and custom hooks', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/command/groups`)
  await expect(page.locator('[data-radcn-command-group]')).toHaveCount(2)
  await expect(page.locator('[data-radcn-command-separator]')).toHaveCount(1)

  await page.goto(`${candidate}/fixtures/command/shortcuts`)
  await expect(page.locator('[data-radcn-command-shortcut]')).toHaveCount(3)

  await page.goto(`${candidate}/fixtures/command/checked`)
  await expect(page.locator('[data-radcn-command-item]')).toHaveAttribute('data-checked', 'true')

  await page.goto(`${candidate}/fixtures/command/dialog`)
  await expect(page.locator('[data-radcn-dialog-content]')).toBeVisible()
  await expect(page.locator('[data-radcn-dialog-content]')).toHaveAttribute('role', 'dialog')
  await expect(page.locator('[data-radcn-command]')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-radcn-dialog-content]')).toBeHidden()

  await page.goto(`${candidate}/fixtures/command/custom-token`)
  await expect(page.locator('[data-radcn-command]')).toHaveClass(/radcn-fixture-custom-command/)
  await expect(page.locator('[data-radcn-command]')).toHaveCSS('border-color', 'rgb(15, 118, 110)')
})

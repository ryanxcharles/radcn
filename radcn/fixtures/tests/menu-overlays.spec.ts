import { expect, test } from '@playwright/test'

const candidate = 'http://localhost:4602'

async function freshDropdown(page: import('@playwright/test').Page, scenario = 'default') {
  await page.goto(`${candidate}/fixtures/dropdown-menu/${scenario}`)
  let content = page.locator('[data-radcn-dropdown-menu-content]')
  if (await content.isVisible()) {
    await page.keyboard.press('Escape')
    await expect(content).toBeHidden()
  }
  return {
    content,
    trigger: page.locator('[data-radcn-dropdown-menu-trigger]'),
  }
}

async function freshContext(page: import('@playwright/test').Page, scenario = 'default') {
  await page.goto(`${candidate}/fixtures/context-menu/${scenario}`)
  let content = page.locator('[data-radcn-context-menu-content]')
  if (await content.isVisible()) {
    await page.keyboard.press('Escape')
    await expect(content).toBeHidden()
  }
  return {
    content,
    target: page.locator('[data-context-target]'),
    trigger: page.locator('[data-radcn-context-menu-trigger]'),
  }
}

async function expectFocusedText(page: import('@playwright/test').Page, text: string) {
  await expect(page.locator('[data-radcn-menu-item][data-highlighted="true"]')).toContainText(text)
  await expect(page.locator('[data-radcn-menu-item][data-highlighted="true"]')).toBeFocused()
}

test('candidate dropdown menu opens from click and keyboard with menu semantics', async ({ page }) => {
  let opened = await freshDropdown(page)
  await opened.trigger.click()
  await expect(opened.content).toBeVisible()
  await expect(opened.content).toHaveAttribute('role', 'menu')
  await expect(opened.trigger).toHaveAttribute('aria-haspopup', 'menu')
  await expect(opened.trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(opened.trigger).toHaveAttribute('aria-controls', await opened.content.getAttribute('id') || '')
  await expect(page.locator('[data-radcn-portal-root] [data-radcn-dropdown-menu-portal]')).toHaveCount(1)
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await expectFocusedText(page, 'Alpha')

  await page.keyboard.press('Tab')
  await expect(opened.content).toBeHidden()

  opened = await freshDropdown(page)
  await opened.trigger.click()
  await page.keyboard.press('Shift+Tab')
  await expect(opened.content).toBeHidden()

  opened = await freshDropdown(page)
  await opened.trigger.click()
  await page.getByRole('menuitem', { name: /Alpha action/ }).click()
  await expect(opened.content).toBeHidden()

  for (let key of ['Enter', 'Space', 'ArrowDown']) {
    opened = await freshDropdown(page, 'keyboard-typeahead')
    await opened.trigger.focus()
    await page.keyboard.press(key)
    await expect(opened.content).toBeVisible()
    await expectFocusedText(page, 'Alpha')
  }

  await expect(page.locator('[data-radcn-dropdown-menu-label]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-dropdown-menu-separator]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-dropdown-menu-shortcut]')).toHaveCount(1)
})

test('candidate dropdown menu roves focus typeahead highlights pointer and skips disabled', async ({ page }) => {
  let opened = await freshDropdown(page, 'keyboard-typeahead')
  await opened.trigger.click()
  await page.keyboard.press('ArrowDown')
  await expectFocusedText(page, 'Gamma')
  await page.keyboard.press('ArrowDown')
  await expectFocusedText(page, 'Delete')
  await page.keyboard.press('Home')
  await expectFocusedText(page, 'Alpha')
  await page.keyboard.press('End')
  await expectFocusedText(page, 'Delete')
  await page.keyboard.press('g')
  await expectFocusedText(page, 'Gamma')

  await page.getByRole('menuitem', { name: /Alpha/ }).hover()
  await expect(page.getByRole('menuitem', { name: /Alpha/ })).toHaveAttribute('data-highlighted', 'true')
  await page.getByRole('menuitem', { name: /Beta disabled/ }).hover()
  await expect(page.getByRole('menuitem', { name: /Beta disabled/ })).not.toHaveAttribute('data-highlighted', 'true')
  await page.getByRole('menuitem', { name: /Beta disabled/ }).click({ force: true })
  await expect(opened.content).toBeVisible()
})

test('candidate dropdown menu handles checked items submenus collision and custom tokens', async ({ page }) => {
  let opened = await freshDropdown(page, 'checkbox-radio')
  await opened.trigger.click()
  let checkbox = page.getByRole('menuitemcheckbox', { name: /Show toolbar/ })
  await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  await checkbox.click()
  await expect(opened.content).toBeHidden()
  await expect(page.locator('[data-radcn-dropdown-menu-checkbox-item]')).toHaveAttribute('data-state', 'unchecked')

  opened = await freshDropdown(page, 'checkbox-radio')
  await opened.trigger.click()
  let compact = page.getByRole('menuitemradio', { name: /Compact/ })
  let comfortable = page.getByRole('menuitemradio', { name: /Comfortable/ })
  await expect(comfortable).toHaveAttribute('aria-checked', 'true')
  await compact.click()
  await expect(opened.content).toBeHidden()
  await expect(page.locator('[data-radcn-dropdown-menu-radio-item][data-value="compact"]')).toHaveAttribute('aria-checked', 'true')

  opened = await freshDropdown(page, 'submenu')
  await opened.trigger.click()
  let subTrigger = page.locator('[data-radcn-dropdown-menu-sub-trigger]')
  await subTrigger.hover()
  let subContent = page.locator('[data-radcn-dropdown-menu-sub-content]')
  await expect(subTrigger).toHaveAttribute('aria-expanded', 'true')
  await expect(subContent).toBeVisible()
  let subBox = await subContent.boundingBox()
  let stage = await page.locator('[data-fixture-stage]').boundingBox()
  expect(subBox).not.toBeNull()
  expect(stage).not.toBeNull()
  expect(subBox!.x + subBox!.width).toBeLessThanOrEqual(stage!.x + stage!.width)
  await page.mouse.move(subBox!.x + subBox!.width / 2, subBox!.y + subBox!.height / 2)
  await expect(subContent).toBeVisible()
  await subTrigger.focus()
  await page.keyboard.press('ArrowRight')
  await expect(subContent).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(subContent).toBeHidden()

  opened = await freshDropdown(page, 'collision')
  await opened.trigger.click()
  let box = await opened.content.boundingBox()
  stage = await page.locator('[data-fixture-stage]').boundingBox()
  expect(box).not.toBeNull()
  expect(stage).not.toBeNull()
  expect(box!.x + box!.width).toBeLessThanOrEqual(stage!.x + stage!.width)

  opened = await freshDropdown(page, 'custom-token')
  await opened.trigger.click()
  await expect(opened.content).toHaveClass(/radcn-fixture-custom-menu/)
  await expect(opened.content).toHaveCSS('border-color', 'rgb(124, 58, 237)')
  await expect(opened.content).toHaveCSS('background-color', 'rgb(250, 245, 255)')
})

test('candidate dropdown menu matches named demo example composition', async ({ page }) => {
  let opened = await freshDropdown(page, 'demo')
  await opened.trigger.click()
  await expect(opened.content).toBeVisible()
  await expect(opened.content).toHaveAttribute('role', 'menu')
  await expect(page.locator('[data-radcn-dropdown-menu-label]')).toContainText('My Account')
  await expect(page.locator('[data-radcn-dropdown-menu-group]')).toHaveCount(2)
  await expect(page.locator('[data-radcn-dropdown-menu-separator]')).toHaveCount(4)
  await expect(page.locator('[data-radcn-dropdown-menu-shortcut]')).toHaveCount(6)
  await expect(page.getByRole('menuitem', { name: /Profile/ })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: /API/ })).toHaveAttribute('aria-disabled', 'true')

  let subTrigger = page.locator('[data-radcn-dropdown-menu-sub-trigger]')
  await expect(subTrigger).toContainText('Invite users')
  await subTrigger.hover()
  let subContent = page.locator('[data-radcn-dropdown-menu-sub-content]')
  await expect(subContent).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Email' })).toBeVisible()
  await subTrigger.focus()
  await page.keyboard.press('ArrowRight')
  await expect(subContent).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(subContent).toBeHidden()

  await page.getByRole('menuitem', { name: /Log out/ }).click()
  await expect(opened.content).toBeHidden()

  opened = await freshDropdown(page, 'demo')
  await opened.trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(opened.content).toBeVisible()
  await expectFocusedText(page, 'Profile')
})

test('candidate dropdown menu matches named checkbox and radio examples', async ({ page }) => {
  let opened = await freshDropdown(page, 'checkboxes')
  await opened.trigger.click()
  await expect(opened.content).toBeVisible()
  await expect(page.locator('[data-radcn-dropdown-menu-label]')).toContainText('Appearance')
  let status = page.getByRole('menuitemcheckbox', { name: /Status Bar/ })
  let activity = page.getByRole('menuitemcheckbox', { name: /Activity Bar/ })
  let panel = page.getByRole('menuitemcheckbox', { name: /Panel/ })
  await expect(status).toHaveAttribute('aria-checked', 'true')
  await expect(activity).toHaveAttribute('aria-disabled', 'true')
  await expect(panel).toHaveAttribute('aria-checked', 'false')
  await panel.click()
  await expect(opened.content).toBeHidden()
  await expect(page.locator('[data-radcn-dropdown-menu-checkbox-item]').filter({ hasText: 'Panel' })).toHaveAttribute('aria-checked', 'true')

  opened = await freshDropdown(page, 'radio-group')
  await opened.trigger.click()
  await expect(opened.content).toBeVisible()
  await expect(page.locator('[data-radcn-dropdown-menu-label]')).toContainText('Panel Position')
  let top = page.getByRole('menuitemradio', { name: 'Top' })
  let bottom = page.getByRole('menuitemradio', { name: 'Bottom' })
  let right = page.getByRole('menuitemradio', { name: 'Right' })
  await expect(bottom).toHaveAttribute('aria-checked', 'true')
  await expect(top).toHaveAttribute('aria-checked', 'false')
  await right.click()
  await expect(opened.content).toBeHidden()
  await expect(page.locator('[data-radcn-dropdown-menu-radio-item][data-value="right"]')).toHaveAttribute('aria-checked', 'true')
})

test('candidate dropdown menu matches named dialog composition', async ({ page }) => {
  let opened = await freshDropdown(page, 'dialog')
  await opened.trigger.click()
  await expect(opened.content).toBeVisible()
  await expect(opened.content).toHaveAttribute('data-align', 'end')
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await expect(page.getByRole('menuitem', { name: /Download/ })).toHaveAttribute('aria-disabled', 'true')

  await page.getByRole('menuitem', { name: /New File/ }).click()
  await expect(opened.content).toBeHidden()
  let newDialog = page.getByRole('dialog', { name: /Create New File/ })
  await expect(newDialog).toBeVisible()
  await expect(newDialog.locator('[data-radcn-field]')).toHaveCount(1)
  await expect(newDialog.locator('[data-radcn-input][name="filename"]')).toBeFocused()
  await expect(newDialog.locator('[data-radcn-input][name="filename"]')).toHaveAttribute('placeholder', 'document.txt')
  await newDialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(newDialog).toBeHidden()

  opened = await freshDropdown(page, 'dialog')
  await opened.trigger.click()
  await page.getByRole('menuitem', { name: /Share/ }).click()
  let shareDialog = page.getByRole('dialog', { name: /Share File/ })
  await expect(shareDialog).toBeVisible()
  await expect(shareDialog.locator('[data-radcn-input][name="email"]')).toHaveAttribute('placeholder', 'shadcn@vercel.com')
  await expect(shareDialog.locator('[data-radcn-textarea][name="message"]')).toHaveAttribute('placeholder', 'Check out this file')
  await shareDialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(shareDialog).toBeHidden()
})

test('candidate context menu opens from pointer and keyboard with initial focus', async ({ page }) => {
  let opened = await freshContext(page)
  await opened.target.click({ button: 'right' })
  await expect(opened.content).toBeVisible()
  await expect(opened.content).toHaveAttribute('role', 'menu')
  await expect(opened.trigger).toHaveAttribute('aria-haspopup', 'menu')
  await expect(page.locator('[data-radcn-portal-root] [data-radcn-context-menu-portal]')).toHaveCount(1)
  await expectFocusedText(page, 'Open canvas')

  await page.keyboard.press('Escape')
  await expect(opened.content).toBeHidden()
  await expect(opened.trigger).toBeFocused()

  opened = await freshContext(page)
  await opened.target.click({ button: 'right' })
  await page.getByRole('menuitem', { name: /Open canvas/ }).click()
  await expect(opened.content).toBeHidden()

  opened = await freshContext(page, 'keyboard-trigger')
  await opened.trigger.focus()
  await page.keyboard.press('ContextMenu')
  await expect(opened.content).toBeVisible()
  await expectFocusedText(page, 'Open canvas')

  await page.keyboard.press('Escape')
  opened = await freshContext(page, 'keyboard-trigger')
  await opened.trigger.focus()
  await page.keyboard.press('Shift+F10')
  await expect(opened.content).toBeVisible()
  await expectFocusedText(page, 'Open canvas')
})

test('candidate context menu roves typeahead handles disabled checked submenu and custom tokens', async ({ page }) => {
  let opened = await freshContext(page, 'checkbox-radio')
  await opened.target.click({ button: 'right' })
  await page.keyboard.press('ArrowDown')
  await expectFocusedText(page, 'Rename')
  await page.keyboard.press('r')
  await expectFocusedText(page, 'Rename')
  await page.getByRole('menuitem', { name: /Paste disabled/ }).hover()
  await expect(page.getByRole('menuitem', { name: /Paste disabled/ })).not.toHaveAttribute('data-highlighted', 'true')
  await page.getByRole('menuitem', { name: /Paste disabled/ }).click({ force: true })
  await expect(opened.content).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(opened.content).toBeHidden()

  opened = await freshContext(page, 'checkbox-radio')
  await opened.target.click({ button: 'right' })
  await page.keyboard.press('Shift+Tab')
  await expect(opened.content).toBeHidden()

  opened = await freshContext(page, 'checkbox-radio')
  await opened.target.click({ button: 'right' })
  let checkbox = page.getByRole('menuitemcheckbox', { name: /Show guides/ })
  await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  await checkbox.click()
  await expect(page.locator('[data-radcn-context-menu-checkbox-item]')).toHaveAttribute('data-state', 'unchecked')

  opened = await freshContext(page, 'submenu')
  await opened.target.click({ button: 'right' })
  let subTrigger = page.locator('[data-radcn-context-menu-sub-trigger]')
  await subTrigger.hover()
  let subContent = page.locator('[data-radcn-context-menu-sub-content]')
  await expect(subTrigger).toHaveAttribute('aria-expanded', 'true')
  await expect(subContent).toBeVisible()
  let subBox = await subContent.boundingBox()
  let stage = await page.locator('[data-fixture-stage]').boundingBox()
  expect(subBox).not.toBeNull()
  expect(stage).not.toBeNull()
  expect(subBox!.x + subBox!.width).toBeLessThanOrEqual(stage!.x + stage!.width)
  await page.mouse.move(subBox!.x + subBox!.width / 2, subBox!.y + subBox!.height / 2)
  await expect(subContent).toBeVisible()
  await subTrigger.focus()
  await page.keyboard.press('ArrowRight')
  await expect(subContent).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(subContent).toBeHidden()

  opened = await freshContext(page, 'collision')
  await opened.target.click({ button: 'right' })
  let box = await opened.content.boundingBox()
  stage = await page.locator('[data-fixture-stage]').boundingBox()
  expect(box).not.toBeNull()
  expect(stage).not.toBeNull()
  expect(box!.x + box!.width).toBeLessThanOrEqual(stage!.x + stage!.width)

  opened = await freshContext(page, 'custom-token')
  await opened.target.click({ button: 'right' })
  await expect(opened.content).toHaveClass(/radcn-fixture-custom-menu/)
  await expect(opened.content).toHaveCSS('border-color', 'rgb(124, 58, 237)')
})

test('candidate context menu matches named demo example composition', async ({ page }) => {
  let opened = await freshContext(page, 'demo')
  let trigger = opened.trigger
  let target = opened.target

  await expect(trigger).toHaveText('Right click here')
  await expect(trigger).toHaveClass(/flex/)
  await expect(trigger).toHaveClass(/h-\[150px\]/)
  await expect(trigger).toHaveClass(/w-\[300px\]/)
  await expect(trigger).toHaveClass(/items-center/)
  await expect(trigger).toHaveClass(/justify-center/)
  await expect(trigger).toHaveClass(/rounded-md/)
  await expect(trigger).toHaveClass(/border/)
  await expect(trigger).toHaveClass(/border-dashed/)
  await expect(trigger).toHaveClass(/text-sm/)
  await expect(trigger).toHaveCSS('display', 'flex')
  await expect(trigger).toHaveCSS('width', '300px')
  await expect(trigger).toHaveCSS('height', '150px')
  await expect(trigger).toHaveCSS('align-items', 'center')
  await expect(trigger).toHaveCSS('justify-content', 'center')
  await expect(trigger).toHaveCSS('border-top-style', 'dashed')
  await expect(trigger).toHaveCSS('font-size', '14px')

  await target.click({ button: 'right' })
  await expect(opened.content).toBeVisible()
  await expect(opened.content).toHaveAttribute('role', 'menu')
  await expect(opened.content).toHaveClass(/w-52/)
  await expect(opened.content).toHaveCSS('width', '208px')
  await expect(page.locator('[data-radcn-context-menu]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-context-menu-trigger]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-context-menu-portal]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-context-menu-content]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-context-menu-sub]')).toHaveCount(1)
  await expectFocusedText(page, 'Back')

  await expect(page.locator('[data-radcn-context-menu-item]')).toContainText([
    /Back/,
    /Forward/,
    /Reload/,
  ])
  await expect(page.locator('[data-radcn-context-menu-shortcut]')).toHaveText(['⌘[', '⌘]', '⌘R'])
  await expect(page.locator('[data-radcn-context-menu-item]').filter({ hasText: 'Back' })).toHaveClass(/radcn-menu-item--inset/)
  await expect(page.locator('[data-radcn-context-menu-item]').filter({ hasText: 'Reload' })).toHaveClass(/radcn-menu-item--inset/)

  let forward = page.getByRole('menuitem', { name: /Forward/ })
  await expect(forward).toHaveAttribute('aria-disabled', 'true')
  await expect(forward).toHaveAttribute('data-disabled', 'true')
  await forward.hover()
  await expect(forward).not.toHaveAttribute('data-highlighted', 'true')
  await forward.click({ force: true })
  await expect(opened.content).toBeVisible()

  let subTrigger = page.locator('[data-radcn-context-menu-sub-trigger]')
  await expect(subTrigger).toContainText('More Tools')
  await expect(subTrigger).toHaveClass(/radcn-menu-item--inset/)
  await expect(subTrigger.locator('.radcn-menu-sub-caret')).toHaveText('›')
  await subTrigger.hover()
  let subContent = page.locator('[data-radcn-context-menu-sub-content]')
  await expect(subTrigger).toHaveAttribute('aria-expanded', 'true')
  await expect(subContent).toBeVisible()
  await expect(subContent).toHaveClass(/w-44/)
  await expect(subContent).toHaveCSS('width', '176px')
  await expect(subContent.getByRole('menuitem')).toHaveText([
    'Save Page...',
    'Create Shortcut...',
    'Name Window...',
    'Developer Tools',
    'Delete',
  ])
  let deleteItem = subContent.getByRole('menuitem', { name: 'Delete' })
  await expect(deleteItem).toHaveAttribute('data-variant', 'destructive')
  await expect(deleteItem).toHaveClass(/radcn-menu-item--destructive/)
  await subTrigger.focus()
  await page.keyboard.press('ArrowRight')
  await expect(subContent).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(subContent).toBeHidden()

  await expect(page.locator('[data-radcn-context-menu-separator]')).toHaveCount(4)

  let bookmarks = page.getByRole('menuitemcheckbox', { name: 'Show Bookmarks' })
  let urls = page.getByRole('menuitemcheckbox', { name: 'Show Full URLs' })
  await expect(bookmarks).toHaveAttribute('aria-checked', 'true')
  await expect(bookmarks).toHaveAttribute('data-state', 'checked')
  await expect(bookmarks.locator('[data-radcn-menu-item-indicator]')).toBeVisible()
  await expect(urls).toHaveAttribute('aria-checked', 'false')
  await expect(urls).toHaveAttribute('data-state', 'unchecked')

  let radioGroup = page.locator('[data-radcn-context-menu-radio-group]')
  await expect(radioGroup).toHaveAttribute('data-value', 'pedro')
  await expect(page.locator('[data-radcn-context-menu-label]')).toHaveText('People')
  await expect(page.locator('[data-radcn-context-menu-label]')).toHaveClass(/radcn-menu-label--inset/)
  let pedro = page.getByRole('menuitemradio', { name: 'Pedro Duarte' })
  let colm = page.getByRole('menuitemradio', { name: 'Colm Tuite' })
  await expect(pedro).toHaveAttribute('aria-checked', 'true')
  await expect(pedro).toHaveAttribute('data-state', 'checked')
  await expect(colm).toHaveAttribute('aria-checked', 'false')
  await expect(colm).toHaveAttribute('data-state', 'unchecked')

  await page.keyboard.press('Escape')
  opened = await freshContext(page, 'demo')
  await opened.trigger.focus()
  await page.keyboard.press('ContextMenu')
  await expect(opened.content).toBeVisible()
  await expectFocusedText(page, 'Back')

  await page.keyboard.press('Escape')
  opened = await freshContext(page, 'demo')
  await opened.trigger.focus()
  await page.keyboard.press('Shift+F10')
  await expect(opened.content).toBeVisible()
  await expectFocusedText(page, 'Back')
})

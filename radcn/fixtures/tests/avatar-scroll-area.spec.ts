import { expect, test } from '@playwright/test'

const candidate = 'http://localhost:4602'

test('candidate avatar exposes image fallback badge and custom hooks', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/avatar/default`)
  let avatar = page.locator('[data-radcn-avatar]')
  await expect(avatar).toHaveAttribute('data-size', 'default')
  await expect(page.locator('[data-radcn-avatar-image]')).toHaveAttribute('alt', 'Jamie Doe')
  await expect(page.locator('[data-radcn-avatar-fallback]')).toHaveAttribute('aria-hidden', 'true')

  await page.goto(`${candidate}/fixtures/avatar/fallback`)
  await expect(page.locator('[data-radcn-avatar]')).toHaveAttribute('data-size', 'lg')
  await expect(page.locator('[data-radcn-avatar-fallback]')).toHaveText('JD')
  await expect(page.locator('[data-radcn-avatar-fallback]')).not.toHaveAttribute('aria-hidden', 'true')

  await page.goto(`${candidate}/fixtures/avatar/badge`)
  await expect(page.locator('[data-radcn-avatar-badge]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-avatar-badge]')).toHaveAttribute('aria-hidden', 'true')

  await page.goto(`${candidate}/fixtures/avatar/custom-token`)
  let custom = page.locator('[data-radcn-avatar]')
  await expect(custom).toHaveClass(/radcn-fixture-custom-avatar/)
  await expect(page.locator('[data-radcn-avatar-fallback]')).toHaveCSS('background-color', 'rgb(15, 118, 110)')
  await expect(page.locator('[data-radcn-avatar-badge]')).toHaveCSS('background-color', 'rgb(124, 58, 237)')
})

test('candidate avatar group exposes group and count slots', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/avatar/group`)
  let group = page.locator('[data-radcn-avatar-group]')
  await expect(group).toHaveAttribute('aria-label', 'Design team')
  await expect(group.locator('[data-radcn-avatar]')).toHaveCount(3)
  await expect(page.locator('[data-radcn-avatar-group-count]')).toHaveText('+4')
})

test('candidate scroll area uses native vertical and horizontal scrolling', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/scroll-area/vertical`)
  let viewport = page.locator('[data-radcn-scroll-area-viewport]')
  await expect(viewport).toHaveAttribute('aria-label', 'Scrollable release notes')
  await expect(viewport).toHaveAttribute('tabindex', '0')
  await expect(page.locator('[data-radcn-scroll-area-scrollbar][data-orientation="vertical"]')).toHaveCount(1)

  let verticalScroll = await viewport.evaluate((node) => {
    node.scrollTop = 120
    return node.scrollTop
  })
  expect(verticalScroll).toBeGreaterThan(0)

  await page.goto(`${candidate}/fixtures/scroll-area/horizontal`)
  viewport = page.locator('[data-radcn-scroll-area-viewport]')
  await expect(page.locator('[data-radcn-scroll-area-scrollbar][data-orientation="horizontal"]')).toHaveCount(1)
  await expect(page.locator('[data-radcn-scroll-area-corner]')).toHaveCount(1)

  let horizontalScroll = await viewport.evaluate((node) => {
    node.scrollLeft = 160
    return node.scrollLeft
  })
  expect(horizontalScroll).toBeGreaterThan(0)
})

test('candidate scroll area exposes focus and customization hooks', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/scroll-area/focus`)
  let viewport = page.locator('[data-radcn-scroll-area-viewport]')
  await viewport.focus()
  await expect(viewport).toBeFocused()
  await expect(viewport).not.toHaveCSS('box-shadow', 'none')

  await page.goto(`${candidate}/fixtures/scroll-area/custom-token`)
  let root = page.locator('[data-radcn-scroll-area]')
  await expect(root).toHaveClass(/radcn-fixture-custom-scroll-area/)
  await expect(root).toHaveCSS('border-color', 'rgb(15, 118, 110)')
  await expect(page.locator('[data-radcn-scroll-area-thumb]').first()).toHaveCSS('background-color', 'rgb(15, 118, 110)')
})

test('candidate scroll area demo matches Tags list composition', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/scroll-area/demo`)
  let example = page.locator('[data-scroll-area-example="demo"]')
  let root = example.locator('[data-radcn-scroll-area]')
  let viewport = example.locator('[data-radcn-scroll-area-viewport]')

  await expect(root).toHaveCSS('width', '192px')
  await expect(root).toHaveCSS('height', '288px')
  await expect(viewport).toHaveAttribute('aria-label', 'Tags')
  await expect(viewport).toHaveAttribute('tabindex', '0')
  await expect(example.getByRole('heading', { name: 'Tags' })).toBeVisible()
  await expect(example.locator('[data-scroll-area-tag]')).toHaveCount(50)
  await expect(example.locator('[data-scroll-area-tag]').first()).toHaveText('v1.2.0-beta.50')
  await expect(example.locator('[data-scroll-area-tag]').last()).toHaveText('v1.2.0-beta.1')
  await expect(example.locator('[data-radcn-separator]')).toHaveCount(49)
  await expect(example.locator('[data-radcn-scroll-area-scrollbar][data-orientation="vertical"]')).toHaveCount(1)
  await expect(example.locator('[data-radcn-scroll-area-thumb]')).toHaveCount(1)

  await viewport.focus()
  await expect(viewport).toBeFocused()
  let verticalScroll = await viewport.evaluate((node) => {
    node.scrollTop = 180
    return node.scrollTop
  })
  expect(verticalScroll).toBeGreaterThan(0)
})

test('candidate horizontal scroll area demo matches artwork composition', async ({ page }) => {
  await page.goto(`${candidate}/fixtures/scroll-area/horizontal-demo`)
  let example = page.locator('[data-scroll-area-example="horizontal-demo"]')
  let root = example.locator('[data-radcn-scroll-area]')
  let viewport = example.locator('[data-radcn-scroll-area-viewport]')

  await expect(root).toHaveCSS('width', '384px')
  await expect(root).toHaveCSS('white-space', 'nowrap')
  await expect(viewport).toHaveAttribute('aria-label', 'Artwork gallery')
  await expect(example.locator('[data-scroll-area-artwork-strip]')).toHaveCSS('width', /[1-9]\d+px/)
  await expect(example.locator('figure[data-scroll-area-artwork]')).toHaveCount(3)
  await expect(example.locator('[data-scroll-area-artwork-caption]')).toHaveText([
    'Photo by Ornella Binni',
    'Photo by Tom Byrom',
    'Photo by Vladimir Malyavko',
  ])
  for (let artist of ['Ornella Binni', 'Tom Byrom', 'Vladimir Malyavko']) {
    let image = example.getByRole('img', { name: `Photo by ${artist}` })
    await expect(image).toBeVisible()
    await expect(image).toHaveAttribute('width', '300')
    await expect(image).toHaveAttribute('height', '400')
    let src = await image.getAttribute('src')
    expect(src).toBeTruthy()
    expect(src!).not.toMatch(/^https?:/i)
    expect(src!).not.toContain('images.unsplash.com')
  }
  await expect(example.locator('[data-radcn-scroll-area-scrollbar][data-orientation="horizontal"]')).toHaveCount(1)
  await expect(example.locator('[data-radcn-scroll-area-thumb]')).toHaveCount(1)
  await expect(example.locator('[data-radcn-scroll-area-corner]')).toHaveCount(1)

  await viewport.focus()
  await expect(viewport).toBeFocused()
  let horizontalScroll = await viewport.evaluate((node) => {
    node.scrollLeft = 240
    return node.scrollLeft
  })
  expect(horizontalScroll).toBeGreaterThan(0)
})

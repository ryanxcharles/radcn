import { expect, test } from '@playwright/test'

const candidate = 'http://localhost:4602'

test('candidate serves real Tailwind v4 output through the Remix 3 asset server', async ({
  page,
  request,
}) => {
  await page.goto(`${candidate}/tailwind-probe`)

  let stylesheetHref = await page
    .locator('link[rel="stylesheet"][href*="tailwind.generated"]')
    .getAttribute('href')
  expect(stylesheetHref).toBeTruthy()

  let response = await request.get(new URL(stylesheetHref!, candidate).href)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/css')

  let css = await response.text()
  expect(css).toContain('tailwindcss v4')
  expect(css).toContain('.bg-\\[\\#112233\\]')
  // A marker utility no source file uses must be absent: proves the served
  // file is on-demand Tailwind output, not a static utility dump.
  expect(css).not.toContain('bg-\\[\\#445566\\]')

  // Theme/token contract (Experiment 2): semantic mapping, dark token block,
  // and the dark: variant conditioned on the data attribute. @theme inline
  // substitutes the var() reference directly into utilities, so the proof of
  // the mapping is bg-background compiling to var(--background).
  expect(css).toContain('background-color: var(--background)')
  // The asset server's CSS compiler may normalize attribute-selector quotes,
  // so match the dark token block with quoting left open.
  expect(css).toMatch(/\[data-radcn-theme=.?dark.?\]/)
  let darkUtility = css.slice(css.indexOf('.dark\\:bg-\\[\\#223344\\]'))
  expect(darkUtility.length).toBeGreaterThan(0)
  expect(darkUtility.slice(0, 200)).toContain('data-radcn-theme')
})

test('candidate semantic tokens resolve light and dark through the radcn theme contract', async ({
  page,
}) => {
  await page.goto(`${candidate}/tailwind-probe`)

  let light = page.locator('[data-tailwind-semantic-light]')
  await expect(light).toBeVisible()
  await expect(light).not.toHaveAttribute('style', /./)
  await expect(light).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(light).toHaveCSS('color', 'rgb(24, 24, 27)')
  await expect(light).toHaveCSS('border-color', 'rgb(228, 228, 231)')
  await expect(light).toHaveCSS('border-radius', '4.8px')

  let dark = page.locator('[data-tailwind-semantic-dark]')
  await expect(dark).toBeVisible()
  await expect(dark).not.toHaveAttribute('style', /./)
  // The dark: arbitrary utility must win over bg-background, proving the
  // custom variant fires on [data-radcn-theme="dark"].
  await expect(dark).toHaveCSS('background-color', 'rgb(34, 51, 68)')
  await expect(dark).toHaveCSS('color', 'rgb(250, 250, 250)')
  await expect(dark).toHaveCSS('border-color', 'rgb(63, 63, 70)')
})

test('candidate tailwind probe renders from Tailwind utilities with no inline styles', async ({
  page,
}) => {
  await page.goto(`${candidate}/tailwind-probe`)

  let probe = page.locator('[data-tailwind-probe]')
  await expect(probe).toBeVisible()
  await expect(probe).not.toHaveAttribute('style', /./)

  await expect(probe).toHaveCSS('display', 'flex')
  await expect(probe).toHaveCSS('flex-direction', 'column')
  await expect(probe).toHaveCSS('gap', '16px')
  await expect(probe).toHaveCSS('padding', '24px')
  // 6px, not Tailwind's default 8px: the radcn theme contract redefines
  // --radius-lg to var(--radius) (0.375rem), shadcn-style.
  await expect(probe).toHaveCSS('border-radius', '6px')
  await expect(probe).toHaveCSS('background-color', 'rgb(17, 34, 51)')
  await expect(probe).toHaveCSS('color', 'rgb(250, 250, 250)')

  let copy = page.locator('[data-tailwind-probe-copy]')
  await expect(copy).not.toHaveAttribute('style', /./)
  await expect(copy).toHaveCSS('margin-top', '8px')
})

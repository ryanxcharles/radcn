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
  await expect(probe).toHaveCSS('border-radius', '8px')
  await expect(probe).toHaveCSS('background-color', 'rgb(17, 34, 51)')
  await expect(probe).toHaveCSS('color', 'rgb(250, 250, 250)')

  let copy = page.locator('[data-tailwind-probe-copy]')
  await expect(copy).not.toHaveAttribute('style', /./)
  await expect(copy).toHaveCSS('margin-top', '8px')
})

import { expect, test } from '@playwright/test'

const themeState = () => ({
  mode: document.documentElement.dataset.radcnThemeMode,
  theme: document.documentElement.dataset.radcnTheme,
})

test.describe('theme mode control', () => {
  test('defaults to system and resolves the light system scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    await expect(page.getByRole('radiogroup', { name: 'Theme' })).toBeVisible()
    await expect(page.getByRole('radio', { name: 'System' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.getByRole('radio', { name: 'Light' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    await expect(page.getByRole('radio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    await expect(page.locator('[data-radcn-theme-toggle]')).toHaveCount(0)
    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'system', theme: 'light' })
  })

  test('defaults to system and resolves the dark system scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'system', theme: 'dark' })
    await expect(page.getByRole('radio', { name: 'System' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  test('light mode overrides and persists over a dark system scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.getByRole('radio', { name: 'Light' }).click()

    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'light', theme: 'light' })
    await expect(page.getByRole('radio', { name: 'Light' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    await page.reload()
    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'light', theme: 'light' })
  })

  test('dark mode overrides and persists over a light system scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.getByRole('radio', { name: 'Dark' }).click()

    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'dark', theme: 'dark' })
    await expect(page.getByRole('radio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    await page.reload()
    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'dark', theme: 'dark' })
  })

  test('system mode can replace an explicit override and follows the system scheme', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.getByRole('radio', { name: 'Light' }).click()
    await page.getByRole('radio', { name: 'System' }).click()

    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'system', theme: 'dark' })

    await page.reload()
    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'system', theme: 'dark' })

    await page.emulateMedia({ colorScheme: 'light' })
    await expect
      .poll(() => page.evaluate(themeState))
      .toEqual({ mode: 'system', theme: 'light' })
  })
})

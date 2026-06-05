import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test } from '@playwright/test'

const excludedExports = new Set(['.', './styles', './package.json'])
const nonExportedDispositions = ['form', 'date-picker', 'data-table']

test.describe('docs registry coverage', () => {
  test('every RadCN public subpath and known disposition has a docs route', async ({
    page,
  }) => {
    let requiredSlugs = await publicRadcnSlugs()

    for (let slug of [...requiredSlugs, ...nonExportedDispositions]) {
      let response = await page.goto(`/docs/components/${slug}`)
      expect(response?.ok(), `${slug} route should load`).toBe(true)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.getByText('Intended future install command')).toBeVisible()
      await expect(page.getByText('not published to npm yet')).toBeVisible()
    }
  })

  test('non-exported dispositions are honest draft pages', async ({ page }) => {
    for (let slug of nonExportedDispositions) {
      await page.goto(`/docs/components/${slug}`)
      await expect(page.getByText('not-shipped-yet')).toBeVisible()
      await expect(page.getByText('not an importable RadCN package API today')).toBeVisible()
      await expect(
        page.getByText(`// ${titleFromSlug(slug)} is not shipped by RadCN yet.`).first(),
      ).toBeVisible()
    }
  })

  test('representative rich-example pages still render RadCN components', async ({ page }) => {
    await page.goto('/docs/components/button')
    await expect(page.locator('[data-radcn-button]').first()).toBeVisible()

    await page.goto('/docs/components/input')
    await expect(page.locator('[data-radcn-input]').first()).toBeVisible()

    await page.goto('/docs/components/dialog')
    await expect(page.locator('[data-radcn-dialog-content]').first()).toBeVisible()

    await page.goto('/docs/components/tabs')
    await expect(page.locator('[data-radcn-tabs]').first()).toBeVisible()
  })
})

async function publicRadcnSlugs() {
  let packageJsonPath = path.resolve(process.cwd(), 'radcn/packages/radcn/package.json')
  let packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
    exports: Record<string, string>
  }

  return Object.keys(packageJson.exports)
    .filter((subpath) => !excludedExports.has(subpath))
    .map((subpath) => subpath.replace(/^\.\//, ''))
    .sort()
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

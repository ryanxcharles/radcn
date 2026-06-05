import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { fixtureScenarios } from '../scenarios/index.ts'

type FixtureApp = 'reference' | 'candidate'

interface ManifestEntry {
  app: FixtureApp
  component: string
  scenario: string
  screenshot: string
  status: 'pass'
  url: string
}

interface ArtifactManifest {
  apps: Record<FixtureApp, { port: number; url: string }>
  entries: ManifestEntry[]
  generatedAt: string
  scenarios: Array<{ component: string; id: string; title: string }>
  viewport: { width: number; height: number }
}

const apps: Record<FixtureApp, { port: number; url: string }> = {
  reference: { port: 4601, url: 'http://localhost:4601' },
  candidate: { port: 4602, url: 'http://localhost:4602' },
}

const viewport = { width: 1280, height: 900 }
const artifactsDir = path.resolve(import.meta.dirname, '../artifacts')
const manifestEntries: ManifestEntry[] = []

test.beforeAll(async () => {
  await rm(artifactsDir, { force: true, recursive: true })
  await mkdir(artifactsDir, { recursive: true })
})

test.afterAll(async () => {
  let manifest: ArtifactManifest = {
    apps,
    entries: manifestEntries,
    generatedAt: new Date().toISOString(),
    scenarios: fixtureScenarios.map(({ component, id, title }) => ({ component, id, title })),
    viewport,
  }

  await writeFile(path.join(artifactsDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
})

for (let scenario of fixtureScenarios) {
  for (let appName of Object.keys(apps) as FixtureApp[]) {
    test(`${appName} ${scenario.component}/${scenario.id}`, async ({ page }) => {
      let app = apps[appName]
      let url = `${app.url}/fixtures/${scenario.component}/${scenario.id}`
      let screenshotPath = path.join(appName, scenario.component, `${scenario.id}.png`)
      let absoluteScreenshotPath = path.join(artifactsDir, screenshotPath)

      await page.setViewportSize(viewport)
      await page.goto(url)

      let shell = page.locator('main[data-fixture-app]').first()
      await expect(shell).toHaveAttribute('data-fixture-app', appName)
      await expect(shell).toHaveAttribute('data-component', scenario.component)
      await expect(shell).toHaveAttribute('data-scenario', scenario.id)

      let stage = shell.locator('[data-fixture-stage]')
      await expect(stage).toHaveCount(1)

      await mkdir(path.dirname(absoluteScreenshotPath), { recursive: true })
      await stage.screenshot({ path: absoluteScreenshotPath })

      manifestEntries.push({
        app: appName,
        component: scenario.component,
        scenario: scenario.id,
        screenshot: path.relative(artifactsDir, absoluteScreenshotPath),
        status: 'pass',
        url,
      })
    })
  }
}

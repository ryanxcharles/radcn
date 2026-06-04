import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  reporter: [['list']],
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 900 },
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'America/Chicago',
    screenshot: 'off',
    trace: 'off',
    video: 'off',
  },
  webServer: [
    {
      command: 'pnpm fixtures:reference:dev',
      url: 'http://localhost:4601',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'pnpm fixtures:candidate:dev',
      url: 'http://localhost:4602',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
})

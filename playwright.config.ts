import { defineConfig, devices } from '@playwright/test'

const rawBase = process.env.PAGES_BASE ?? '/southern-italy-2026/'
const pagesBase = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`
const deployedBaseUrl = process.env.DEPLOYED_BASE_URL
  ? `${process.env.DEPLOYED_BASE_URL.replace(/\/+$/, '')}/`
  : undefined

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: deployedBaseUrl ?? `http://127.0.0.1:4173${pagesBase}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  expect: { timeout: 10_000 },
  timeout: 30_000,
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit-mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
      },
    },
  ],
  webServer: deployedBaseUrl
    ? undefined
    : {
        command: `npx vite preview --host 127.0.0.1 --strictPort --port 4173 --base ${pagesBase}`,
        url: `http://127.0.0.1:4173${pagesBase}`,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
})

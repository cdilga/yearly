import { defineConfig, devices } from '@playwright/test';

const deployedUrl = process.env.DEPLOYED_URL;
const baseURL = deployedUrl || 'http://localhost:8787';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run local dev server before starting tests (only when not testing deployed site)
  webServer: deployedUrl
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:8787',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});

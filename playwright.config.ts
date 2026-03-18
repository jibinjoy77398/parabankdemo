import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup.ts',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,   // 1 retry locally for flaky network tests
  workers: process.env.CI ? 4 : 4,    // 4 parallel workers locally and in CI
  reporter: [['html'], ['list'], ['json', { outputFile: 'test-results.json' }]],      // show live output + HTML report + JSON for automation
  use: {
    baseURL: 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,              // 15s per action to handle slow site
    navigationTimeout: 30000,          // 30s for page navigations
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
  ],
});

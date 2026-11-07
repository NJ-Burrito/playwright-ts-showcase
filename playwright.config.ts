import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
export const STORAGE_STATE = '.auth/standard-user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'chromium',
      testMatch: /ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        storageState: STORAGE_STATE,
      },
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});

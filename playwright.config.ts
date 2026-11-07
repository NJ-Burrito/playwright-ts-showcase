import { defineConfig, devices } from '@playwright/test';
import { API_BASE_URL, STORAGE_STATE, UI_BASE_URL } from './config/constants';

const isCI = !!process.env.CI;

// The setup and UI projects share one target, so the baseURL is defined once.
const uiTarget = { baseURL: UI_BASE_URL };

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
      use: { ...uiTarget },
    },
    {
      name: 'chromium',
      testMatch: /ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], ...uiTarget, storageState: STORAGE_STATE },
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});

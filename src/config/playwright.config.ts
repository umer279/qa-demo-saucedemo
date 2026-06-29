import { defineConfig, devices } from '@playwright/test';
import { TIMEOUTS } from '@config/timeouts';
import { environment } from '@config/env';
import { getEnv } from '@config/env-helper';
import path from 'path';

const projectRoot = path.resolve(__dirname, '../..');
const testDirectory = path.join(projectRoot, 'tests');
const monocartReportOutFile = path.join(projectRoot, 'reports/monocart-report-latest/index.html');

export default defineConfig({
  globalSetup: path.join(projectRoot, 'src/lib/global-setup.ts'),
  testDir: testDirectory,
  timeout: TIMEOUTS.test,
  expect: {
    timeout: TIMEOUTS.expect,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    [
      'monocart-reporter',
      {
        name: 'SauceDemo QA Report',
        outputFile: monocartReportOutFile,
      },
    ],
    ['list'],
  ],
  use: {
    testIdAttribute: 'data-test',
    locale: 'en-US',
    baseURL: getEnv(environment.BASE_URL),
    actionTimeout: TIMEOUTS.actions,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testDir: path.join(testDirectory, 'frontend'),
    },
  ],
});

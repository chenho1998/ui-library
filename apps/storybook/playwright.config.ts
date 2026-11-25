import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const port = Number(process.env.STORYBOOK_PORT ?? 6007);
const baseURL = `http://127.0.0.1:${port}`;
// Locally reuse system Chrome when installed so developers don't have to download Chromium first; CI uses Playwright Chromium.
const useChromeChannel = !process.env.CI && process.platform === 'darwin' && existsSync('/Applications/Google Chrome.app');

export default defineConfig({
  testDir: './visual',
  snapshotPathTemplate: '{testDir}/__snapshots__/{arg}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.015,
    },
  },
  use: {
    baseURL,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(useChromeChannel ? { channel: 'chrome' } : {}),
      },
    },
  ],
  webServer: {
    command: 'node visual/serve.mjs',
    url: `${baseURL}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

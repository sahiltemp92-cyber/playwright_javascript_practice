// @ts-check
import { defineConfig } from '@playwright/test';

const config = defineConfig({
  testDir: './tests_ts',
  snapshotPathTemplate: '{rootDir}/screenshots/{arg}{ext}',
  timeout: 60 * 1000,
  expect: { timeout: 40 * 1000 },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: false,
    trace: 'on'
  },
  retries: 0
})

export default config


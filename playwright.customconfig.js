// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */


const config = ({
  /* Default tests folder */
  testDir: './tests',
  snapshotPathTemplate: '{rootDir}/screenshots/{arg}{ext}',
  timeout: 60 * 1000, // Default test timeout set to 60 seconds
  expect: { timeout: 40 * 1000 }, // Default expect assert timeout set to 40 seconds
  reporter: 'html',  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  projects: [
    {
      name: 'Safari',
      use: {
        browserName: 'webkit',
        headless: false,
        screenshot: 'on',
        trace: 'on',
        viewport: { width: 1920, height: 1080 }, // Standard Desktop
        ignoreHttpsErrors: true, // Ignore HTTPS Errors
        permissions: ["geolocation"] // Ask for permission on every load
      }
    },
    {
      name: 'Desktop Safari',
      use: {
        browserName: 'webkit',
        headless: false,
        screenshot: 'on',
        trace: 'on',
        ...devices['Desktop Safari']
      }
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
        headless: false,
        screenshot: 'on',
        trace: 'on',
        viewport: { width: 720, height: 720 }

      }
    }
  ]

})

module.exports = config

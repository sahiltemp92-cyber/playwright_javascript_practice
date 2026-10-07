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
  retries: 1,  /* Retry on failure */
  workers: 4,  /* Number of workers */

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
        permissions: ["geolocation"], // Ask for permission on every load
        video: 'retain-on-failure' // Video recording for test failure  
      }
    },
    {
      name: 'Desktop Safari',
      use: {
        browserName: 'webkit',
        headless: false,
        screenshot: 'on',
        trace: 'on',
        ...devices['Desktop Safari'],
        ignoreHttpsErrors: true, // Ignore HTTPS Errors
        permissions: ["geolocation"], // Ask for permission on every load
        video: 'retain-on-failure' // Video recording for test failure  
      }
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
        headless: false,
        screenshot: 'on',
        trace: 'on',
        viewport: { width: 720, height: 720 },
        ignoreHttpsErrors: true, // Ignore HTTPS Errors
        permissions: ["geolocation"], // Ask for permission on every load
        video: 'retain-on-failure' // Video recording for test failure

      }
    }
  ],

})

module.exports = config

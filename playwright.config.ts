import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// quiet: true suppresses dotenv's own promotional console logs.
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 3,
  reporter: [["./reporters/minimal-list.ts"], ["html"]],
  use: {
    baseURL: process.env.BASE_URL || "https://automationexercise.com",

    /* The site exposes stable data-qa="..." attributes — use them like data-testid. */
    testIdAttribute: "data-qa",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  // Once you have a login flow, add a "setup" project + storageState here
  // (see https://playwright.dev/docs/auth) so specs can start already logged in.
});

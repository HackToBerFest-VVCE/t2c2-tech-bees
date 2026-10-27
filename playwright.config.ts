import { defineConfig, devices } from "@playwright/test";

// Runs the e2e tests against a production build served on port 3100,
// using an isolated temporary data directory (local demo mode, no Supabase).
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  use: { baseURL: "http://localhost:3100", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100/api/health",
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: {
      OPPORTUNITYSHIELD_DATA_DIR: ".data-e2e",
      SUPABASE_URL: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
      SAFE_BROWSING_API_KEY: "",
    },
  },
});

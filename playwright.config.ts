import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: process.env.PW_BASE_URL || "http://localhost:8001",
    headless: true,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});

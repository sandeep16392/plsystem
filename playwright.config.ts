import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e-tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1, // Sequential: tests share backend state
  retries: 0,
  reporter: [
    ["html", { outputFolder: "e2e-tests/report" }],
    ["list"],
  ],
  use: {
    baseURL: "http://localhost:5173",
    // Video recording for all tests
    video: {
      mode: "on",
      size: { width: 390, height: 844 }, // iPhone 14 size
    },
    screenshot: "on",
    trace: "on",
    // Mobile viewport
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    isMobile: true,
    hasTouch: true,
  },
  outputDir: "e2e-tests/recordings",
  projects: [
    {
      name: "mobile-chrome",
      use: {
        browserName: "chromium",
      },
    },
  ],
  webServer: [
    {
      // Backend
      command:
        "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000",
      port: 8000,
      reuseExistingServer: true,
      timeout: 15_000,
    },
    {
      // Frontend
      command: "cd frontend && npx vite --port 5173",
      port: 5173,
      reuseExistingServer: true,
      timeout: 15_000,
    },
  ],
});

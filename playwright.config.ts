import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './',
  reporter: 'html',
  use: {
    screenshot: 'only-on-failure',
    trace: 'on'
  },
  timeout: 240 * 1000,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

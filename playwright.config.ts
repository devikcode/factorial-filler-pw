import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './',
  reporter: 'html',
  use: {
    screenshot: 'only-on-failure',
    trace: 'on'
  },
  timeout: 120000,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

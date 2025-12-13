import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './',
  reporter: 'html',
  use: {
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

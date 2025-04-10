import { defineConfig, devices } from '@playwright/test';
import path from 'path';
// import os from 'os';

// const cpuCount = os.cpus().length;

// console.log(`🧠 Доступно логических ядер: ${cpuCount}`);
// console.log(`🛠️  Playwright, скорее всего, будет использовать ${cpuCount} воркеров (если ты не в CI)`);

export default defineConfig({
  testDir: './tests',
  timeout: 20000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0,

  retries: 3,
  // workers: 4,
  // workers: process.env.CI ? 1 : undefined,
  // workers: cpuCount,
  reporter: [
    ['line'],
    ['json', { outputFile: 'logs/test-report.json' }],
    ['junit', { outputFile: 'logs/junit/test-report-junit.xml' }],
    [path.resolve(__dirname, 'reporters/generators/generator-test-report.ts')]
  ],
  
  use: {
    // baseURL: 'http://localhost:3000',
    // trace: 'on-first-retry',
    // video: 'on-first-retry',
    // screenshot: 'only-on-failure',
    
    // Navigation waits for load, network, etc. events to complete
    navigationTimeout: 30000,
    
    // Additional parameters
    actionTimeout: 15000,
    viewport: { width: 1280, height: 720 },
    
    // Use built-in permissions for geolocation, permissions
    permissions: ['geolocation'],
    
    // Browser configuration
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false,
    acceptDownloads: true
  },
  
  // Project configuration for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  // Disable HTML report
  outputDir: 'html-report'
});
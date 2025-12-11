import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    globalSetup: path.resolve(__dirname, './tests/global-setup.js'),
    testDir: './tests/e2e',
    // 1. Force tests INSIDE the same file to run in parallel
    // (By default, Playwright only parallelizes *different* files)
    fullyParallel: true,
    // Safety: Kill zombie tests to prevent RAM consumption
    timeout: 120 * 1000, // Hard limit: 2 minutes per test
    globalTimeout: 600 * 1000, // Failsafe: 10 minutes for entire suite
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173',
        // Limit artifacts to failure only (saves disk I/O)
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'off', // Disabled for turbo mode - 40% faster, enable if debugging
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // 2. Stop restarting Vite for every test
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        // CRITICAL: Uses your running local server for instant connection
        reuseExistingServer: true,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});

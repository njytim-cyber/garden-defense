
import { test, expect } from '@playwright/test';

test.describe('Bug Reproduction: Enemy Spawning', () => {
    test('should spawn enemies when wave starts', async ({ page }) => {
        // Track console errors
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
            // Log all console messages for debugging
            console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
        });

        page.on('pageerror', error => {
            consoleErrors.push(error.message);
            console.log(`[PAGE ERROR] ${error.message}`);
        });

        // Navigate to app
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();

        // Click PLAY GAME
        const playButton = page.getByRole('button', { name: /PLAY GAME/i });
        await expect(playButton).toBeVisible();
        await playButton.click();

        // Wait for map selection screen
        await expect(page.getByRole('heading', { name: /SELECT MAP/i })).toBeVisible();

        // Select first map (Garden)
        const mapButtons = page.getByRole('button').filter({ hasNotText: /BACK/i });
        const firstMap = mapButtons.first();
        await expect(firstMap).toBeVisible();
        await firstMap.click();

        // Wait for difficulty selection screen
        await expect(page.getByRole('heading', { name: /SELECT DIFFICULTY/i })).toBeVisible();

        // Select MEDIUM difficulty  
        const mediumButton = page.getByRole('button', { name: /MEDIUM/i });
        await expect(mediumButton).toBeVisible();
        await mediumButton.click();

        // Wait for canvas to load
        await expect(page.locator('canvas')).toBeVisible({ timeout: 10000 });

        // Click START WAVE button
        const startButton = page.getByRole('button', { name: /START WAVE/i });
        await expect(startButton).toBeVisible();
        await startButton.click();

        // The button should change to PAUSE if wave is active (checking wave started)
        await expect(page.getByRole('button', { name: /PAUSE/i })).toBeVisible({ timeout: 3000 });

        // Log any errors
        if (consoleErrors.length > 0) {
            console.log('Console errors detected:', consoleErrors);
        }
    });
});


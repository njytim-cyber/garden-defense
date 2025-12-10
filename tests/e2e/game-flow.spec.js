import { test, expect } from '@playwright/test';

test.describe('Garden Defense - Core Game Flow', () => {
    test('should load main menu with styled UI', async ({ page }) => {
        // PARANOID RULE: Hydration wait
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();

        // Verify styled main menu
        const playButton = page.getByRole('button', { name: /PLAY GAME/i });
        await expect(playButton).toBeVisible();

        const shopButton = page.getByRole('button', { name: /SHOP/i });
        await expect(shopButton).toBeVisible();

        const skinsButton = page.getByRole('button', { name: /SKINS/i });
        await expect(skinsButton).toBeVisible();

        const guideButton = page.getByRole('button', { name: /GUIDE/i });
        await expect(guideButton).toBeVisible();

        // Verify title
        await expect(page.getByText('GARDEN DEFENSE')).toBeVisible();
    });

    test('should navigate to map selection', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();

        const playButton = page.getByRole('button', { name: /PLAY GAME/i });
        await expect(playButton).toBeVisible();

        await playButton.click();

        // Wait for map selection screen heading (specific to avoid matching map names)
        await expect(page.getByRole('heading', { name: /SELECT MAP/i })).toBeVisible();
    });

    test('should start game from map selection', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();

        // Navigate to map selection
        const playButton = page.getByRole('button', { name: /PLAY GAME/i });
        await expect(playButton).toBeVisible();
        await playButton.click();

        // Wait for maps to load
        await page.waitForTimeout(500); // Small wait for map list

        // Select first available map (Garden)
        const mapButtons = page.getByRole('button');
        const firstMap = mapButtons.first();
        await expect(firstMap).toBeVisible();
        await firstMap.click();

        // Should show difficulty selection or game canvas
        await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });
    });

    test('should display game canvas and HUD', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();

        // Start game
        await page.getByRole('button', { name: /PLAY GAME/i }).click();
        await page.waitForTimeout(500);

        const maps = page.getByRole('button');
        await maps.first().click();

        // Verify game elements
        const canvas = page.locator('#gameCanvas');
        await expect(canvas).toBeVisible({ timeout: 5000 });

        // Check for HUD elements (lives, money, wave)
        await expect(page.locator('#livesDisplay')).toBeVisible();
        await expect(page.locator('#moneyDisplay')).toBeVisible();
        await expect(page.locator('#waveDisplay')).toBeVisible();
    });
});

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

        // Wait for map selection heading to appear
        await expect(page.getByRole('heading', { name: /SELECT MAP/i })).toBeVisible();

        // Select first available map (Garden)
        const mapButtons = page.getByRole('button').filter({ hasNotText: /BACK/i });
        const firstMap = mapButtons.first();
        await expect(firstMap).toBeVisible();
        await firstMap.click();

        // Should show difficulty selection screen
        await expect(page.getByRole('heading', { name: /SELECT DIFFICULTY/i })).toBeVisible();

        // Select MEDIUM difficulty
        const mediumButton = page.getByRole('button', { name: /MEDIUM/i });
        await expect(mediumButton).toBeVisible();
        await mediumButton.click();

        // Should show game canvas
        await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });
    });

    test('should display game canvas and HUD', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();

        // Navigate: Menu -> Maps -> Difficulty -> Game
        const playButton = page.getByRole('button', { name: /PLAY GAME/i });
        await expect(playButton).toBeVisible();
        await playButton.click();

        // Wait for maps screen
        await expect(page.getByRole('heading', { name: /SELECT MAP/i })).toBeVisible();

        // Select first map
        const mapButtons = page.getByRole('button').filter({ hasNotText: /BACK/i });
        const firstMap = mapButtons.first();
        await expect(firstMap).toBeVisible();
        await firstMap.click();

        // Wait for difficulty screen
        await expect(page.getByRole('heading', { name: /SELECT DIFFICULTY/i })).toBeVisible();

        // Select EASY difficulty
        const easyButton = page.getByRole('button', { name: /EASY/i });
        await expect(easyButton).toBeVisible();
        await easyButton.click();

        // Verify game canvas loads
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible({ timeout: 5000 });

        // Check for HUD elements (lives display with heart emoji)
        await expect(page.getByText('❤️')).toBeVisible();
        await expect(page.getByText('💰')).toBeVisible();

        // Check for wave control button
        await expect(page.getByRole('button', { name: /START WAVE/i })).toBeVisible();
    });
});

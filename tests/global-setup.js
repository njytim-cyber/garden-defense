import { execSync } from 'child_process';

async function globalSetup() {
    try {
        // Clean up zombie browser processes before test run
        if (process.platform !== 'win32') {
            // Mac/Linux: Kill processes matching playwright browser patterns
            execSync('pkill -f "playwright" || true', { stdio: 'ignore' });
            execSync('pkill -f "headless_shell" || true', { stdio: 'ignore' });
            execSync('pkill -f "Chromium" || true', { stdio: 'ignore' });
        } else {
            // Windows: Kill only node processes running playwright
            execSync('taskkill /F /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq *playwright*" 2>nul || exit 0', { stdio: 'ignore' });
            execSync('taskkill /F /FI "IMAGENAME eq chrome.exe" /FI "WINDOWTITLE eq *Playwright*" 2>nul || exit 0', { stdio: 'ignore' });
        }
        console.log('🧹 Cleaned up zombie browsers.');
    } catch (e) {
        // Ignore errors (no processes found)
    }
}

export default globalSetup;

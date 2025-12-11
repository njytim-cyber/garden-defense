/**
 * Script to remove white backgrounds from PNG images
 * Makes all tower and enemy assets truly transparent
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function removeWhiteBackground(inputPath, outputPath) {
    try {
        // Read the image
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Get raw pixel data
        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        // Process pixels - make white pixels transparent
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If pixel is white or very close to white (threshold: 240)
            if (r > 240 && g > 240 && b > 240) {
                data[i + 3] = 0; // Make transparent
            }
        }

        // Save the processed image
        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .png()
            .toFile(outputPath);

        console.log(`✅ ${path.basename(inputPath)}`);
    } catch (error) {
        console.error(`❌ ${path.basename(inputPath)}: ${error.message}`);
    }
}

async function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️ Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath);
    const pngFiles = files.filter(f => f.endsWith('.png'));

    console.log(`\n📁 ${path.basename(dirPath)}: ${pngFiles.length} files`);

    for (const file of pngFiles) {
        const inputPath = path.join(dirPath, file);
        const outputPath = path.join(dirPath, file);
        await removeWhiteBackground(inputPath, outputPath);
    }
}

async function main() {
    console.log('🎨 Removing white backgrounds...\n');

    const baseDir = path.join(__dirname, '..');
    const towersDir = path.join(baseDir, 'assets', 'towers');
    const enemiesDir = path.join(baseDir, 'assets', 'enemies');

    await processDirectory(towersDir);
    await processDirectory(enemiesDir);

    console.log('\n✨ Done! Refresh your browser to see transparent backgrounds.');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

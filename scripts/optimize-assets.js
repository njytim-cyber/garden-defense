/**
 * Asset Optimization Script
 * Converts PNGs to WebP, resizes to optimal dimensions, and compresses
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_SIZE = 64; // Target dimension
const WEBP_QUALITY = 85; // Good balance of quality/size

async function optimizeImage(inputPath) {
    const ext = path.extname(inputPath);
    const outputPath = inputPath.replace(ext, '.webp');
    const filename = path.basename(inputPath);

    try {
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;

        // Read, resize to 64x64, convert to WebP
        await sharp(inputPath)
            .resize(TARGET_SIZE, TARGET_SIZE, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp({ quality: WEBP_QUALITY, alphaQuality: 100 })
            .toFile(outputPath);

        const newStats = fs.statSync(outputPath);
        const newSize = newStats.size;
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

        console.log(`✅ ${filename} → ${path.basename(outputPath)} (${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB, ${savings}% smaller)`);

        // Delete original PNG after successful conversion
        fs.unlinkSync(inputPath);

        return { original: originalSize, optimized: newSize };
    } catch (error) {
        console.error(`❌ ${filename}: ${error.message}`);
        return null;
    }
}

async function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️ Directory not found: ${dirPath}`);
        return { count: 0, savedBytes: 0 };
    }

    const files = fs.readdirSync(dirPath);
    const pngFiles = files.filter(f => f.endsWith('.png'));

    console.log(`\n📁 ${path.basename(dirPath)}: ${pngFiles.length} PNG files to optimize`);

    let totalOriginal = 0;
    let totalOptimized = 0;
    let processedCount = 0;

    for (const file of pngFiles) {
        const inputPath = path.join(dirPath, file);
        const result = await optimizeImage(inputPath);
        if (result) {
            totalOriginal += result.original;
            totalOptimized += result.optimized;
            processedCount++;
        }
    }

    return {
        count: processedCount,
        savedBytes: totalOriginal - totalOptimized,
        totalOriginal,
        totalOptimized
    };
}

async function updateManifest(manifestPath) {
    // Update manifest to reference .webp files instead of .png
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    let updated = false;
    for (const category of ['towers', 'enemies']) {
        if (manifest[category]) {
            for (const [key, value] of Object.entries(manifest[category])) {
                if (typeof value === 'string' && value.endsWith('.png')) {
                    manifest[category][key] = value.replace('.png', '.webp');
                    updated = true;
                }
            }
        }
    }

    if (updated) {
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
        console.log('\n📝 Updated asset-manifest.json to use .webp extensions');
    }
}

async function main() {
    console.log('🔧 Optimizing game assets (PNG → WebP, 64x64)...\n');

    const baseDir = path.join(__dirname, '..');
    const towersDir = path.join(baseDir, 'assets', 'towers');
    const enemiesDir = path.join(baseDir, 'assets', 'enemies');
    const manifestPath = path.join(baseDir, 'assets', 'asset-manifest.json');

    const results = [];
    results.push(await processDirectory(towersDir));
    results.push(await processDirectory(enemiesDir));

    const totalSaved = results.reduce((sum, r) => sum + (r.savedBytes || 0), 0);
    const totalCount = results.reduce((sum, r) => sum + r.count, 0);

    console.log(`\n✨ Optimization complete!`);
    console.log(`   Files processed: ${totalCount}`);
    console.log(`   Total size saved: ${(totalSaved / 1024).toFixed(1)} KB`);

    // Update manifest to use .webp
    await updateManifest(manifestPath);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

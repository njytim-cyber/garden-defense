/**
 * Generate final missing enemy: gargoyle
 */
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../assets/enemies');
const MANIFEST_PATH = path.resolve(__dirname, '../assets/asset-manifest.json');

async function main() {
    console.log('🎨 Generating: Gargoyle...');

    const accessToken = execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
    const projectId = execSync('gcloud config get-value project', { encoding: 'utf-8' }).trim();

    const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash-image:generateContent`;

    const prompt = `Create a 64x64 pixel game sprite icon for a tower defense game enemy. The character is: stone gargoyle with wings and claws. Style: Top-down view, stylized cartoon art, vibrant colors, clean edges. Primary color should be #57534e. Background: Fully transparent. The sprite should be centered and fill most of the 64x64 space. Make it look like a professional game asset, cute but menacing.`;

    const requestBody = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'], temperature: 0.4 }
    };

    const tempFile = path.join(os.tmpdir(), 'gargoyle_req.json');
    const tempOutFile = path.join(os.tmpdir(), 'gargoyle_res.json');

    await fs.writeFile(tempFile, JSON.stringify(requestBody));
    execSync(`curl -s -X POST "${endpoint}" -H "Authorization: Bearer ${accessToken}" -H "Content-Type: application/json" -d @"${tempFile}" -o "${tempOutFile}"`, { maxBuffer: 50 * 1024 * 1024 });

    const result = JSON.parse(await fs.readFile(tempOutFile, 'utf-8'));
    await fs.unlink(tempFile).catch(() => { });
    await fs.unlink(tempOutFile).catch(() => { });

    if (result.error) {
        console.log(`❌ API Error: ${result.error.message}`);
        return;
    }

    for (const candidate of result.candidates || []) {
        for (const part of candidate.content?.parts || []) {
            if (part.inlineData?.data) {
                const filename = `enemy_gargoyle_${Date.now()}.png`;
                await fs.mkdir(OUTPUT_DIR, { recursive: true });
                await fs.writeFile(path.join(OUTPUT_DIR, filename), Buffer.from(part.inlineData.data, 'base64'));
                console.log(`✅ Saved: ${filename}`);

                // Update manifest
                const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'));
                manifest.enemies.gargoyle = `enemies/${filename}`;
                await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 4));
                console.log('📝 Updated asset-manifest.json');
                console.log('\n🎉 ALL ENEMIES COMPLETE!');
                return;
            }
        }
    }
    console.log('⚠️ No image in response');
}

main().catch(console.error);

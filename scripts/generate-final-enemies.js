/**
 * Final retry for missing enemies with 30 second intervals
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

// Final 6 missing enemies
const ENEMIES_TO_GENERATE = [
    { id: 'dark_knight', name: 'Dark Knight', color: '#020617', desc: 'black armored evil knight with dark sword' },
    { id: 'sneak', name: 'Sneak', color: '#059669', desc: 'stealthy green ninja-like creature with daggers' },
    { id: 'healer', name: 'Healer', color: '#f472b6', desc: 'pink robed healer with healing staff and magic aura' },
    { id: 'prince', name: 'Prince', color: '#a855f7', desc: 'royal purple prince with crown and evil smirk' },
    { id: 'gargoyle', name: 'Gargoyle', color: '#57534e', desc: 'stone gargoyle with wings and claws' },
    { id: 'reinforced_ninja', name: 'Dark Ninja', color: '#171717', desc: 'elite dark ninja boss with glowing red eyes' }
];

const DELAY_MS = 30000; // 30 seconds between calls

function buildPrompt(enemy) {
    return `Create a 64x64 pixel game sprite icon for a tower defense game enemy. The character is: ${enemy.desc}. Style: Top-down view, stylized cartoon art, vibrant colors, clean edges. Primary color should be ${enemy.color}. Background: Fully transparent. The sprite should be centered and fill most of the 64x64 space. Make it look like a professional game asset, cute but menacing.`;
}

function getAccessToken() {
    return execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
}

function getProjectId() {
    return execSync('gcloud config get-value project', { encoding: 'utf-8' }).trim();
}

async function generateEnemy(enemy, accessToken, projectId, location = 'us-central1') {
    console.log(`🎨 Generating: ${enemy.name} (${enemy.id})...`);

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-2.5-flash-image:generateContent`;

    const requestBody = {
        contents: [{ role: 'user', parts: [{ text: buildPrompt(enemy) }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'], temperature: 0.4 }
    };

    const tempFile = path.join(os.tmpdir(), `vertex_request_${Date.now()}.json`);
    const tempOutFile = path.join(os.tmpdir(), `vertex_response_${Date.now()}.json`);

    try {
        await fs.writeFile(tempFile, JSON.stringify(requestBody));
        execSync(`curl -s -X POST "${endpoint}" -H "Authorization: Bearer ${accessToken}" -H "Content-Type: application/json" -d @"${tempFile}" -o "${tempOutFile}"`, { maxBuffer: 50 * 1024 * 1024 });

        const result = JSON.parse(await fs.readFile(tempOutFile, 'utf-8'));
        await fs.unlink(tempFile).catch(() => { });
        await fs.unlink(tempOutFile).catch(() => { });

        if (result.error) {
            console.log(`  ❌ API Error: ${result.error.message}`);
            return null;
        }

        for (const candidate of result.candidates || []) {
            for (const part of candidate.content?.parts || []) {
                if (part.inlineData?.data) {
                    const filename = `enemy_${enemy.id}_${Date.now()}.png`;
                    await fs.mkdir(OUTPUT_DIR, { recursive: true });
                    await fs.writeFile(path.join(OUTPUT_DIR, filename), Buffer.from(part.inlineData.data, 'base64'));
                    console.log(`  ✅ Saved: ${filename}`);
                    return { id: enemy.id, filename };
                }
            }
        }
        console.log(`  ⚠️ No image in response`);
        return null;
    } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        return null;
    }
}

async function updateManifest(generatedAssets) {
    const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'));
    for (const asset of generatedAssets.filter(a => a)) {
        manifest.enemies[asset.id] = `enemies/${asset.filename}`;
    }
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 4));
    console.log('\n📝 Updated asset-manifest.json');
}

async function main() {
    console.log('🔑 Getting gcloud credentials...');
    const accessToken = getAccessToken();
    const projectId = getProjectId();

    console.log(`🚀 Final retry: 6 missing enemies (${DELAY_MS / 1000}s intervals)`);
    console.log(`   Estimated time: ~${Math.round(ENEMIES_TO_GENERATE.length * DELAY_MS / 60000)} minutes\n`);

    const generatedAssets = [];
    for (let i = 0; i < ENEMIES_TO_GENERATE.length; i++) {
        generatedAssets.push(await generateEnemy(ENEMIES_TO_GENERATE[i], accessToken, projectId));
        if (i < ENEMIES_TO_GENERATE.length - 1) {
            console.log(`   ⏳ Waiting ${DELAY_MS / 1000}s...`);
            await new Promise(r => setTimeout(r, DELAY_MS));
        }
    }

    console.log(`\n✨ Complete: ${generatedAssets.filter(a => a).length}/${ENEMIES_TO_GENERATE.length} created`);
    if (generatedAssets.some(a => a)) await updateManifest(generatedAssets);
}

main().catch(console.error);

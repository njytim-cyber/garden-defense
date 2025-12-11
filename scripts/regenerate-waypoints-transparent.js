/**
 * Regenerate waypoint images with explicit transparent background instruction
 */
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../assets/waypoints');
const MANIFEST_PATH = path.resolve(__dirname, '../assets/asset-manifest.json');

const WAYPOINTS = [
    {
        id: 'castle',
        name: 'Castle',
        prompt: `Create a 128x128 pixel game sprite icon for a tower defense game. A majestic medieval green castle with towers, battlements, and a flag. Top-down isometric view, stylized fantasy art. The image MUST have a completely transparent background with NO white background, NO backdrop, NO floor - just the castle floating. PNG format with alpha channel transparency.`
    },
    {
        id: 'shrine',
        name: 'Sacred Shrine',
        prompt: `Create a 128x128 pixel game sprite icon for a tower defense game. A sacred red shrine/temple with glowing orb at top and mystical aura. Top-down isometric view, stylized fantasy art. The image MUST have a completely transparent background with NO white background, NO backdrop, NO floor - just the shrine floating. PNG format with alpha channel transparency.`
    }
];

const DELAY_MS = 15000;

async function generate(waypoint, accessToken, projectId) {
    console.log(`🎨 Regenerating: ${waypoint.name} (with transparent background)...`);

    const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash-image:generateContent`;

    const requestBody = {
        contents: [{ role: 'user', parts: [{ text: waypoint.prompt }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'], temperature: 0.4 }
    };

    const tempFile = path.join(os.tmpdir(), `waypoint_req_${Date.now()}.json`);
    const tempOutFile = path.join(os.tmpdir(), `waypoint_res_${Date.now()}.json`);

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
                    const filename = `${waypoint.id}_${Date.now()}.png`;
                    await fs.mkdir(OUTPUT_DIR, { recursive: true });
                    await fs.writeFile(path.join(OUTPUT_DIR, filename), Buffer.from(part.inlineData.data, 'base64'));
                    console.log(`  ✅ Saved: ${filename}`);
                    return { id: waypoint.id, filename };
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

async function main() {
    console.log('🔑 Getting gcloud credentials...');
    const accessToken = execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
    const projectId = execSync('gcloud config get-value project', { encoding: 'utf-8' }).trim();

    console.log(`🚀 Regenerating waypoint images with transparent backgrounds\n`);

    const results = [];
    for (let i = 0; i < WAYPOINTS.length; i++) {
        results.push(await generate(WAYPOINTS[i], accessToken, projectId));
        if (i < WAYPOINTS.length - 1) {
            console.log(`   ⏳ Waiting ${DELAY_MS / 1000}s...`);
            await new Promise(r => setTimeout(r, DELAY_MS));
        }
    }

    // Update manifest
    const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'));
    if (!manifest.waypoints) manifest.waypoints = {};
    for (const result of results.filter(r => r)) {
        manifest.waypoints[result.id] = `waypoints/${result.filename}`;
    }
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 4));

    console.log(`\n✨ Complete: ${results.filter(r => r).length}/${WAYPOINTS.length} waypoints regenerated`);
    console.log('📝 Updated asset-manifest.json');
}

main().catch(console.error);

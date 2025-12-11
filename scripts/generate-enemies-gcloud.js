/**
 * Enemy Asset Generation Script using gcloud CLI + Vertex AI REST API
 * Uses gemini-2.5-flash-image model via gcloud authentication
 * Windows-compatible: uses temp file for JSON body
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

// All missing enemy definitions
const ENEMIES_TO_GENERATE = [
    { id: 'orc', name: 'Orc', color: '#166534', desc: 'muscular green-skinned orc warrior with a crude club' },
    { id: 'bandit', name: 'Bandit', color: '#7c2d12', desc: 'hooded bandit thief with brown cloak and dagger' },
    { id: 'knight', name: 'Knight', color: '#eab308', desc: 'armored golden knight with sword and shield' },
    { id: 'wizard', name: 'Wizard', color: '#3b82f6', desc: 'blue robed wizard with pointy hat and glowing staff' },
    { id: 'reinforced_mech', name: 'Heavy Mech', color: '#57534e', desc: 'heavy armored mechanical robot with thick plating' },
    { id: 'viking', name: 'Viking', color: '#1e3a8a', desc: 'bearded viking warrior with horned helmet and axe' },
    { id: 'samurai', name: 'Samurai', color: '#991b1b', desc: 'red armored samurai with katana sword' },
    { id: 'drone', name: 'Drone', color: '#0ea5e9', desc: 'small flying drone with propellers, cyan colored' },
    { id: 'ghost', name: 'Ghost', color: '#cbd5e1', desc: 'translucent white ghost with flowing ethereal form' },
    { id: 'troll', name: 'Troll', color: '#3f6212', desc: 'large dark green troll with tusks and massive fists' },
    { id: 'ent', name: 'Ent', color: '#365314', desc: 'ancient tree creature with bark skin and branch arms' },
    { id: 'gargoyle', name: 'Gargoyle', color: '#57534e', desc: 'stone gargoyle with wings and claws' },
    { id: 'sorcerer', name: 'Sorcerer', color: '#7e22ce', desc: 'dark purple robed sorcerer with magical energy' },
    { id: 'shade', name: 'Shade', color: '#0f172a', desc: 'dark shadowy figure with glowing eyes' },
    { id: 'slime', name: 'Slime', color: '#84cc16', desc: 'large green slime blob with a cute face' },
    { id: 'yeti', name: 'Yeti', color: '#f0f9ff', desc: 'massive white furry yeti with icy breath' },
    { id: 'magma_golem', name: 'Magma Golem', color: '#7f1d1d', desc: 'lava rock golem with glowing magma cracks' },
    { id: 'cyborg', name: 'Cyborg', color: '#0891b2', desc: 'half-human half-robot cyborg with cybernetic parts' },
    { id: 'dark_knight', name: 'Dark Knight', color: '#020617', desc: 'black armored evil knight with dark sword' },
    { id: 'tank', name: 'Tank', color: '#14532d', desc: 'heavily armored tank-like creature with massive shields' },
    { id: 'sneak', name: 'Sneak', color: '#059669', desc: 'stealthy green ninja-like creature with daggers' },
    { id: 'assassin', name: 'Assassin', color: '#000000', desc: 'black cloaked assassin with twin blades' },
    { id: 'healer', name: 'Healer', color: '#f472b6', desc: 'pink robed healer with healing staff and magic aura' },
    { id: 'mech', name: 'Mech', color: '#d946ef', desc: 'purple mechanical robot walker' },
    { id: 'mech-rider', name: 'Mech Rider', color: '#a21caf', desc: 'magenta mech with a pilot visible inside' },
    { id: 'reinforced_ninja', name: 'Dark Ninja', color: '#171717', desc: 'elite dark ninja boss with glowing red eyes' },
    { id: 'boss', name: 'The Boss', color: '#a855f7', desc: 'large purple demon boss with horns and cape' },
    { id: 'prince', name: 'Prince', color: '#a855f7', desc: 'royal purple prince with crown and evil smirk' },
    { id: 'king', name: 'The King', color: '#eab308', desc: 'massive golden king with ornate crown and scepter' },
    { id: 'emperor', name: 'Emperor', color: '#dc2626', desc: 'godlike emperor with rainbow aura and divine armor' }
];

function buildPrompt(enemy) {
    return `Create a 64x64 pixel game sprite icon for a tower defense game enemy. The character is: ${enemy.desc}. Style: Top-down view, stylized cartoon art, vibrant colors, clean edges. Primary color should be ${enemy.color}. Background: Fully transparent. The sprite should be centered and fill most of the 64x64 space. Make it look like a professional game asset, cute but menacing.`;
}

function getAccessToken() {
    try {
        return execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
    } catch (error) {
        console.error('Failed to get access token. Run: gcloud auth login');
        process.exit(1);
    }
}

function getProjectId() {
    try {
        return execSync('gcloud config get-value project', { encoding: 'utf-8' }).trim();
    } catch (error) {
        console.error('Failed to get project ID. Run: gcloud config set project YOUR_PROJECT_ID');
        process.exit(1);
    }
}

async function generateEnemy(enemy, accessToken, projectId, location = 'us-central1') {
    console.log(`🎨 Generating: ${enemy.name} (${enemy.id})...`);

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-2.5-flash-image:generateContent`;

    const requestBody = {
        contents: [{
            role: 'user',
            parts: [{ text: buildPrompt(enemy) }]
        }],
        generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
            temperature: 0.4
        }
    };

    // Write JSON to temp file to avoid shell escaping issues
    const tempFile = path.join(os.tmpdir(), `vertex_request_${Date.now()}.json`);
    const tempOutFile = path.join(os.tmpdir(), `vertex_response_${Date.now()}.json`);

    try {
        await fs.writeFile(tempFile, JSON.stringify(requestBody));

        // Use curl with -d @file to read from file
        const curlCmd = `curl -s -X POST "${endpoint}" -H "Authorization: Bearer ${accessToken}" -H "Content-Type: application/json" -d @"${tempFile}" -o "${tempOutFile}"`;

        execSync(curlCmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });

        const responseContent = await fs.readFile(tempOutFile, 'utf-8');
        const result = JSON.parse(responseContent);

        // Cleanup temp files
        await fs.unlink(tempFile).catch(() => { });
        await fs.unlink(tempOutFile).catch(() => { });

        if (result.error) {
            console.log(`  ❌ API Error: ${result.error.message}`);
            return null;
        }

        // Find image in response
        for (const candidate of result.candidates || []) {
            for (const part of candidate.content?.parts || []) {
                if (part.inlineData && part.inlineData.data) {
                    const buffer = Buffer.from(part.inlineData.data, 'base64');

                    const filename = `enemy_${enemy.id}_${Date.now()}.png`;
                    const outputPath = path.join(OUTPUT_DIR, filename);

                    await fs.mkdir(OUTPUT_DIR, { recursive: true });
                    await fs.writeFile(outputPath, buffer);

                    console.log(`  ✅ Saved: ${filename}`);
                    return { id: enemy.id, filename };
                }
            }
        }

        console.log(`  ⚠️ No image in response`);
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.log(`     Text response: ${result.candidates[0].content.parts[0].text.substring(0, 150)}...`);
        }
        return null;
    } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        // Cleanup on error
        await fs.unlink(tempFile).catch(() => { });
        await fs.unlink(tempOutFile).catch(() => { });
        return null;
    }
}

async function updateManifest(generatedAssets) {
    const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'));

    for (const asset of generatedAssets) {
        if (asset) {
            manifest.enemies[asset.id] = `enemies/${asset.filename}`;
        }
    }

    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 4));
    console.log('\n📝 Updated asset-manifest.json');
}

async function main() {
    console.log('🔑 Getting gcloud credentials...');
    const accessToken = getAccessToken();
    const projectId = getProjectId();

    console.log(`🚀 Starting enemy asset generation`);
    console.log(`   Project: ${projectId}`);
    console.log(`   Model: gemini-2.5-flash-image`);
    console.log(`   Enemies to generate: ${ENEMIES_TO_GENERATE.length}\n`);

    const generatedAssets = [];

    for (const enemy of ENEMIES_TO_GENERATE) {
        const result = await generateEnemy(enemy, accessToken, projectId);
        generatedAssets.push(result);

        // Delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const successCount = generatedAssets.filter(a => a !== null).length;
    console.log(`\n✨ Generation complete: ${successCount}/${ENEMIES_TO_GENERATE.length} assets created`);

    if (successCount > 0) {
        await updateManifest(generatedAssets);
    }
}

main().catch(console.error);

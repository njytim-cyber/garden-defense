/**
 * Enemy Asset Generation Script using Gemini 2.5 Flash Image
 * Uses Vertex AI to generate enemy sprites for the tower defense game
 */
import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../assets/enemies');
const MANIFEST_PATH = path.resolve(__dirname, '../assets/asset-manifest.json');

// All missing enemy definitions with their colors and descriptions
const ENEMIES_TO_GENERATE = [
    // Wave 11-25
    { id: 'orc', name: 'Orc', color: '#166534', desc: 'muscular green-skinned orc warrior with a crude club' },
    { id: 'bandit', name: 'Bandit', color: '#7c2d12', desc: 'hooded bandit thief with brown cloak and dagger' },
    { id: 'knight', name: 'Knight', color: '#eab308', desc: 'armored golden knight with sword and shield' },
    { id: 'wizard', name: 'Wizard', color: '#3b82f6', desc: 'blue robed wizard with pointy hat and glowing staff' },
    { id: 'reinforced_mech', name: 'Heavy Mech', color: '#57534e', desc: 'heavy armored mechanical robot with thick plating' },

    // Wave 26-40
    { id: 'viking', name: 'Viking', color: '#1e3a8a', desc: 'bearded viking warrior with horned helmet and axe' },
    { id: 'samurai', name: 'Samurai', color: '#991b1b', desc: 'red armored samurai with katana sword' },
    { id: 'drone', name: 'Drone', color: '#0ea5e9', desc: 'small flying drone with propellers, cyan colored' },
    { id: 'ghost', name: 'Ghost', color: '#cbd5e1', desc: 'translucent white ghost with flowing ethereal form' },
    { id: 'troll', name: 'Troll', color: '#3f6212', desc: 'large dark green troll with tusks and massive fists' },

    // Wave 41-60
    { id: 'ent', name: 'Ent', color: '#365314', desc: 'ancient tree creature with bark skin and branch arms' },
    { id: 'gargoyle', name: 'Gargoyle', color: '#57534e', desc: 'stone gargoyle with wings and claws' },
    { id: 'sorcerer', name: 'Sorcerer', color: '#7e22ce', desc: 'dark purple robed sorcerer with magical energy' },
    { id: 'shade', name: 'Shade', color: '#0f172a', desc: 'dark shadowy figure with glowing eyes' },
    { id: 'slime', name: 'Slime', color: '#84cc16', desc: 'large green slime blob with a cute face' },

    // Wave 61+
    { id: 'yeti', name: 'Yeti', color: '#f0f9ff', desc: 'massive white furry yeti with icy breath' },
    { id: 'magma_golem', name: 'Magma Golem', color: '#7f1d1d', desc: 'lava rock golem with glowing magma cracks' },
    { id: 'cyborg', name: 'Cyborg', color: '#0891b2', desc: 'half-human half-robot cyborg with cybernetic parts' },
    { id: 'dark_knight', name: 'Dark Knight', color: '#020617', desc: 'black armored evil knight with dark sword' },
    { id: 'tank', name: 'Tank', color: '#14532d', desc: 'heavily armored tank-like creature with massive shields' },

    // Special enemies
    { id: 'sneak', name: 'Sneak', color: '#059669', desc: 'stealthy green ninja-like creature with daggers' },
    { id: 'assassin', name: 'Assassin', color: '#000000', desc: 'black cloaked assassin with twin blades' },
    { id: 'healer', name: 'Healer', color: '#f472b6', desc: 'pink robed healer with healing staff and magic aura' },
    { id: 'mech', name: 'Mech', color: '#d946ef', desc: 'purple mechanical robot walker' },
    { id: 'mech-rider', name: 'Mech Rider', color: '#a21caf', desc: 'magenta mech with a pilot visible inside' },

    // Bosses
    { id: 'reinforced_ninja', name: 'Dark Ninja', color: '#171717', desc: 'elite dark ninja boss with glowing red eyes' },
    { id: 'boss', name: 'The Boss', color: '#a855f7', desc: 'large purple demon boss with horns and cape' },
    { id: 'prince', name: 'Prince', color: '#a855f7', desc: 'royal purple prince with crown and evil smirk' },
    { id: 'king', name: 'The King', color: '#eab308', desc: 'massive golden king with ornate crown and scepter' },
    { id: 'emperor', name: 'Emperor', color: '#dc2626', desc: 'godlike emperor with rainbow aura and divine armor' }
];

function buildPrompt(enemy) {
    return `Create a 64x64 pixel game sprite icon for a tower defense game enemy. 
The character is: ${enemy.desc}.
Style: Top-down view, stylized cartoon art, vibrant colors, clean edges.
Primary color should be ${enemy.color}.
Background: Fully transparent.
The sprite should be centered and fill most of the 64x64 space.
Make it look like a professional game asset, cute but menacing.`;
}

async function generateEnemy(vertexAI, enemy) {
    const generativeModel = vertexAI.getGenerativeModel({
        model: 'gemini-2.5-flash-preview-05-20', // Gemini 2.5 Flash with image generation
    });

    console.log(`🎨 Generating: ${enemy.name} (${enemy.id})...`);

    try {
        const result = await generativeModel.generateContent({
            contents: [{
                role: 'user',
                parts: [{ text: buildPrompt(enemy) }]
            }],
            generationConfig: {
                responseModalities: ['image', 'text'],
                responseMimeType: 'image/png',
            }
        });

        // Find the image part in the response
        const response = result.response;
        for (const candidate of response.candidates || []) {
            for (const part of candidate.content?.parts || []) {
                if (part.inlineData) {
                    const imageData = part.inlineData.data;
                    const buffer = Buffer.from(imageData, 'base64');

                    const filename = `enemy_${enemy.id}_${Date.now()}.png`;
                    const outputPath = path.join(OUTPUT_DIR, filename);

                    await fs.mkdir(OUTPUT_DIR, { recursive: true });
                    await fs.writeFile(outputPath, buffer);

                    console.log(`  ✅ Saved: ${filename}`);
                    return { id: enemy.id, filename };
                }
            }
        }

        console.log(`  ⚠️ No image in response for ${enemy.name}`);
        return null;
    } catch (error) {
        console.error(`  ❌ Error generating ${enemy.name}:`, error.message);
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
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_PROJECT_ID;
    const location = process.env.VERTEX_LOCATION || 'us-central1';

    if (!projectId) {
        console.error('ERROR: Please set GOOGLE_CLOUD_PROJECT or VERTEX_PROJECT_ID environment variable');
        console.error('Example: GOOGLE_CLOUD_PROJECT=your-project-id node scripts/generate-enemies.js');
        process.exit(1);
    }

    console.log(`🚀 Starting enemy asset generation`);
    console.log(`   Project: ${projectId}`);
    console.log(`   Location: ${location}`);
    console.log(`   Model: gemini-2.5-flash-preview-05-20`);
    console.log(`   Enemies to generate: ${ENEMIES_TO_GENERATE.length}\n`);

    const vertexAI = new VertexAI({
        project: projectId,
        location: location
    });

    const generatedAssets = [];

    for (const enemy of ENEMIES_TO_GENERATE) {
        const result = await generateEnemy(vertexAI, enemy);
        generatedAssets.push(result);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successCount = generatedAssets.filter(a => a !== null).length;
    console.log(`\n✨ Generation complete: ${successCount}/${ENEMIES_TO_GENERATE.length} assets created`);

    if (successCount > 0) {
        await updateManifest(generatedAssets);
    }
}

main().catch(console.error);

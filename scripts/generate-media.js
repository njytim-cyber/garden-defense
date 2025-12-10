/**
 * AI Asset Generation Script
 * Uses Vertex AI Imagen 3 to generate game assets
 */
import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MANIFEST_PATH = path.resolve(__dirname, '../assets/asset-manifest.json');
const OUTPUT_DIR = path.resolve(__dirname, '../src/assets/generated');

async function loadManifest() {
    const content = await fs.readFile(MANIFEST_PATH, 'utf-8');
    return JSON.parse(content);
}

async function generateAsset(vertexAI, prompt, outputPath, options = {}) {
    const generativeModel = vertexAI.getGenerativeModel({
        model: options.model || 'imagen-3.0-generate-001',
    });

    console.log(`Generating: ${prompt}`);

    const result = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: options.temperature || 0.4,
            candidateCount: 1,
            ...options.generationConfig
        }
    });

    // Extract image data and save
    const imageData = result.response.candidates[0].content.parts[0].inlineData.data;
    const buffer = Buffer.from(imageData, 'base64');

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, buffer);

    console.log(`✓ Saved: ${outputPath}`);
}

async function main() {
    const manifest = await loadManifest();

    if (!manifest.defaults.project_id || manifest.defaults.project_id === 'YOUR_VERTEX_AI_PROJECT_ID') {
        console.error('ERROR: Please set your Vertex AI project_id in assets/asset-manifest.json');
        process.exit(1);
    }

    const vertexAI = new VertexAI({
        project: manifest.defaults.project_id,
        location: manifest.defaults.location
    });

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const asset of manifest.assets) {
        const outputPath = path.join(OUTPUT_DIR, asset.filename);
        await generateAsset(vertexAI, asset.prompt, outputPath, {
            model: manifest.defaults.model,
            ...asset.options
        });
    }

    console.log('\n✓ All assets generated successfully!');
}

main().catch(console.error);

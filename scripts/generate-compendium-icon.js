/**
 * Generate Compendium/Book icon
 */
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../assets/ui');

async function main() {
    console.log('🎨 Generating Compendium Icon...');

    const accessToken = execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
    const projectId = execSync('gcloud config get-value project', { encoding: 'utf-8' }).trim();

    const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash-image:generateContent`;

    const prompt = `Create a 64x64 pixel game UI icon. A stylized magical book/tome with golden edges, cyan glowing runes, and slight magical sparkles. Fantasy game style, clean vector-like art. The book should be slightly open with pages visible. Background: FULLY TRANSPARENT with NO white backdrop. PNG format with alpha channel.`;

    const requestBody = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'], temperature: 0.4 }
    };

    const tempFile = path.join(os.tmpdir(), 'compendium_req.json');
    const tempOutFile = path.join(os.tmpdir(), 'compendium_res.json');

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
                const filename = `compendium_icon.png`;
                await fs.mkdir(OUTPUT_DIR, { recursive: true });
                await fs.writeFile(path.join(OUTPUT_DIR, filename), Buffer.from(part.inlineData.data, 'base64'));
                console.log(`✅ Saved: assets/ui/${filename}`);
                return;
            }
        }
    }
    console.log('⚠️ No image in response');
}

main().catch(console.error);

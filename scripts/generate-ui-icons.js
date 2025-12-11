/**
 * Script to generate UI icons using Vertex AI
 * Replaces emojis with consistent pixel art style icons
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const icons = [
    {
        name: 'heart',
        prompt: 'A pixel art red heart icon, 64x64 pixels, vibrant red color, game UI style, solid background removed, transparent PNG, no shadow, clean edges'
    },
    {
        name: 'coin',
        prompt: 'A pixel art gold coin icon, 64x64 pixels, shiny golden color, game UI style, transparent background, no shadow, clean edges'
    },
    {
        name: 'cart',
        prompt: 'A pixel art shopping cart icon, 64x64 pixels, metallic gray color, game UI style, transparent background, no shadow, clean edges'
    },
    {
        name: 'crown',
        prompt: 'A pixel art golden crown icon, 64x64 pixels, royal gold color with jewels, game UI style, transparent background, no shadow'
    },
    {
        name: 'shirt',
        prompt: 'A pixel art t-shirt icon, 64x64 pixels, blue fabric color, game UI style, transparent background, clothing shop icon'
    }
];

async function generateIcons() {
    console.log('🎨 Generating UI icons...\n');

    const uiDir = path.join(__dirname, '..', 'assets', 'ui');
    if (!fs.existsSync(uiDir)) {
        fs.mkdirSync(uiDir, { recursive: true });
    }

    // Get access token
    const token = execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();

    for (const icon of icons) {
        console.log(`Generating ${icon.name} icon...`);

        const payload = {
            contents: [{
                role: 'user',
                parts: [{ text: icon.prompt }]
            }],
            generationConfig: {
                responseModalities: ['image', 'text'],
                temperature: 1.0
            }
        };

        const tempFile = path.join(__dirname, `temp_${icon.name}.json`);
        fs.writeFileSync(tempFile, JSON.stringify(payload));

        try {
            const response = execSync(`curl -s -X POST "https://us-central1-aiplatform.googleapis.com/v1/projects/njytim-cyber/locations/us-central1/publishers/google/models/gemini-2.5-flash-preview-05-20:generateContent" -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d @${tempFile}`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });

            const result = JSON.parse(response);
            const parts = result.candidates?.[0]?.content?.parts || [];

            for (const part of parts) {
                if (part.inlineData?.mimeType?.startsWith('image/')) {
                    const imageData = Buffer.from(part.inlineData.data, 'base64');
                    const outputPath = path.join(uiDir, `${icon.name}_icon.png`);
                    fs.writeFileSync(outputPath, imageData);
                    console.log(`✅ Saved: ${outputPath}`);
                    break;
                }
            }
        } catch (error) {
            console.error(`❌ Failed to generate ${icon.name}: ${error.message}`);
        }

        fs.unlinkSync(tempFile);

        // Delay between requests
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log('\n✨ Done generating UI icons!');
}

generateIcons().catch(console.error);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const balancePath = path.join(__dirname, '../src/data/balance.json');
const outputPath = path.join(__dirname, '../docs/data/balance_schema.md');

// Ensure docs/data directory exists
const docsDataDir = path.join(__dirname, '../docs/data');
if (!fs.existsSync(docsDataDir)) {
    fs.mkdirSync(docsDataDir, { recursive: true });
}

// Read balance.json
const balanceData = JSON.parse(fs.readFileSync(balancePath, 'utf-8'));

// Generate markdown documentation
let markdown = `# Balance Data Schema\n\n`;
markdown += `**Version:** ${balanceData.version}\n\n`;
markdown += `*Auto-generated from \`src/data/balance.json\`*\n\n`;
markdown += `---\n\n`;

// Player Configuration
markdown += `## Player Configuration\n\n`;
markdown += `**Starting Lives:** ${balanceData.player.startingLives}\n\n`;
markdown += `### Difficulties\n\n`;
markdown += `| Difficulty | Starting Money | Speed Multiplier |\n`;
markdown += `|------------|----------------|------------------|\n`;
for (const [diff, config] of Object.entries(balanceData.player.difficulties)) {
    markdown += `| ${diff} | ${config.startMoney} | ${config.speedMultiplier}x |\n`;
}
markdown += `\n`;

// Towers
markdown += `## Towers\n\n`;
markdown += `| ID | Name | Cost | Range | Damage | Cooldown | Special |\n`;
markdown += `|----|------|------|-------|--------|----------|----------|\n`;
for (const [id, tower] of Object.entries(balanceData.towers)) {
    const special = [];
    if (tower.effect) special.push(`${tower.effect}`);
    if (tower.isBarracks) special.push('Barracks');
    if (tower.isHero) special.push('Hero');
    if (tower.isTrap) special.push('Trap');
    if (tower.waterOnly) special.push('Water Only');
    if (tower.amphibious) special.push('Amphibious');
    if (tower.locked) special.push('🔒 Locked');
    const specialStr = special.length > 0 ? special.join(', ') : '-';
    markdown += `| \`${id}\` | ${tower.name} | ${tower.cost} | ${tower.range} | ${tower.damage} | ${tower.cooldown} | ${specialStr} |\n`;
}
markdown += `\n`;

// Enemies
markdown += `## Enemies\n\n`;
markdown += `| ID | Name | Base Health | Base Speed | Bounty | Type | Radius |\n`;
markdown += `|----|------|-------------|------------|--------|------|--------|\n`;
for (const [id, enemy] of Object.entries(balanceData.enemies)) {
    markdown += `| \`${id}\` | ${enemy.name} | ${enemy.baseHealth} | ${enemy.baseSpeed} | ${enemy.bounty} | ${enemy.type} | ${enemy.radius} |\n`;
}
markdown += `\n`;

// Waves
markdown += `## Wave Configuration\n\n`;
markdown += `**Base Count:** ${balanceData.waves.baseCount}\n\n`;
markdown += `**Growth Rate:** ${balanceData.waves.growthRate}\n\n`;
markdown += `**Health Multiplier per Wave:** ${balanceData.waves.healthMultiplier}\n\n`;
markdown += `**Base Bonus:** ${balanceData.waves.baseBonus}\n\n`;
markdown += `**Meta Gold Base:** ${balanceData.waves.metaGoldBase}\n\n`;
markdown += `**Meta Gold per Wave:** ${balanceData.waves.metaGoldPerWave}\n\n`;

markdown += `### Spawn Rules by Wave Range\n\n`;
for (const [range, rule] of Object.entries(balanceData.waves.spawnRules)) {
    markdown += `#### ${range.replace('waves', 'Waves ').replace('_', '-')}\n\n`;
    markdown += `| Enemy | Weight |\n`;
    markdown += `|-------|--------|\n`;
    for (let i = 0; i < rule.enemies.length; i++) {
        markdown += `| ${rule.enemies[i]} | ${rule.weights[i]} |\n`;
    }
    markdown += `\n`;
}

markdown += `### Boss Waves\n\n`;
markdown += `| Wave | Boss |\n`;
markdown += `|------|------|\n`;
for (const [wave, boss] of Object.entries(balanceData.waves.bosses)) {
    markdown += `| ${wave.replace('wave', 'Wave ')} | ${boss} |\n`;
}
markdown += `\n`;

markdown += `---\n\n`;
markdown += `*Last updated: ${new Date().toISOString()}*\n`;

// Write to file
fs.writeFileSync(outputPath, markdown, 'utf-8');

console.log(`✅ Generated balance schema documentation at ${outputPath}`);

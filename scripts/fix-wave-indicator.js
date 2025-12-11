// Fix wave indicator blinking by adding smooth fade logic
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'containers', 'GameEngineContainer.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the wave indicator logic
const oldPattern = `                    // DRAW INCOMING WAVE OVERLAY (After placement to be on top)
                    if (!isWaveActive && !isPaused && waveNumber < 100) {`;

const newPattern = `                    // DRAW INCOMING WAVE OVERLAY (Smooth fade to avoid blinking)
                    const shouldShowIndicator = !isWaveActive && !isPaused && waveNumber < 100;
                    
                    // Smooth fade in/out (0.015 ~= fade over 300ms at 60fps)
                    if (shouldShowIndicator) {
                        waveIndicatorOpacityRef.current = Math.min(1, waveIndicatorOpacityRef.current + 0.015);
                    } else {
                        waveIndicatorOpacityRef.current = Math.max(0, waveIndicatorOpacityRef.current - 0.015);
                    }
                    
                    // Only draw if visible
                    if (waveIndicatorOpacityRef.current > 0) {`;

content = content.replace(oldPattern, newPattern);

// Add globalAlpha line after ctx.save()
content = content.replace(
    /ctx\.save\(\);\n(\s+)\/\/ Label/,
    `ctx.save();\n$1ctx.globalAlpha = waveIndicatorOpacityRef.current; // Apply fade\n$1\n$1// Label`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Wave indicator fade fix applied');

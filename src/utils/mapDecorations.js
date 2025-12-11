/**
 * Generate static decorations for a map (flowers, bushes, etc.)
 * Call this ONCE when loading a map, not every frame!
 */
export function generateMapDecorations(canvasWidth, canvasHeight, sceneryType) {
    const decorations = [];

    switch (sceneryType) {
        case 'forest':
        case 'dense_forest':
        case 'jungle':
            // Generate flower positions
            const flowerColors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#ec4899'];
            for (let i = 0; i < 15; i++) {
                decorations.push({
                    type: 'flower',
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
                });
            }

            // Generate bush positions
            for (let i = 0; i < 8; i++) {
                decorations.push({
                    type: 'bush',
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight
                });
            }
            break;

        // Add other scenery types here as needed
    }

    return decorations;
}

/**
 * Draw pre-generated decorations
 */
export function drawDecorations(ctx, decorations) {
    for (const deco of decorations) {
        switch (deco.type) {
            case 'flower':
                // Flower petals
                ctx.fillStyle = deco.color;
                for (let p = 0; p < 5; p++) {
                    const angle = (p / 5) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.arc(deco.x + Math.cos(angle) * 4, deco.y + Math.sin(angle) * 4, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Flower center
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(deco.x, deco.y, 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'bush':
                // Small bushes/shrubs
                ctx.fillStyle = 'rgba(21, 128, 61, 0.4)';
                ctx.beginPath();
                ctx.arc(deco.x, deco.y, 8, 0, Math.PI * 2);
                ctx.arc(deco.x - 6, deco.y + 4, 6, 0, Math.PI * 2);
                ctx.arc(deco.x + 6, deco.y + 4, 6, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    }
}

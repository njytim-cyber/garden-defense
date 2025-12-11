/**
 * Canvas Rendering Utilities
 * Extracted from monolith (lines 1661-2260)
 * Pure drawing functions - no React dependencies
 */

/**
 * Draw path on canvas
 */
import { PATH_WIDTH, START_POINT_RADIUS, END_POINT_RADIUS } from '../constants/GameConstants';
import { drawPolygon, drawStar } from './shapeHelpers';

export function drawPath(ctx, path, canvasWidth, canvasHeight, sceneryType, assetLoader = null) {

    if (path.length === 0) return;

    // Convert waypoints to canvas coordinates
    const points = path.map(p => ({
        x: p.x * canvasWidth,
        y: p.y * canvasHeight
    }));

    // Determine path colors based on scenery type
    let outerColor, innerColor;
    switch (sceneryType) {
        case 'ocean':
            outerColor = '#1e40af';
            innerColor = '#3b82f6';
            break;
        case 'volcano':
            outerColor = '#7f1d1d';
            innerColor = '#f97316';
            break;
        case 'magic':
            outerColor = '#581c87';
            innerColor = '#a855f7';
            break;
        case 'desert':
            outerColor = '#92400e';
            innerColor = '#eab308';
            break;
        case 'forest':
        case 'jungle':
        case 'dense_forest':
            outerColor = '#654321'; // Brown dirt path
            innerColor = '#8B7355'; // Lighter dirt
            break;
        case 'rocky':
            outerColor = '#3f3f46';
            innerColor = '#a1a1aa';
            break;
        case 'castle':
            outerColor = '#292524';
            innerColor = '#78716c';
            break;
        default:
            outerColor = '#78350f';
            innerColor = '#a16207';
    }

    // Outer path (darker)
    ctx.strokeStyle = outerColor;
    ctx.lineWidth = PATH_WIDTH.outer;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Inner path (lighter)
    ctx.strokeStyle = innerColor;
    ctx.lineWidth = PATH_WIDTH.inner;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Inner shadow for depth (dug-in effect)
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = PATH_WIDTH.inner - 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();

    // Add stepping stones/cobblestone pattern for forest paths
    if (sceneryType === 'forest' || sceneryType === 'dense_forest') {
        ctx.fillStyle = '#9CA3AF';
        const stoneSpacing = 30;
        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.floor(dist / stoneSpacing);
            for (let j = 0; j < steps; j++) {
                const t = j / steps;
                const sx = points[i].x + dx * t;
                const sy = points[i].y + dy * t;
                ctx.beginPath();
                ctx.arc(sx, sy, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Add glow effect for magical maps
    if (sceneryType === 'magic') {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = PATH_WIDTH.outer + 6;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }

    // Dashed border with flowing animation (spawn → base direction)
    const dashOffset = (Date.now() / 50) % 20; // Animate over time
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = -dashOffset; // Negative to flow forward
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Reduced opacity for subtlety
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Start point - Castle
    const startX = points[0].x;
    const startY = points[0].y;
    const castleImg = assetLoader?.getWaypointAsset('castle');

    if (castleImg) {
        // Draw castle image (128px, centered)
        const size = 96;
        ctx.drawImage(castleImg, startX - size / 2, startY - size / 2 - 10, size, size);
    } else {
        // Fallback: procedural castle (2x scale)
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(startX - 24, startY - 16, 48, 32);
        ctx.fillRect(startX - 28, startY - 32, 16, 24);
        ctx.fillRect(startX + 12, startY - 32, 16, 24);
        ctx.fillStyle = '#15803d';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(startX - 28 + i * 8, startY - 36, 6, 4);
            ctx.fillRect(startX + 12 + i * 8, startY - 36, 6, 4);
        }
        ctx.fillStyle = '#78350f';
        ctx.fillRect(startX - 8, startY - 8, 16, 24);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY - 32);
        ctx.lineTo(startX, startY - 52);
        ctx.stroke();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(startX, startY - 52);
        ctx.lineTo(startX + 16, startY - 44);
        ctx.lineTo(startX, startY - 36);
        ctx.fill();
    }

    // End point - Sacred Shrine
    const endPoint = points[points.length - 1];
    const shrineX = endPoint.x;
    const shrineY = endPoint.y;
    const shrineImg = assetLoader?.getWaypointAsset('shrine');

    if (shrineImg) {
        // Draw shrine image (128px, centered)
        const size = 96;
        ctx.drawImage(shrineImg, shrineX - size / 2, shrineY - size / 2 - 10, size, size);
    } else {
        // Fallback: procedural shrine (2x scale)
        ctx.fillStyle = '#78716c';
        ctx.fillRect(shrineX - 32, shrineY + 12, 64, 8);
        ctx.fillRect(shrineX - 28, shrineY + 4, 56, 8);
        ctx.fillStyle = sceneryType === 'magic' ? '#a855f7' : '#dc2626';
        ctx.beginPath();
        ctx.moveTo(shrineX - 24, shrineY + 4);
        ctx.lineTo(shrineX - 24, shrineY - 16);
        ctx.lineTo(shrineX - 16, shrineY - 24);
        ctx.lineTo(shrineX, shrineY - 32);
        ctx.lineTo(shrineX + 16, shrineY - 24);
        ctx.lineTo(shrineX + 24, shrineY - 16);
        ctx.lineTo(shrineX + 24, shrineY + 4);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f5f5f4';
        ctx.fillRect(shrineX - 20, shrineY - 12, 6, 16);
        ctx.fillRect(shrineX + 14, shrineY - 12, 6, 16);
        ctx.strokeStyle = sceneryType === 'magic' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(220, 38, 38, 0.6)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(shrineX, shrineY - 12, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = sceneryType === 'magic' ? '#e9d5ff' : '#fecaca';
        ctx.beginPath();
        ctx.arc(shrineX, shrineY - 20, 8, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Draw tower range circle (for selected towers)
 */
export function drawTowerRange(ctx, tower) {
    const { x, y, range, config } = tower;

    // Determine range color based on tower type
    let fillColor, strokeColor;
    if (config.effect === 'slow') {
        fillColor = 'rgba(56, 189, 248, 0.15)'; // Cyan for slow
        strokeColor = 'rgba(56, 189, 248, 0.6)';
    } else if (config.effect === 'fire') {
        fillColor = 'rgba(249, 115, 22, 0.15)'; // Orange for fire
        strokeColor = 'rgba(249, 115, 22, 0.6)';
    } else if (config.effect === 'poison') {
        fillColor = 'rgba(34, 197, 94, 0.15)'; // Green for poison
        strokeColor = 'rgba(34, 197, 94, 0.6)';
    } else {
        fillColor = 'rgba(255, 255, 255, 0.1)'; // White for default
        strokeColor = 'rgba(255, 255, 255, 0.5)';
    }

    // Draw filled circle
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(x, y, range, 0, Math.PI * 2);
    ctx.fill();

    // Draw stroke border
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Draw tower on canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} tower
 * @param {Object} assetLoader
 * @param {Object|null} target - The enemy this tower is targeting (for rotation)
 */
export function drawTower(ctx, tower, assetLoader = null, target = null) {
    const { x, y, config, level, isParagon, type } = tower;

    // Calculate rotation angle
    let rotation = 0;
    if (target && target.x !== undefined && target.y !== undefined) {
        // Rotate to face target
        rotation = Math.atan2(target.y - y, target.x - x) + Math.PI / 2; // +90° because sprite faces up
    } else if (!config?.isTrap && config?.effect !== 'income') {
        // Idle scanning animation when no target (slow oscillation)
        const idleTime = Date.now() / 2000; // Slow cycle
        rotation = Math.sin(idleTime + x * 0.01) * 0.4; // ±23° sweep, offset by position
    }

    // Try to load asset
    const asset = assetLoader?.getTowerAsset(type);

    // Calculate pop animation scale
    let scale = 1;
    if (tower.createdAt) {
        const age = Date.now() - tower.createdAt;
        if (age < 400) {
            const t = age / 400; // 400ms duration
            // Ease out elastic: overshoot slightly
            scale = t < 0.5 ? 2 * t * t : 1 + Math.sin((t - 0.5) * Math.PI * 2) * 0.1 * (1 - t) * 2;
            if (scale < 0) scale = 0;
        }
    }

    if (asset) {
        // Render SVG asset with rotation
        const baseSize = 60 + level * 3;
        const size = baseSize * scale;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.drawImage(asset, -size / 2, -size / 2, size, size);
        ctx.restore();

        // Paragon golden glow
        if (isParagon) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x, y, size / 2 + 6, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else {
        // Themed placeholder based on tower effect
        const size = 15 + level;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        // Different shapes for different tower types
        if (config.isTrap) {
            // Traps: Triangle
            ctx.fillStyle = config.color;
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.866, size * 0.5);
            ctx.lineTo(-size * 0.866, size * 0.5);
            ctx.closePath();
            ctx.fill();
        } else if (config.effect === 'income') {
            // Bank: Star
            drawStar(ctx, 0, 0, 5, size, size * 0.5, config.color);
        } else if (config.effect === 'barracks') {
            // Barracks: Square
            ctx.fillStyle = config.color;
            ctx.fillRect(-size, -size, size * 2, size * 2);
        } else {
            // Regular towers: Pentagon
            drawPolygon(ctx, 0, 0, size, config.color);
        }

        ctx.restore();

        // Border
        ctx.strokeStyle = isParagon ? '#fbbf24' : '#fff';
        ctx.lineWidth = isParagon ? 3 : 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();

        // Paragon glow
        if (isParagon) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(x, y, size + 4, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Level indicator (always show)
    if (level > 1) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeText(level, x, y);
        ctx.fillText(level, x, y);
    }
}

/**
 * Draw enemy on canvas
 */
export function drawEnemy(ctx, enemy, assetLoader = null) {
    const { x, y, radius, color, maxHealth, health, isStealthed, type, isBoss, isArmored } = enemy;

    // Stealth effect
    if (isStealthed) {
        ctx.globalAlpha = 0.3;
    }

    // Status Effects Visuals
    if (enemy.frozen > 0) {
        ctx.shadowColor = '#06b6d4'; // Cyan glow
        ctx.shadowBlur = 10;
        ctx.filter = 'brightness(1.2) hue-rotate(180deg)'; // Tint blue
    } else if (enemy.burning > 0) {
        ctx.shadowColor = '#f97316'; // Orange glow
        ctx.shadowBlur = 10;
        ctx.filter = 'sepia(1) saturate(5) hue-rotate(-30deg)'; // Tint orange
    } else if (enemy.poisoned > 0) {
        ctx.shadowColor = '#22c55e'; // Green glow
        ctx.shadowBlur = 10;
        ctx.filter = 'sepia(1) saturate(3) hue-rotate(80deg)'; // Tint green
    }

    // Hit flash effect (white brightness when recently hit)
    const isFlashing = enemy.hitFlash && enemy.hitFlash > 0;
    if (isFlashing) {
        ctx.save();
        ctx.filter = 'brightness(2.5) saturate(0)'; // White flash
    }

    // Try to load asset
    const asset = assetLoader?.getEnemyAsset(type);

    if (asset) {
        // Render SVG asset
        const size = radius * 3.6; // Make images more visible
        ctx.drawImage(asset, x - size / 2, y - size / 2, size, size);
    } else {
        // Themed placeholder based on enemy type
        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = color;

        if (isBoss) {
            // Bosses: Hexagon
            drawPolygon(ctx, 0, 0, radius, 6, color);
            // Boss crown
            ctx.fillStyle = '#fbbf24';
            drawStar(ctx, 0, -radius - 5, 3, 8, 4, '#fbbf24');
        } else if (isArmored) {
            // Armored: Diamond shape
            ctx.beginPath();
            ctx.moveTo(0, -radius);
            ctx.lineTo(radius, 0);
            ctx.lineTo(0, radius);
            ctx.lineTo(-radius, 0);
            ctx.closePath();
            ctx.fill();
        } else if (isStealthed) {
            // Stealth: Wavy ghost shape
            ctx.beginPath();
            ctx.arc(0, -radius / 4, radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
            // Ghost tail
            ctx.beginPath();
            ctx.moveTo(-radius, radius / 2);
            ctx.lineTo(-radius / 2, radius);
            ctx.lineTo(0, radius / 2);
            ctx.lineTo(radius / 2, radius);
            ctx.lineTo(radius, radius / 2);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();
        } else {
            // Basic enemies: Pentagon
            drawPolygon(ctx, 0, 0, radius, 5, color);
        }

        ctx.restore();

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Draw status effect icons overlay
    if (enemy.frozen > 0) {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        drawStar(ctx, x + radius, y - radius, 4, 6, 3, '#06b6d4'); // Ice crystal
        ctx.fill();
    }
    if (enemy.burning > 0) {
        ctx.font = '12px Arial';
        ctx.fillStyle = '#f97316';
        ctx.fillText('🔥', x - radius, y - radius);
    }

    // Restore flash filter before drawing health bar
    if (isFlashing) {
        ctx.restore();
    }

    // Health bar
    const barWidth = radius * 2;
    const barHeight = 4;
    const barY = y - radius - 8;

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);

    // Health
    const healthPercent = health / maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444';
    ctx.fillRect(x - barWidth / 2, barY, barWidth * healthPercent, barHeight);

    ctx.globalAlpha = 1;
}

/**
 * Draw projectile on canvas
 */
export function drawProjectile(ctx, projectile) {
    const { x, y, color, effect } = projectile;

    ctx.save();

    if (effect === 'void') {
        // Void projectile - black hole with purple aura
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#a855f7';

        const voidGrad = ctx.createRadialGradient(x, y, 0, x, y, 8);
        voidGrad.addColorStop(0, '#1f2937');
        voidGrad.addColorStop(0.6, '#6b21a8');
        voidGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = voidGrad;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing ring
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Sparkles
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Date.now() / 200;
            const sx = x + Math.cos(angle) * 7;
            const sy = y + Math.sin(angle) * 7;
            ctx.fillStyle = '#e9d5ff';
            ctx.fillRect(sx - 1, sy - 1, 2, 2);
        }

    } else if (effect === 'burn') {
        // Fire projectile - fireball with trail
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f97316';

        // Outer glow
        const fireGrad = ctx.createRadialGradient(x, y, 0, x, y, 8);
        fireGrad.addColorStop(0, '#fef3c7');
        fireGrad.addColorStop(0.4, '#fbbf24');
        fireGrad.addColorStop(0.7, '#f97316');
        fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Flame trail
        const trailGrad = ctx.createRadialGradient(x - 4, y, 0, x - 4, y, 5);
        trailGrad.addColorStop(0, 'rgba(251, 146, 60, 0.6)');
        trailGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.arc(x - 4, y, 5, 0, Math.PI * 2);
        ctx.fill();

    } else if (effect === 'freeze' || effect === 'slow') {
        // Ice shard
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#60a5fa';

        ctx.fillStyle = '#dbeafe';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x, y - 7);
        ctx.lineTo(x + 5, y);
        ctx.lineTo(x + 2, y + 2);
        ctx.lineTo(x, y + 5);
        ctx.lineTo(x - 2, y + 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ice sparkles
        ctx.fillStyle = '#fff';
        ctx.fillRect(x - 2, y - 2, 1, 1);
        ctx.fillRect(x + 1, y + 1, 1, 1);

    } else if (effect === 'poison') {
        // Poison cloud/blob
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#84cc16';

        const poisonGrad = ctx.createRadialGradient(x, y, 0, x, y, 6);
        poisonGrad.addColorStop(0, '#bef264');
        poisonGrad.addColorStop(0.6, '#84cc16');
        poisonGrad.addColorStop(1, 'rgba(132, 204, 22, 0)');
        ctx.fillStyle = poisonGrad;

        // Irregular blob
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.arc(x - 3, y + 2, 2, 0, Math.PI * 2);
        ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
        ctx.fill();

    } else {
        // Standard projectile - arrow
        ctx.shadowBlur = 6;
        ctx.shadowColor = color;

        // Arrow shaft
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x + 5, y);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = color || '#6b7280';
        ctx.beginPath();
        ctx.moveTo(x + 5, y);
        ctx.lineTo(x + 9, y - 3);
        ctx.lineTo(x + 9, y + 3);
        ctx.closePath();
        ctx.fill();

        // Feathers
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(x - 6, y - 2);
        ctx.lineTo(x - 8, y - 3);
        ctx.lineTo(x - 6, y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(x - 6, y + 2);
        ctx.lineTo(x - 8, y + 3);
        ctx.lineTo(x - 6, y);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

/**
 * Draw scenery decoration
 */
export function drawScenery(ctx, x, y, type) {
    switch (type) {
        case 'forest':
            // Simple tree
            ctx.fillStyle = '#365314';
            ctx.fillRect(x - 3, y - 8, 6, 8);
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'rock':
            // Rock
            ctx.fillStyle = '#78716c';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'flower':
            // Flower
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            break;
    }
}

/**
 * Draw water zone
 */
export function drawWaterZone(ctx, zone, canvasWidth, canvasHeight) {
    ctx.fillStyle = 'rgba(14, 116, 144, 0.3)';
    ctx.beginPath();

    const points = zone.map(p => ({
        x: p.x * canvasWidth,
        y: p.y * canvasHeight
    }));

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
}

/**
 * Draw background with map color
 */
export function drawBackground(ctx, canvasWidth, canvasHeight, bgColor, sceneryType = 'default') {
    // Base fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Add themed gradients and textures
    switch (sceneryType) {
        case 'forest':
        case 'dense_forest':
        case 'jungle':
            // Green gradient
            const forestGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
            forestGrad.addColorStop(0, 'rgba(134, 239, 172, 0.2)');
            forestGrad.addColorStop(1, 'rgba(21, 128, 61, 0.3)');
            ctx.fillStyle = forestGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Grass texture dots  
            ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * canvasWidth;
                const y = Math.random() * canvasHeight;
                ctx.fillRect(x, y, 3, 3);
            }
            break;

        case 'ocean':
            // Blue wave gradient
            const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            oceanGrad.addColorStop(0, 'rgba(14, 116, 144, 0.3)');
            oceanGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
            oceanGrad.addColorStop(1, 'rgba(8, 145, 178, 0.4)');
            ctx.fillStyle = oceanGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Wave patterns
            ctx.strokeStyle = 'rgba(165, 243, 252, 0.3)';
            ctx.lineWidth = 2;
            for (let y = 50; y < canvasHeight; y += 60) {
                ctx.beginPath();
                for (let x = 0; x < canvasWidth; x += 20) {
                    const wave = Math.sin((x + y) * 0.05) * 10;
                    if (x === 0) ctx.moveTo(x, y + wave);
                    else ctx.lineTo(x, y + wave);
                }
                ctx.stroke();
            }
            break;

        case 'desert':
            // Sandy gradient
            const desertGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
            desertGrad.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
            desertGrad.addColorStop(1, 'rgba(202, 138, 4, 0.2)');
            ctx.fillStyle = desertGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Sand texture
            ctx.fillStyle = 'rgba(217, 119, 6, 0.1)';
            for (let i = 0; i < 150; i++) {
                const x = Math.random() * canvasWidth;
                const y = Math.random() * canvasHeight;
                ctx.fillRect(x, y, 2, 2);
            }
            break;

        case 'volcano':
            // Lava gradient
            const volcanoGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
            volcanoGrad.addColorStop(0, 'rgba(220, 38, 38, 0.4)');
            volcanoGrad.addColorStop(0.7, 'rgba(127, 29, 29, 0.3)');
            volcanoGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
            ctx.fillStyle = volcanoGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Ember particles
            ctx.fillStyle = 'rgba(251, 146, 60, 0.6)';
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * canvasWidth;
                const y = Math.random() * canvasHeight;
                const size = Math.random() * 3 + 1;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'magic':
            // Purple magical gradient
            const magicGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
            magicGrad.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
            magicGrad.addColorStop(1, 'rgba(88, 28, 135, 0.4)');
            ctx.fillStyle = magicGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Sparkles
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            for (let i = 0; i < 40; i++) {
                const x = Math.random() * canvasWidth;
                const y = Math.random() * canvasHeight;
                drawStar(ctx, x, y, 4, 4, 2, 'rgba(255, 255, 255, 0.5)');
            }
            break;

        case 'city':
            // Urban gradient
            const cityGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            cityGrad.addColorStop(0, 'rgba(71, 85, 105, 0.2)');
            cityGrad.addColorStop(1, 'rgba(30, 41, 59, 0.3)');
            ctx.fillStyle = cityGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Grid pattern
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvasWidth; x += 50) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvasHeight);
                ctx.stroke();
            }
            for (let y = 0; y < canvasHeight; y += 50) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvasWidth, y);
                ctx.stroke();
            }
            break;

        case 'castle':
            // Stone gradient
            const castleGrad = ctx.createLinearGradient(0, 0, canvasWidth, 0);
            castleGrad.addColorStop(0, 'rgba(68, 64, 60, 0.2)');
            castleGrad.addColorStop(1, 'rgba(28, 25, 23, 0.3)');
            ctx.fillStyle = castleGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Stone blocks
            ctx.strokeStyle = 'rgba(120, 113, 108, 0.3)';
            ctx.lineWidth = 2;
            for (let y = 0; y < canvasHeight; y += 40) {
                for (let x = (y % 80) ? 0 : -40; x < canvasWidth; x += 80) {
                    ctx.strokeRect(x, y, 80, 40);
                }
            }
            break;

        case 'rocky':
            // Rocky gray gradient
            const rockyGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
            rockyGrad.addColorStop(0, 'rgba(161, 161, 170, 0.2)');
            rockyGrad.addColorStop(1, 'rgba(63, 63, 70, 0.3)');
            ctx.fillStyle = rockyGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Rock texture
            ctx.fillStyle = 'rgba(113, 113, 122, 0.2)';
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * canvasWidth;
                const y = Math.random() * canvasHeight;
                const size = Math.random() * 15 + 5;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'rainbow':
        case 'cloud':
            // Sky gradient with clouds
            const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            skyGrad.addColorStop(0, 'rgba(186, 230, 253, 0.4)');
            skyGrad.addColorStop(1, 'rgba(224, 242, 254, 0.3)');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Fluffy clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            for (let i = 0; i < 8; i++) {
                const x = (i * canvasWidth / 8) + Math.random() * 50;
                const y = Math.random() * canvasHeight * 0.4;
                ctx.beginPath();
                ctx.arc(x, y, 30, 0, Math.PI * 2);
                ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
                ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        default:
            // Simple gradient for other types
            const defaultGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
            const lighterBg = adjustColor(bgColor, 20);
            const darkerBg = adjustColor(bgColor, -20);
            defaultGrad.addColorStop(0, lighterBg);
            defaultGrad.addColorStop(1, darkerBg);
            ctx.fillStyle = defaultGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            break;
    }
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
    // Simple brightness adjustment for hex colors
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Draw range indicator for tower placement
 */
export function drawRangeIndicator(ctx, x, y, range, isValid) {
    // Subtle pulsing effect for attention
    const pulse = Math.sin(Date.now() / 300) * 0.05 + 1;
    const displayRange = range * pulse;

    const validColor = isValid ? '34, 197, 94' : '239, 68, 68'; // RGB values

    // Layer 1: Outer white glow for contrast on dark backgrounds
    ctx.strokeStyle = `rgba(255, 255, 255, 0.7)`;
    ctx.lineWidth = 5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x, y, displayRange, 0, Math.PI * 2);
    ctx.stroke();

    // Layer 2: Black outline for contrast on light backgrounds  
    ctx.strokeStyle = `rgba(0, 0, 0, 0.6)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, displayRange, 0, Math.PI * 2);
    ctx.stroke();

    // Layer 3: Colored inner line (green/red)
    ctx.strokeStyle = `rgba(${validColor}, 0.9)`;
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.arc(x, y, displayRange, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Layer 4: Filled semi-transparent area
    ctx.fillStyle = `rgba(${validColor}, 0.15)`;
    ctx.beginPath();
    ctx.arc(x, y, displayRange, 0, Math.PI * 2);
    ctx.fill();

    // Draw tower preview at center
    ctx.fillStyle = `rgba(${validColor}, 0.6)`;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isValid ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 3;
    ctx.stroke();
}

/**
 * Draw floating text (damage numbers, coin amounts)
 */
export function drawFloatingText(ctx, text, x, y, alpha, color = '#fff') {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;
}

export function drawScar(ctx, scar) {
    ctx.save();
    const ageFactor = scar.life / 600; // 0 to 1
    ctx.globalAlpha = Math.min(scar.opacity, ageFactor);
    ctx.translate(scar.x, scar.y);
    ctx.rotate(scar.rotation || 0);

    // Scale down as it fades slightly
    const scale = 0.5 + 0.5 * ageFactor;
    ctx.scale(scale, scale);

    if (scar.type === 'scorch') {
        // Scorch Mark (Explosions/Fire)
        ctx.fillStyle = "#1c1917"; // Stone-900
        ctx.beginPath();
        ctx.ellipse(0, 0, scar.size, scar.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner Char
        ctx.fillStyle = "#000";
        ctx.globalAlpha = 0.3 * ageFactor;
        ctx.beginPath();
        ctx.ellipse(0, 0, scar.size * 0.6, scar.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

    } else if (scar.type === 'blood') {
        // Blood Splat (Biological)
        ctx.fillStyle = "#7f1d1d"; // Red-900
        ctx.beginPath();
        // Main pool
        ctx.arc(0, 0, scar.size * 0.6, 0, Math.PI * 2);
        // Random blobs
        for (let i = 0; i < 4; i++) {
            const ang = (i / 4) * Math.PI * 2;
            const dist = scar.size * 0.5;
            ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, scar.size * 0.3, 0, Math.PI * 2);
        }
        ctx.fill();

    } else if (scar.type === 'slime') {
        // Slime Splat (Poison/Nature)
        ctx.fillStyle = "#4d7c0f"; // Lime-700
        ctx.beginPath();
        ctx.arc(0, 0, scar.size * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#84cc16"; // Lime-500
        ctx.beginPath();
        ctx.arc(4, -4, scar.size * 0.2, 0, Math.PI * 2); // highlight
        ctx.fill();
    }

    ctx.restore();
}

export function drawSynergyLink(ctx, x1, y1, x2, y2, color = 'rgba(255,255,255,0.15)') {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw "knots"
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x1, y1, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x2, y2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

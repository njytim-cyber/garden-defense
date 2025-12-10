/**
 * Canvas Rendering Utilities
 * Extracted from monolith (lines 1661-2260)
 * Pure drawing functions - no React dependencies
 */

/**
 * Draw path on canvas
 */
export function drawPath(ctx, path, canvasWidth, canvasHeight, sceneryType) {
    const { PATH_WIDTH, START_POINT_RADIUS, END_POINT_RADIUS } = require('../constants/GameConstants');

    if (path.length === 0) return;

    // Convert waypoints to canvas coordinates
    const points = path.map(p => ({
        x: p.x * canvasWidth,
        y: p.y * canvasHeight
    }));

    // Outer path (darker)
    ctx.strokeStyle = sceneryType === 'ocean' ? '#1e40af' : '#78350f';
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
    ctx.strokeStyle = sceneryType === 'ocean' ? '#3b82f6' : '#a16207';
    ctx.lineWidth = PATH_WIDTH.inner;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Start point
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, START_POINT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // End point
    const endPoint = points[points.length - 1];
    ctx.fillStyle = sceneryType === 'ocean' ? '#dc2626' : sceneryType === 'magic' ? '#a855f7' : '#dc2626';
    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, END_POINT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Draw tower on canvas
 */
export function drawTower(ctx, tower) {
    const { x, y, config, level, isParagon } = tower;

    // Tower body
    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.arc(x, y, 15 + level, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = isParagon ? '#fbbf24' : '#fff';
    ctx.lineWidth = isParagon ? 3 : 2;
    ctx.stroke();

    // Level indicator
    if (level > 1) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(level, x, y);
    }

    // Paragon glow
    if (isParagon) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x, y, 15 + level + 4, 0, Math.PI * 2);
        ctx.stroke();
    }
}

/**
 * Draw enemy on canvas
 */
export function drawEnemy(ctx, enemy) {
    const { x, y, radius, color, maxHealth, health, isStealthed } = enemy;

    // Stealth effect
    if (isStealthed) {
        ctx.globalAlpha = 0.3;
    }

    // Enemy body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

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

    if (effect === 'void') {
        // Void projectile (black hole)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    } else if (effect === 'burn') {
        // Fire projectile
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Flame trail
        ctx.fillStyle = 'rgba(251, 146, 60, 0.5)';
        ctx.beginPath();
        ctx.arc(x - 3, y, 3, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Standard projectile
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
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
export function drawBackground(ctx, canvasWidth, canvasHeight, bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * Draw range indicator for tower placement
 */
export function drawRangeIndicator(ctx, x, y, range, isValid) {
    ctx.strokeStyle = isValid ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.fillStyle = isValid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(x, y, range, 0, Math.PI * 2);
    ctx.fill();
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

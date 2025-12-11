/**
 * Canvas Rendering Utilities - OPTIMIZED
 * Performance improvements:
 * - Eliminated Date.now() calls (pass gameTime from loop)
 * - Extracted color palettes into constants
 * - Added a11y context helpers
 */

import { PATH_WIDTH, START_POINT_RADIUS, END_POINT_RADIUS } from '../constants/GameConstants';
import { drawPolygon, drawStar } from './shapeHelpers';

// ============================================================================
// COLOR PALETTE - Semantic naming for maintainability
// ============================================================================
export const COLOR_PALETTE = {
    // Path colors by theme
    paths: {
        ocean: { outer: '#1e40af', inner: '#3b82f6' },
        volcano: { outer: '#7f1d1d', inner: '#f97316' },
        magic: { outer: '#581c87', inner: '#a855f7' },
        desert: { outer: '#92400e', inner: '#eab308' },
        forest: { outer: '#654321', inner: '#8B7355' },
        rocky: { outer: '#3f3f46', inner: '#a1a1aa' },
        castle: { outer: '#292524', inner: '#78716c' },
        default: { outer: '#78350f', inner: '#a16207' }
    },

    // Waypoint structures
    waypoints: {
        castle: {
            walls: '#16a34a',
            towers: '#15803d',
            door: '#78350f',
            flag: { pole: '#fbbf24', banner: '#22c55e' }
        },
        shrine: {
            base: '#78716c',
            structure: '#dc2626',
            magicAlt: '#a855f7',
            pillars: '#f5f5f4',
            glow: 'rgba(220, 38, 38, 0.6)',
            glowMagic: 'rgba(168, 85, 247, 0.6)',
            light: '#fecaca',
            lightMagic: '#e9d5ff'
        }
    },

    // Tower ranges by effect
    towerRanges: {
        slow: { fill: 'rgba(56, 189, 248, 0.15)', stroke: 'rgba(56, 189, 248, 0.6)' },
        fire: { fill: 'rgba(249, 115, 22, 0.15)', stroke: 'rgba(249, 115, 22, 0.6)' },
        poison: { fill: 'rgba(34, 197, 94, 0.15)', stroke: 'rgba(34, 197, 94, 0.6)' },
        default: { fill: 'rgba(255, 255, 255, 0.1)', stroke: 'rgba(255, 255, 255, 0.5)' }
    },

    // Status effects
    statusEffects: {
        frozen: { glow: '#06b6d4', icon: '#06b6d4' },
        burning: { glow: '#f97316', icon: '#f97316' },
        poisoned: { glow: '#22c55e', icon: '#22c55e' }
    },

    // UI feedback
    placement: {
        valid: '34, 197, 94',   // RGB values for rgba()
        invalid: '239, 68, 68'
    },

    // Health bars
    health: {
        high: '#22c55e',
        medium: '#eab308',
        low: '#ef4444',
        background: '#000'
    }
};

// ============================================================================
// A11Y HELPERS - Announce important events to screen readers
// ============================================================================
let ariaLiveRegion = null;

export function initA11yAnnouncer() {
    if (typeof document === 'undefined') return; // SSR safety

    ariaLiveRegion = document.createElement('div');
    ariaLiveRegion.setAttribute('aria-live', 'polite');
    ariaLiveRegion.setAttribute('aria-atomic', 'true');
    ariaLiveRegion.className = 'sr-only'; // Screen reader only
    ariaLiveRegion.style.position = 'absolute';
    ariaLiveRegion.style.left = '-9999px';
    document.body.appendChild(ariaLiveRegion);
}

export function announceToScreenReader(message) {
    if (!ariaLiveRegion) return;
    ariaLiveRegion.textContent = message;
}

// ============================================================================
// RENDERING FUNCTIONS (Optimized)
// ============================================================================

/**
 * Draw path on canvas
 * @param {number} gameTime - Pass from game loop instead of Date.now()
 */
export function drawPath(ctx, path, canvasWidth, canvasHeight, sceneryType, assetLoader = null, gameTime = 0) {
    if (path.length === 0) return;

    // Convert waypoints to canvas coordinates
    const points = path.map(p => ({
        x: p.x * canvasWidth,
        y: p.y * canvasHeight
    }));

    // Get theme colors
    const theme = COLOR_PALETTE.paths[sceneryType] || COLOR_PALETTE.paths.default;

    // Draw path layers (extracted to reduce duplication)
    drawPathLayer(ctx, points, theme.outer, PATH_WIDTH.outer);
    drawPathLayer(ctx, points, theme.inner, PATH_WIDTH.inner);

    // Inner shadow for depth
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = PATH_WIDTH.inner - 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    drawPathLayer(ctx, points, null, null);
    ctx.restore();

    // Theme-specific decorations
    if (sceneryType === 'forest' || sceneryType === 'dense_forest') {
        drawSteppingStones(ctx, points);
    }

    if (sceneryType === 'magic') {
        drawMagicGlow(ctx, points);
    }

    // Animated dashed border (using gameTime instead of Date.now())
    const dashOffset = (gameTime / 50) % 20;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = -dashOffset;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    drawPathLayer(ctx, points, null, null);
    ctx.setLineDash([]);

    // Waypoints
    drawCastle(ctx, points[0].x, points[0].y, assetLoader);
    drawShrine(ctx, points[points.length - 1].x, points[points.length - 1].y, sceneryType, assetLoader);
}

// Helper: Draw a path layer (DRY)
function drawPathLayer(ctx, points, strokeStyle, lineWidth) {
    if (strokeStyle) ctx.strokeStyle = strokeStyle;
    if (lineWidth) ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

// Helper: Stepping stones
function drawSteppingStones(ctx, points) {
    ctx.fillStyle = '#9CA3AF';
    const stoneSpacing = 30;
    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(dist / stoneSpacing);
        for (let j = 0; j < steps; j++) {
            const t = j / steps;
            ctx.beginPath();
            ctx.arc(points[i].x + dx * t, points[i].y + dy * t, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Helper: Magic glow
function drawMagicGlow(ctx, points) {
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = PATH_WIDTH.outer + 6;
    drawPathLayer(ctx, points, null, null);
}

// Helper: Castle waypoint
function drawCastle(ctx, x, y, assetLoader) {
    const img = assetLoader?.getWaypointAsset('castle');
    if (img) {
        const size = 96;
        ctx.drawImage(img, x - size / 2, y - size / 2 - 10, size, size);
        return;
    }

    // Fallback: procedural castle
    const c = COLOR_PALETTE.waypoints.castle;
    ctx.fillStyle = c.walls;
    ctx.fillRect(x - 24, y - 16, 48, 32);
    ctx.fillRect(x - 28, y - 32, 16, 24);
    ctx.fillRect(x + 12, y - 32, 16, 24);

    ctx.fillStyle = c.towers;
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - 28 + i * 8, y - 36, 6, 4);
        ctx.fillRect(x + 12 + i * 8, y - 36, 6, 4);
    }

    ctx.fillStyle = c.door;
    ctx.fillRect(x - 8, y - 8, 16, 24);

    ctx.strokeStyle = c.flag.pole;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y - 32);
    ctx.lineTo(x, y - 52);
    ctx.stroke();

    ctx.fillStyle = c.flag.banner;
    ctx.beginPath();
    ctx.moveTo(x, y - 52);
    ctx.lineTo(x + 16, y - 44);
    ctx.lineTo(x, y - 36);
    ctx.fill();
}

// Helper: Shrine waypoint
function drawShrine(ctx, x, y, sceneryType, assetLoader) {
    const img = assetLoader?.getWaypointAsset('shrine');
    if (img) {
        const size = 96;
        ctx.drawImage(img, x - size / 2, y - size / 2 - 10, size, size);
        return;
    }

    // Fallback: procedural shrine
    const s = COLOR_PALETTE.waypoints.shrine;
    const isMagic = sceneryType === 'magic';

    ctx.fillStyle = s.base;
    ctx.fillRect(x - 32, y + 12, 64, 8);
    ctx.fillRect(x - 28, y + 4, 56, 8);

    ctx.fillStyle = isMagic ? s.magicAlt : s.structure;
    ctx.beginPath();
    ctx.moveTo(x - 24, y + 4);
    ctx.lineTo(x - 24, y - 16);
    ctx.lineTo(x - 16, y - 24);
    ctx.lineTo(x, y - 32);
    ctx.lineTo(x + 16, y - 24);
    ctx.lineTo(x + 24, y - 16);
    ctx.lineTo(x + 24, y + 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = s.pillars;
    ctx.fillRect(x - 20, y - 12, 6, 16);
    ctx.fillRect(x + 14, y - 12, 6, 16);

    ctx.strokeStyle = isMagic ? s.glowMagic : s.glow;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x, y - 12, 36, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isMagic ? s.lightMagic : s.light;
    ctx.beginPath();
    ctx.arc(x, y - 20, 8, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Draw tower range circle (for selected towers)
 */
export function drawTowerRange(ctx, tower) {
    const { x, y, range, config } = tower;
    const theme = COLOR_PALETTE.towerRanges[config.effect] || COLOR_PALETTE.towerRanges.default;

    ctx.fillStyle = theme.fill;
    ctx.beginPath();
    ctx.arc(x, y, range, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = theme.stroke;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Draw tower on canvas
 * @param {number} gameTime - Pass from game loop
 */
export function drawTower(ctx, tower, assetLoader = null, target = null, gameTime = 0) {
    const { x, y, config, level, isParagon, type } = tower;

    // Calculate rotation
    let rotation = 0;
    if (target?.x !== undefined && target?.y !== undefined) {
        rotation = Math.atan2(target.y - y, target.x - x) + Math.PI / 2;
    } else if (!config?.isTrap && config?.effect !== 'income') {
        // Idle scan (using gameTime)
        rotation = Math.sin(gameTime / 2000 + x * 0.01) * 0.4;
    }

    // Pop animation
    let scale = 1;
    if (tower.createdAt) {
        const age = gameTime - tower.createdAt;
        if (age < 400) {
            const t = age / 400;
            scale = t < 0.5 ? 2 * t * t : 1 + Math.sin((t - 0.5) * Math.PI * 2) * 0.1 * (1 - t) * 2;
            if (scale < 0) scale = 0;
        }
    }

    const asset = assetLoader?.getTowerAsset(type);

    if (asset) {
        const baseSize = 60 + level * 3;
        const size = baseSize * scale;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.drawImage(asset, -size / 2, -size / 2, size, size);
        ctx.restore();

        if (isParagon) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x, y, size / 2 + 6, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else {
        // Placeholder shapes
        const size = 15 + level;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        if (config.isTrap) {
            ctx.fillStyle = config.color;
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.866, size * 0.5);
            ctx.lineTo(-size * 0.866, size * 0.5);
            ctx.closePath();
            ctx.fill();
        } else if (config.effect === 'income') {
            drawStar(ctx, 0, 0, 5, size, size * 0.5, config.color);
        } else if (config.effect === 'barracks') {
            ctx.fillStyle = config.color;
            ctx.fillRect(-size, -size, size * 2, size * 2);
        } else {
            drawPolygon(ctx, 0, 0, size, config.color);
        }

        ctx.restore();

        ctx.strokeStyle = isParagon ? '#fbbf24' : '#fff';
        ctx.lineWidth = isParagon ? 3 : 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();

        if (isParagon) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(x, y, size + 4, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Level indicator
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

    if (isStealthed) {
        ctx.globalAlpha = 0.3;
    }

    // Status effects
    if (enemy.frozen > 0) {
        ctx.shadowColor = COLOR_PALETTE.statusEffects.frozen.glow;
        ctx.shadowBlur = 10;
        ctx.filter = 'brightness(1.2) hue-rotate(180deg)';
    } else if (enemy.burning > 0) {
        ctx.shadowColor = COLOR_PALETTE.statusEffects.burning.glow;
        ctx.shadowBlur = 10;
        ctx.filter = 'sepia(1) saturate(5) hue-rotate(-30deg)';
    } else if (enemy.poisoned > 0) {
        ctx.shadowColor = COLOR_PALETTE.statusEffects.poisoned.glow;
        ctx.shadowBlur = 10;
        ctx.filter = 'sepia(1) saturate(3) hue-rotate(80deg)';
    }

    // Hit flash
    const isFlashing = enemy.hitFlash && enemy.hitFlash > 0;
    if (isFlashing) {
        ctx.save();
        ctx.filter = 'brightness(2.5) saturate(0)';
    }

    const asset = assetLoader?.getEnemyAsset(type);

    if (asset) {
        const size = radius * 3.6;
        ctx.drawImage(asset, x - size / 2, y - size / 2, size, size);
    } else {
        // Placeholder shapes
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = color;

        if (isBoss) {
            drawPolygon(ctx, 0, 0, radius, 6, color);
            ctx.fillStyle = '#fbbf24';
            drawStar(ctx, 0, -radius - 5, 3, 8, 4, '#fbbf24');
        } else if (isArmored) {
            ctx.beginPath();
            ctx.moveTo(0, -radius);
            ctx.lineTo(radius, 0);
            ctx.lineTo(0, radius);
            ctx.lineTo(-radius, 0);
            ctx.closePath();
            ctx.fill();
        } else if (isStealthed) {
            ctx.beginPath();
            ctx.arc(0, -radius / 4, radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
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
            drawPolygon(ctx, 0, 0, radius, 5, color);
        }

        ctx.restore();

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Status icons
    if (enemy.frozen > 0) {
        drawStar(ctx, x + radius, y - radius, 4, 6, 3, COLOR_PALETTE.statusEffects.frozen.icon);
    }
    if (enemy.burning > 0) {
        ctx.font = '12px Arial';
        ctx.fillStyle = COLOR_PALETTE.statusEffects.burning.icon;
        ctx.fillText('🔥', x - radius, y - radius);
    }

    if (isFlashing) {
        ctx.restore();
    }

    // Health bar
    const barWidth = radius * 2;
    const barHeight = 4;
    const barY = y - radius - 8;
    const healthPercent = health / maxHealth;

    ctx.fillStyle = COLOR_PALETTE.health.background;
    ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);

    ctx.fillStyle = healthPercent > 0.5 ? COLOR_PALETTE.health.high :
        healthPercent > 0.25 ? COLOR_PALETTE.health.medium :
            COLOR_PALETTE.health.low;
    ctx.fillRect(x - barWidth / 2, barY, barWidth * healthPercent, barHeight);

    ctx.globalAlpha = 1;
}

/**
 * Draw projectile on canvas
 */
export function drawProjectile(ctx, projectile, gameTime = 0) {
    const { x, y, color, effect } = projectile;

    ctx.save();

    if (effect === 'void') {
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

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Sparkles (using gameTime)
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + gameTime / 200;
            const sx = x + Math.cos(angle) * 7;
            const sy = y + Math.sin(angle) * 7;
            ctx.fillStyle = '#e9d5ff';
            ctx.fillRect(sx - 1, sy - 1, 2, 2);
        }

    } else if (effect === 'burn') {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f97316';

        const fireGrad = ctx.createRadialGradient(x, y, 0, x, y, 8);
        fireGrad.addColorStop(0, '#fef3c7');
        fireGrad.addColorStop(0.4, '#fbbf24');
        fireGrad.addColorStop(0.7, '#f97316');
        fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        const trailGrad = ctx.createRadialGradient(x - 4, y, 0, x - 4, y, 5);
        trailGrad.addColorStop(0, 'rgba(251, 146, 60, 0.6)');
        trailGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.arc(x - 4, y, 5, 0, Math.PI * 2);
        ctx.fill();

    } else if (effect === 'freeze' || effect === 'slow') {
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

        ctx.fillStyle = '#fff';
        ctx.fillRect(x - 2, y - 2, 1, 1);
        ctx.fillRect(x + 1, y + 1, 1, 1);

    } else if (effect === 'poison') {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#84cc16';

        const poisonGrad = ctx.createRadialGradient(x, y, 0, x, y, 6);
        poisonGrad.addColorStop(0, '#bef264');
        poisonGrad.addColorStop(0.6, '#84cc16');
        poisonGrad.addColorStop(1, 'rgba(132, 204, 22, 0)');
        ctx.fillStyle = poisonGrad;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.arc(x - 3, y + 2, 2, 0, Math.PI * 2);
        ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
        ctx.fill();

    } else {
        // Standard arrow
        ctx.shadowBlur = 6;
        ctx.shadowColor = color;

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x + 5, y);
        ctx.stroke();

        ctx.fillStyle = color || '#6b7280';
        ctx.beginPath();
        ctx.moveTo(x + 5, y);
        ctx.lineTo(x + 9, y - 3);
        ctx.lineTo(x + 9, y + 3);
        ctx.closePath();
        ctx.fill();

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
            ctx.fillStyle = '#365314';
            ctx.fillRect(x - 3, y - 8, 6, 8);
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'rock':
            ctx.fillStyle = '#78716c';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'flower':
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
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    switch (sceneryType) {
        case 'forest':
        case 'dense_forest':
        case 'jungle':
            const forestGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
            forestGrad.addColorStop(0, 'rgba(134, 239, 172, 0.2)');
            forestGrad.addColorStop(1, 'rgba(21, 128, 61, 0.3)');
            ctx.fillStyle = forestGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
            for (let i = 0; i < 100; i++) {
                ctx.fillRect(Math.random() * canvasWidth, Math.random() * canvasHeight, 3, 3);
            }
            break;

        case 'ocean':
            const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            oceanGrad.addColorStop(0, 'rgba(14, 116, 144, 0.3)');
            oceanGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
            oceanGrad.addColorStop(1, 'rgba(8, 145, 178, 0.4)');
            ctx.fillStyle = oceanGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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
            const desertGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
            desertGrad.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
            desertGrad.addColorStop(1, 'rgba(202, 138, 4, 0.2)');
            ctx.fillStyle = desertGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.fillStyle = 'rgba(217, 119, 6, 0.1)';
            for (let i = 0; i < 150; i++) {
                ctx.fillRect(Math.random() * canvasWidth, Math.random() * canvasHeight, 2, 2);
            }
            break;

        case 'volcano':
            const volcanoGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
            volcanoGrad.addColorStop(0, 'rgba(220, 38, 38, 0.4)');
            volcanoGrad.addColorStop(0.7, 'rgba(127, 29, 29, 0.3)');
            volcanoGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
            ctx.fillStyle = volcanoGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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
            const magicGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
            magicGrad.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
            magicGrad.addColorStop(1, 'rgba(88, 28, 135, 0.4)');
            ctx.fillStyle = magicGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            for (let i = 0; i < 40; i++) {
                const x = Math.random() * canvasWidth;
                const y = Math.random() * canvasHeight;
                drawStar(ctx, x, y, 4, 4, 2, 'rgba(255, 255, 255, 0.5)');
            }
            break;

        case 'city':
            const cityGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            cityGrad.addColorStop(0, 'rgba(71, 85, 105, 0.2)');
            cityGrad.addColorStop(1, 'rgba(30, 41, 59, 0.3)');
            ctx.fillStyle = cityGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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
            const castleGrad = ctx.createLinearGradient(0, 0, canvasWidth, 0);
            castleGrad.addColorStop(0, 'rgba(68, 64, 60, 0.2)');
            castleGrad.addColorStop(1, 'rgba(28, 25, 23, 0.3)');
            ctx.fillStyle = castleGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.strokeStyle = 'rgba(120, 113, 108, 0.3)';
            ctx.lineWidth = 2;
            for (let y = 0; y < canvasHeight; y += 40) {
                for (let x = (y % 80) ? 0 : -40; x < canvasWidth; x += 80) {
                    ctx.strokeRect(x, y, 80, 40);
                }
            }
            break;

        case 'rocky':
            const rockyGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
            rockyGrad.addColorStop(0, 'rgba(161, 161, 170, 0.2)');
            rockyGrad.addColorStop(1, 'rgba(63, 63, 70, 0.3)');
            ctx.fillStyle = rockyGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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
            const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            skyGrad.addColorStop(0, 'rgba(186, 230, 253, 0.4)');
            skyGrad.addColorStop(1, 'rgba(224, 242, 254, 0.3)');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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

function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Draw range indicator for tower placement
 * @param {number} gameTime - Pass from game loop
 */
export function drawRangeIndicator(ctx, x, y, range, isValid, gameTime = 0) {
    const pulse = Math.sin(gameTime / 300) * 0.05 + 1;
    const displayRange = range * pulse;
    const validColor = isValid ? COLOR_PALETTE.placement.valid : COLOR_PALETTE.placement.invalid;

    ctx.strokeStyle = `rgba(255, 255, 255, 0.7)`;
    ctx.lineWidth = 5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x, y, displayRange, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(0, 0, 0, 0.6)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, displayRange, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(${validColor}, 0.9)`;
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.arc(x, y, displayRange, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = `rgba(${validColor}, 0.15)`;
    ctx.beginPath();
    ctx.arc(x, y, displayRange, 0, Math.PI * 2);
    ctx.fill();

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
    const ageFactor = scar.life / 600;
    ctx.globalAlpha = Math.min(scar.opacity, ageFactor);
    ctx.translate(scar.x, scar.y);
    ctx.rotate(scar.rotation || 0);

    const scale = 0.5 + 0.5 * ageFactor;
    ctx.scale(scale, scale);

    if (scar.type === 'scorch') {
        ctx.fillStyle = "#1c1917";
        ctx.beginPath();
        ctx.ellipse(0, 0, scar.size, scar.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.globalAlpha = 0.3 * ageFactor;
        ctx.beginPath();
        ctx.ellipse(0, 0, scar.size * 0.6, scar.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

    } else if (scar.type === 'blood') {
        ctx.fillStyle = "#7f1d1d";
        ctx.beginPath();
        ctx.arc(0, 0, scar.size * 0.6, 0, Math.PI * 2);
        for (let i = 0; i < 4; i++) {
            const ang = (i / 4) * Math.PI * 2;
            const dist = scar.size * 0.5;
            ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, scar.size * 0.3, 0, Math.PI * 2);
        }
        ctx.fill();

    } else if (scar.type === 'slime') {
        ctx.fillStyle = "#4d7c0f";
        ctx.beginPath();
        ctx.arc(0, 0, scar.size * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#84cc16";
        ctx.beginPath();
        ctx.arc(4, -4, scar.size * 0.2, 0, Math.PI * 2);
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

    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x1, y1, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x2, y2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

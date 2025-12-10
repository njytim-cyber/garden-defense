/**
 * Pure Game Logic Utilities
 * Extracted from monolith - no React dependencies, fully testable
 */

/**
 * Calculate distance from point to line segment
 * Used for: path proximity checks, scenery placement, tower placement validation
 */
export function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const l2 = (x1 - x2) ** 2 + (y1 - y2) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);

    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));

    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

/**
 * Check if point is inside water zone (polygon)
 * Uses ray-casting algorithm
 */
export function isPointInWater(x, y, canvasWidth, canvasHeight, waterZones, isGlassFloor) {
    const nx = x / canvasWidth;
    const ny = y / canvasHeight;

    if (isGlassFloor) return true;

    for (let zone of waterZones) {
        let inside = false;
        for (let i = 0, j = zone.length - 1; i < zone.length; j = i++) {
            const xi = zone[i].x, yi = zone[i].y;
            const xj = zone[j].x, yj = zone[j].y;
            const intersect = ((yi > ny) != (yj > ny)) && (nx < (xj - xi) * (ny - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        if (inside) return true;
    }
    return false;
}

/**
 * Check if tower is under glass (Covered Garden map mechanic)
 */
export function isUnderGlass(x, y, canvasWidth, canvasHeight, coveredGardenQuadrant) {
    const isLeft = x < canvasWidth * 0.5;
    const isTop = y < canvasHeight * 0.5;

    let quadrant = -1;
    if (isLeft && !isTop) quadrant = 0; // BL
    else if (isLeft && isTop) quadrant = 1; // TL
    else if (!isLeft && isTop) quadrant = 2; // TR
    else if (!isLeft && !isTop) quadrant = 3; // BR

    return quadrant !== coveredGardenQuadrant;
}

/**
 * Validate tower placement
 * Returns: { valid: boolean, reason?: string }
 */
export function isValidPlacement(
    x, y,
    towerConfig,
    towers,
    pathWaypoints,
    mapData,
    canvasWidth,
    canvasHeight,
    coveredGardenQuadrant,
    existingHeroes
) {
    const { PLACEMENT_MARGINS, TOWER_COLLISION_RADIUS, TRAP_COLLISION_RADIUS, TOWER_PATH_MIN_DISTANCE, TRAP_PATH_MAX_DISTANCE } = require('../constants/GameConstants');

    // Edge margins
    if (x < PLACEMENT_MARGINS.x ||
        x > canvasWidth - PLACEMENT_MARGINS.x ||
        y < PLACEMENT_MARGINS.top ||
        y > canvasHeight - PLACEMENT_MARGINS.bottom) {
        return { valid: false, reason: "Too close to edge" };
    }

    // Hero limit check
    if (towerConfig.isHero && existingHeroes > 0) {
        return { valid: false, reason: "Only 1 Hero allowed" };
    }

    // Covered Garden constraint
    if (mapData.isCovered && isUnderGlass(x, y, canvasWidth, canvasHeight, coveredGardenQuadrant)) {
        return { valid: false, reason: "Under glass" };
    }

    // Path proximity check
    let onPath = false;
    for (let path of pathWaypoints) {
        for (let i = 0; i < path.length - 1; i++) {
            const dist = pointToSegmentDistance(x, y, path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
            if (dist < TRAP_PATH_MAX_DISTANCE) onPath = true;
            if (!towerConfig.isTrap && dist < TOWER_PATH_MIN_DISTANCE) {
                return { valid: false, reason: "Too close to path" };
            }
        }
    }

    // Traps MUST be on path
    if (towerConfig.isTrap && !onPath) {
        return { valid: false, reason: "Trap must be on path" };
    }

    // Tower collision check
    const collisionDist = towerConfig.isTrap ? TRAP_COLLISION_RADIUS : TOWER_COLLISION_RADIUS;
    for (const t of towers) {
        if (Math.hypot(t.x - x, t.y - y) < collisionDist) {
            return { valid: false, reason: "Tower collision" };
        }
    }

    // Trap validation passed
    if (towerConfig.isTrap) return { valid: true };

    // Water check
    const inWater = isPointInWater(x, y, canvasWidth, canvasHeight, mapData.waterZones, mapData.isGlassFloor);

    // Stump special feature
    if (mapData.specialFeature && mapData.specialFeature.type === 'stump') {
        const { STUMP_RADIUS } = require('../constants/GameConstants');
        const sx = mapData.specialFeature.x * canvasWidth;
        const sy = mapData.specialFeature.y * canvasHeight;
        if (Math.hypot(x - sx, y - sy) < STUMP_RADIUS) {
            if (towerConfig.waterOnly) return { valid: false, reason: "Water tower on stump" };
            return { valid: true }; // Non-water tower on stump is OK
        }
    }

    // Amphibious towers can be placed anywhere
    if (towerConfig.amphibious) return { valid: true };

    // Water tower placement
    if (towerConfig.waterOnly && !inWater) {
        return { valid: false, reason: "Water tower needs water" };
    }

    // Normal tower on water (unless glass floor)
    if (!towerConfig.waterOnly && inWater && !mapData.isGlassFloor) {
        return { valid: false, reason: "Cannot build on water" };
    }

    // Glass floor exception - normal towers can build on "water"
    if (mapData.isGlassFloor && !towerConfig.waterOnly) {
        return { valid: true };
    }

    return { valid: true };
}

/**
 * Calculate damage dealt to enemy (armor/resistance logic)
 */
export function calculateDamage(projectile, enemy) {
    const { ARMOR_DAMAGE_REDUCTION, REINFORCED_NINJA_DAMAGE } = require('../constants/GameConstants');

    let finalDamage = projectile.damage;

    // Reinforced Ninja special resistance
    if (enemy.type === 'reinforced_ninja') {
        // Only Fire (burn), Bomb (explosive), and Hero (shock) deal normal damage
        if (projectile.effect === 'burn' || projectile.effect === 'explosive' || projectile.effect === 'shock') {
            return { damage: finalDamage, isResisted: false };
        } else {
            return { damage: REINFORCED_NINJA_DAMAGE, isResisted: true };
        }
    }

    // Standard armored logic
    if (enemy.isArmored) {
        if (projectile.effect === 'burn' || projectile.effect === 'explosive') {
            return { damage: finalDamage, isResisted: false };
        } else {
            finalDamage = Math.floor(projectile.damage * ARMOR_DAMAGE_REDUCTION);
            if (finalDamage < 1) finalDamage = 1;
            return { damage: finalDamage, isResisted: true };
        }
    }

    return { damage: finalDamage, isResisted: false };
}

/**
 * Calculate wave spawn composition
 * Returns array of enemy types to spawn
 */
export function generateWaveComposition(waveNumber, balanceData) {
    const { baseCount, growthRate, spawnRules, bosses, sneakSpawnInterval } = balanceData.waves;
    const count = baseCount + Math.floor(waveNumber * growthRate);
    const spawnQueue = [];

    // Boss logic
    if (waveNumber % 100 === 0) {
        spawnQueue.push(bosses.wave100);
    } else if (waveNumber % 50 === 0) {
        spawnQueue.push(bosses.wave50);
    } else if (waveNumber % 10 === 0) {
        spawnQueue.push(bosses.wave10);
    }

    // Sneak spawn every 5 waves
    if (waveNumber % sneakSpawnInterval === 0) {
        const sneakCount = Math.ceil(waveNumber / 10);
        for (let k = 0; k < sneakCount; k++) {
            spawnQueue.push('sneak');
        }
    }

    // Regular enemies based on wave tier
    let enemyPool;
    if (waveNumber > 60) {
        enemyPool = spawnRules.waves61plus;
    } else if (waveNumber > 40) {
        enemyPool = spawnRules.waves41_60;
    } else if (waveNumber > 25) {
        enemyPool = spawnRules.waves26_40;
    } else if (waveNumber > 10) {
        enemyPool = spawnRules.waves11_25;
    } else {
        enemyPool = spawnRules.waves1_10;
    }

    for (let i = 0; i < count; i++) {
        const r = Math.random();
        const { enemies, weights } = enemyPool;

        // Find enemy based on random weight
        for (let j = 0; j < weights.length; j++) {
            if (r < weights[j]) {
                spawnQueue.push(enemies[j]);
                break;
            }
        }
    }

    // Shuffle
    spawnQueue.sort(() => Math.random() - 0.5);

    return spawnQueue;
}

/**
 * Calculate upgrade cost for a tower
 */
export function getUpgradeCost(baseConfig, level, isParagon) {
    const { UPGRADE_COST_MULTIPLIER } = require('../constants/GameConstants');
    if (isParagon) return 999999; // Cannot upgrade Paragon
    return Math.floor(baseConfig.cost * UPGRADE_COST_MULTIPLIER * level);
}

/**
 * Calculate sell value for a tower
 */
export function getSellValue(totalInvestment) {
    const { SELL_VALUE_MULTIPLIER } = require('../constants/GameConstants');
    return Math.floor(totalInvestment * SELL_VALUE_MULTIPLIER);
}

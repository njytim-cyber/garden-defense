/**
 * Entity Factory Functions
 * Creates game entities (towers, enemies) with all required properties and methods
 */

import * as GameConstants from '../constants/GameConstants';

/**
 * Create a tower entity
 */
export function createTower(x, y, type, config) {
    return {
        x,
        y,
        type,
        config,
        level: 1,
        damage: config.damage,
        range: config.range,
        cooldown: 0,
        isParagon: false,
        totalInvestment: config.cost,

        // Methods
        getUpgradeCost() {
            return this.isParagon
                ? 999999
                : Math.floor(this.config.cost * GameConstants.UPGRADE_COST_MULTIPLIER * this.level);
        },

        getSellValue() {
            return Math.floor(this.totalInvestment * GameConstants.SELL_VALUE_MULTIPLIER);
        },

        upgrade() {
            if (this.isParagon) return;
            const cost = this.getUpgradeCost();
            this.level++;
            this.damage *= GameConstants.UPGRADE_DAMAGE_MULTIPLIER;
            this.range *= GameConstants.UPGRADE_RANGE_MULTIPLIER;
            this.totalInvestment += cost;
        }
    };
}

/**
 * Create an enemy entity
 */
export function createEnemy(enemyType, enemyData, waveNumber, startPoint, canvasWidth, canvasHeight, speedMultiplier = 1) {
    const baseHealth = enemyData.baseHealth * (1 + waveNumber * 0.2); // 20% per wave

    return {
        x: startPoint.x * canvasWidth,
        y: startPoint.y * canvasHeight,
        type: enemyType,
        health: baseHealth,
        maxHealth: baseHealth,
        speed: enemyData.baseSpeed * speedMultiplier,
        bounty: enemyData.bounty,
        color: enemyData.color,
        radius: enemyData.radius,
        pathIndex: 0,
        waypointIndex: 0,

        // Status effects
        isFrozen: false,
        freezeTimer: 0,
        isBurning: false,
        burnTimer: 0,
        burnTickTimer: 0,
        isVoided: false,
        voidTimer: 0,

        // Special properties
        isStealthed: enemyData.type === 'stealth',
        isArmored: enemyData.type === 'armored' || enemyType.includes('reinforced'),
        isBoss: enemyData.type === 'boss'
    };
}

/**
 * Calculate lives damage based on enemy type
 */
export function calculateLivesDamage(enemy) {
    if (!enemy.isBoss) return GameConstants.BASIC_LIVES_DAMAGE;

    if (enemy.type === 'emperor') return GameConstants.EMPEROR_LIVES_DAMAGE;
    if (enemy.type === 'king') return GameConstants.KING_LIVES_DAMAGE;

    return GameConstants.BOSS_LIVES_DAMAGE;
}

/**
 * Update enemy status effects (freeze, burn, void)
 */
export function updateEnemyStatusEffects(enemy) {
    // Freeze
    if (enemy.isFrozen) {
        enemy.freezeTimer--;
        if (enemy.freezeTimer <= 0) enemy.isFrozen = false;
    }

    // Burn
    if (enemy.isBurning) {
        enemy.burnTimer--;
        enemy.burnTickTimer++;

        if (enemy.burnTickTimer >= GameConstants.BURN_TICK_RATE) {
            enemy.burnTickTimer = 0;
            enemy.health -= GameConstants.BURN_DAMAGE;
        }

        if (enemy.burnTimer <= 0) enemy.isBurning = false;
    }

    // Void
    if (enemy.isVoided) {
        enemy.voidTimer--;
        if (enemy.voidTimer <= 0) enemy.isVoided = false;
    }
}

/**
 * Update enemy movement along path
 * @returns {boolean} True if enemy reached end of path
 */
export function updateEnemyMovement(enemy, path, canvasWidth, canvasHeight) {
    if (enemy.isVoided) return false;

    if (!path || enemy.waypointIndex >= path.length - 1) {
        return true; // Reached end
    }

    const next = path[enemy.waypointIndex + 1];
    const targetX = next.x * canvasWidth;
    const targetY = next.y * canvasHeight;

    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;
    const dist = Math.hypot(dx, dy);

    const effectiveSpeed = enemy.isFrozen
        ? enemy.speed * GameConstants.FREEZE_SLOW_MULTIPLIER
        : enemy.speed;

    if (dist < effectiveSpeed) {
        enemy.waypointIndex++;
    } else {
        enemy.x += (dx / dist) * effectiveSpeed;
        enemy.y += (dy / dist) * effectiveSpeed;
    }

    return false;
}

/**
 * Create a soldier entity (spawned by barracks)
 */
export function createSoldier(x, y, barracksLevel = 1) {
    return {
        x,
        y,
        health: 100 * barracksLevel,
        maxHealth: 100 * barracksLevel,
        damage: 10 * barracksLevel,
        range: 40,
        speed: 0.5,
        regenRate: 2, // HP per second
        regenTimer: 0,
        cooldown: 0,
        attackCooldown: 30,
        radius: 15,
        color: '#4ade80' // Green
    };
}

/**
 * Check if trap should activate (enemy in range)
 */
export function checkTrapActivation(trap, enemies) {
    if (!trap.config.isTrap || trap.used) return null;

    return enemies.find(enemy => {
        const dist = Math.hypot(enemy.x - trap.x, enemy.y - trap.y);
        return dist <= trap.range;
    });
}

/**
 * Find towers eligible for paragon merging
 * Returns array of 3+ same-type towers with level 10+
 */
export function findParagonCandidates(towers, targetType) {
    const eligible = towers.filter(tower =>
        tower.type === targetType &&
        tower.level >= 10 &&
        !tower.isParagon
    );

    return eligible.length >= 3 ? eligible.slice(0, 3) : null;
}

/**
 * Merge 3 towers into a paragon
 */
export function createParagonTower(tower1, tower2, tower3) {
    const avgX = (tower1.x + tower2.x + tower3.x) / 3;
    const avgY = (tower1.y + tower2.y + tower3.y) / 3;

    return {
        ...tower1,
        x: avgX,
        y: avgY,
        level: 1,
        damage: tower1.damage * 5,
        range: tower1.range * 1.5,
        isParagon: true,
        totalInvestment: tower1.totalInvestment + tower2.totalInvestment + tower3.totalInvestment
    };
}


/**
 * Game Engine Container - ENHANCED VERSION
 * Full game loop with all advanced features from monolith
 * Includes: upgrades, status effects, special towers, special enemies, bosses
 */

/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import GameCanvasView from '../views/GameCanvasView';
import WaveHUDView from '../views/WaveHUDView';
import TowerPanelView from '../views/TowerPanelView';
import UpgradePanelView from '../views/UpgradePanelView';
import BALANCE_DATA from '../data/balance.json';
import { MAPS } from '../data/maps';
import {
    drawBackground,
    drawPath,
    drawWaterZone,
    drawTower,
    drawEnemy,
    drawProjectile,
    drawRangeIndicator,
    drawScenery
} from '../utils/renderHelpers';
import { isValidPlacement, generateWaveComposition, calculateDamage } from '../utils/gameLogic';
import * as GameConstants from '../constants/GameConstants';

export default function GameEngineContainer({
    mapKey,
    difficulty,
    towers: shopTowers,
    onMenuClick,
    onGameOver
}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const animationFrameRef = useRef(null);

    const mapData = MAPS[mapKey];
    const difficultyData = BALANCE_DATA.player.difficulties[difficulty];

    const [lives, setLives] = useState(GameConstants.STARTING_LIVES);
    const [money, setMoney] = useState(difficultyData.startMoney);
    const [waveNumber, setWaveNumber] = useState(1);
    const [isWaveActive, setIsWaveActive] = useState(false);
    const [selectedTowerType, setSelectedTowerType] = useState(null);
    const [selectedTower, setSelectedTower] = useState(null);

    const entitiesRef = useRef({
        towers: [],
        enemies: [],
        projectiles: [],
        soldiers: [], // For barracks
        coins: []
    });

    const mouseRef = useRef({ x: 0, y: 0 });
    const gameTickRef = useRef(0);
    const spawnQueueRef = useRef([]);
    const spawnTimerRef = useRef(0);

    const handleCanvasReady = useCallback((canvas, ctx) => {
        canvasRef.current = canvas;
        ctxRef.current = ctx;
    }, []);

    const handleMouseMove = useCallback((x, y) => {
        mouseRef.current = { x, y };
    }, []);

    const handleCanvasClick = useCallback((x, y) => {
        // Check if clicking existing tower
        const clickedTower = entitiesRef.current.towers.find(tower => {
            const dist = Math.hypot(tower.x - x, tower.y - y);
            return dist < GameConstants.TOWER_CLICK_RADIUS;
        });

        if (clickedTower) {
            setSelectedTower(clickedTower);
            setSelectedTowerType(null);
            return;
        }

        // Place new tower
        if (!selectedTowerType) return;

        const towerConfig = shopTowers[selectedTowerType];
        if (!towerConfig || money < towerConfig.cost) return;

        // Validate placement
        const validation = isValidPlacement(
            x, y,
            towerConfig,
            entitiesRef.current.towers,
            mapData.paths,
            mapData,
            canvasRef.current.width,
            canvasRef.current.height,
            null,
            0
        );

        if (validation.valid) {
            const newTower = {
                x, y,
                type: selectedTowerType,
                config: towerConfig,
                level: 1,
                damage: towerConfig.damage,
                range: towerConfig.range,
                cooldown: 0,
                isParagon: false,
                totalInvestment: towerConfig.cost,
                // Methods
                getUpgradeCost: function () {
                    return this.isParagon ? 999999 : Math.floor(this.config.cost * GameConstants.UPGRADE_COST_MULTIPLIER * this.level);
                },
                getSellValue: function () {
                    return Math.floor(this.totalInvestment * GameConstants.SELL_VALUE_MULTIPLIER);
                },
                upgrade: function () {
                    if (this.isParagon) return;
                    this.level++;
                    this.damage *= GameConstants.UPGRADE_DAMAGE_MULTIPLIER;
                    this.range *= GameConstants.UPGRADE_RANGE_MULTIPLIER;
                    this.totalInvestment += this.getUpgradeCost();
                }
            };

            // Handle traps (consumable)
            if (towerConfig.isTrap && shopTowers[selectedTowerType].quantity > 0) {
                shopTowers[selectedTowerType].quantity--;
            }

            entitiesRef.current.towers.push(newTower);
            setMoney(money - towerConfig.cost);
            setSelectedTowerType(null);
        }
    }, [selectedTowerType, shopTowers, money, mapData]);

    const handleWaveControl = useCallback(() => {
        if (isWaveActive) {
            setIsWaveActive(false);
        } else {
            const composition = generateWaveComposition(waveNumber, BALANCE_DATA);
            spawnQueueRef.current = composition;
            setIsWaveActive(true);
        }
    }, [isWaveActive, waveNumber]);

    const handleTowerUpgrade = useCallback(() => {
        if (!selectedTower) return;
        const cost = selectedTower.getUpgradeCost();
        if (money >= cost && !selectedTower.isParagon) {
            selectedTower.upgrade();
            setMoney(money - cost);
            setSelectedTower({ ...selectedTower }); // Force re-render
        }
    }, [selectedTower, money]);

    const handleTowerSell = useCallback(() => {
        if (!selectedTower) return;
        const value = selectedTower.getSellValue();
        entitiesRef.current.towers = entitiesRef.current.towers.filter(t => t !== selectedTower);
        setMoney(money + value);
        setSelectedTower(null);
    }, [selectedTower, money]);

    // Game loop
    useEffect(() => {
        if (!ctxRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const entities = entitiesRef.current;

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background
            drawBackground(ctx, canvas.width, canvas.height, mapData.bgColor);

            // Draw water zones
            if (mapData.waterZones) {
                mapData.waterZones.forEach(zone => {
                    drawWaterZone(ctx, zone, canvas.width, canvas.height);
                });
            }

            // Draw paths
            mapData.paths.forEach(path => {
                drawPath(ctx, path, canvas.width, canvas.height, mapData.sceneryType || 'default');
            });

            // Spawn enemies
            if (isWaveActive && spawnQueueRef.current.length > 0) {
                spawnTimerRef.current++;
                if (spawnTimerRef.current >= GameConstants.SPAWN_DELAY_FRAMES) {
                    spawnTimerRef.current = 0;
                    const enemyType = spawnQueueRef.current.shift();
                    const enemyData = BALANCE_DATA.enemies[enemyType];

                    if (enemyData) {
                        const startPoint = mapData.paths[0][0];
                        const baseHealth = enemyData.baseHealth * (1 + waveNumber * BALANCE_DATA.waves.healthMultiplier);

                        entities.enemies.push({
                            x: startPoint.x * canvas.width,
                            y: startPoint.y * canvas.height,
                            type: enemyType,
                            health: baseHealth,
                            maxHealth: baseHealth,
                            speed: enemyData.baseSpeed * (difficultyData.speedMultiplier || 1),
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
                            // Boss flag
                            isBoss: enemyData.type === 'boss'
                        });
                    }
                }
            }

            // Update and draw enemies
            entities.enemies = entities.enemies.filter(enemy => {
                // Status effect updates
                if (enemy.isFrozen) {
                    enemy.freezeTimer--;
                    if (enemy.freezeTimer <= 0) enemy.isFrozen = false;
                }

                if (enemy.isBurning) {
                    enemy.burnTimer--;
                    enemy.burnTickTimer++;
                    if (enemy.burnTickTimer >= GameConstants.BURN_TICK_RATE) {
                        enemy.burnTickTimer = 0;
                        enemy.health -= GameConstants.BURN_DAMAGE;
                    }
                    if (enemy.burnTimer <= 0) enemy.isBurning = false;
                }

                if (enemy.isVoided) {
                    enemy.voidTimer--;
                    if (enemy.voidTimer <= 0) enemy.isVoided = false;
                }

                // Movement
                if (!enemy.isVoided) {
                    const path = mapData.paths[enemy.pathIndex || 0];
                    if (!path || enemy.waypointIndex >= path.length - 1) {
                        const livesDamage = enemy.isBoss ? (enemy.type === 'emperor' ? GameConstants.EMPEROR_LIVES_DAMAGE : enemy.type === 'king' ? GameConstants.KING_LIVES_DAMAGE : GameConstants.BOSS_LIVES_DAMAGE) : GameConstants.BASIC_LIVES_DAMAGE;
                        setLives(prev => prev - livesDamage);
                        return false;
                    }

                    const current = path[enemy.waypointIndex];
                    const next = path[enemy.waypointIndex + 1];
                    const targetX = next.x * canvas.width;
                    const targetY = next.y * canvas.height;

                    const dx = targetX - enemy.x;
                    const dy = targetY - enemy.y;
                    const dist = Math.hypot(dx, dy);

                    const effectiveSpeed = enemy.isFrozen ? enemy.speed * GameConstants.FREEZE_SLOW_MULTIPLIER : enemy.speed;

                    if (dist < effectiveSpeed) {
                        enemy.waypointIndex++;
                    } else {
                        enemy.x += (dx / dist) * effectiveSpeed;
                        enemy.y += (dy / dist) * effectiveSpeed;
                    }
                }

                // Check if dead
                if (enemy.health <= 0) {
                    setMoney(prev => prev + enemy.bounty);
                    return false;
                }

                drawEnemy(ctx, enemy);
                return true;
            });

            // Update and draw towers
            entities.towers.forEach(tower => {
                tower.cooldown = Math.max(0, tower.cooldown - 1);

                // Bank income
                if (tower.config.effect === 'income') {
                    if (gameTickRef.current % tower.config.cooldown === 0) {
                        setMoney(prev => prev + GameConstants.BANK_INCOME_AMOUNT);
                    }
                }

                // Find target
                if (tower.cooldown === 0 && !tower.config.isTrap && tower.config.effect !== 'income') {
                    const target = entities.enemies.find(enemy => {
                        // Camo detection
                        if (enemy.isStealthed && !tower.config.camoDetection) return false;

                        const dist = Math.hypot(enemy.x - tower.x, enemy.y - tower.y);
                        return dist <= tower.range;
                    });

                    if (target) {
                        entities.projectiles.push({
                            x: tower.x,
                            y: tower.y,
                            targetX: target.x,
                            targetY: target.y,
                            target: target,
                            damage: tower.damage,
                            speed: tower.config.bulletSpeed || 8,
                            color: tower.config.projectileColor || '#fff',
                            effect: tower.config.effect,
                            isParagon: tower.isParagon
                        });
                        tower.cooldown = tower.config.cooldown;
                    }
                }

                drawTower(ctx, tower);
            });

            // Update and draw projectiles
            entities.projectiles = entities.projectiles.filter(projectile => {
                const dx = projectile.target.x - projectile.x;
                const dy = projectile.target.y - projectile.y;
                const dist = Math.hypot(dx, dy);

                if (dist < projectile.speed) {
                    // Hit target
                    const damageResult = calculateDamage(projectile, projectile.target);
                    projectile.target.health -= damageResult.damage;

                    // Apply status effects
                    if (projectile.effect === 'freeze') {
                        projectile.target.isFrozen = true;
                        projectile.target.freezeTimer = GameConstants.FREEZE_DURATION;
                    } else if (projectile.effect === 'burn') {
                        projectile.target.isBurning = true;
                        projectile.target.burnTimer = GameConstants.BURN_DURATION;
                    } else if (projectile.effect === 'void') {
                        projectile.target.isVoided = true;
                        projectile.target.voidTimer = GameConstants.VOID_DURATION;
                    }

                    return false;
                }

                projectile.x += (dx / dist) * projectile.speed;
                projectile.y += (dy / dist) * projectile.speed;

                drawProjectile(ctx, projectile);
                return true;
            });

            // Draw placement preview
            if (selectedTowerType && shopTowers[selectedTowerType]) {
                const towerConfig = shopTowers[selectedTowerType];
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;

                const validation = isValidPlacement(
                    mx, my,
                    towerConfig,
                    entities.towers,
                    mapData.paths,
                    mapData,
                    canvas.width,
                    canvas.height,
                    null,
                    0
                );

                drawRangeIndicator(ctx, mx, my, towerConfig.range, validation.valid);
            }

            // Check wave complete
            if (isWaveActive && spawnQueueRef.current.length === 0 && entities.enemies.length === 0) {
                setIsWaveActive(false);
                setWaveNumber(prev => prev + 1);
                setMoney(prev => prev + GameConstants.WAVE_BONUS_MONEY);
            }

            gameTickRef.current++;
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        }

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [mapData, isWaveActive, waveNumber, selectedTowerType, shopTowers, money, difficultyData]);

    // Check game over
    useEffect(() => {
        if (lives <= 0) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            onGameOver?.();
        }
    }, [lives, onGameOver]);

    return (
        <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
            <GameCanvasView
                width={1000}
                height={700}
                onCanvasReady={handleCanvasReady}
                onMouseMove={handleMouseMove}
                onClick={handleCanvasClick}
            />

            <WaveHUDView
                lives={lives}
                money={money}
                waveNumber={waveNumber}
                isWaveActive={isWaveActive}
                onWaveControlClick={handleWaveControl}
            />

            <TowerPanelView
                towers={shopTowers}
                selectedTowerType={selectedTowerType}
                money={money}
                onTowerSelect={setSelectedTowerType}
                onMenuClick={onMenuClick}
            />

            <UpgradePanelView
                tower={selectedTower}
                onUpgrade={handleTowerUpgrade}
                onSell={handleTowerSell}
                onClose={() => setSelectedTower(null)}
                canAffordUpgrade={selectedTower ? money >= selectedTower.getUpgradeCost() : false}
            />
        </div>
    );
}

GameEngineContainer.propTypes = {
    mapKey: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    towers: PropTypes.object.isRequired,
    onMenuClick: PropTypes.func.isRequired,
    onGameOver: PropTypes.func
};

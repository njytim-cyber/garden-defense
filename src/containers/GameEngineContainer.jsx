/**
 * Game Engine Container - ENHANCED VERSION
 * Full game loop with all advanced features from monolith
 * Includes: upgrades, status effects, special towers, special enemies, bosses
 */

/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameCanvasView from '../views/GameCanvasView';
import WaveHUDView from '../views/WaveHUDView';
import TowerPanelView from '../views/TowerPanelView';
import UpgradePanelView from '../views/UpgradePanelView';
import ParagonMergeView from '../views/ParagonMergeView';
import BALANCE_DATA from '../data/balance.json';
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
import { createTower, createEnemy, calculateLivesDamage, updateEnemyStatusEffects, updateEnemyMovement, createSoldier, checkTrapActivation, createParagonTower, findParagonCandidates } from '../utils/entityFactories';
import * as GameConstants from '../constants/GameConstants';

export default function GameEngineContainer({
    mapKey,
    mapData, // Injected prop
    difficulty,
    towers: shopTowers,
    onMenuClick,
    onGameOver
}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const animationFrameRef = useRef(null);

    const difficultyData = BALANCE_DATA.player.difficulties[difficulty];

    if (!mapData) {
        console.error(`CRITICAL ERROR: Map data not found for key: "${mapKey}"`);
        return <div className="text-red-500 text-2xl p-8">Error: Map data missing for "{mapKey}"</div>;
    }

    if (!difficultyData) {
        console.error(`CRITICAL ERROR: Difficulty data not found for key: "${difficulty}"`);
        return <div className="text-red-500 text-2xl p-8">Error: Difficulty data missing for "{difficulty}"</div>;
    }

    const [lives, setLives] = useState(GameConstants.STARTING_LIVES);
    const [money, setMoney] = useState(difficultyData.startMoney);
    const [waveNumber, setWaveNumber] = useState(1);
    const [isWaveActive, setIsWaveActive] = useState(false);
    const [selectedTowerType, setSelectedTowerType] = useState(null);
    const [selectedTower, setSelectedTower] = useState(null);
    const [paragonMode, setParagonMode] = useState(false);
    const [selectedForParagon, setSelectedForParagon] = useState([]);

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
            // Paragon mode: Select up to 3 towers
            if (paragonMode) {
                if (selectedForParagon.includes(clickedTower)) {
                    setSelectedForParagon(selectedForParagon.filter(t => t !== clickedTower));
                } else if (selectedForParagon.length < 3) {
                    // Check if same type and level 10+
                    if (selectedForParagon.length === 0 ||
                        (clickedTower.type === selectedForParagon[0].type && clickedTower.level >= 10 && !clickedTower.isParagon)) {
                        setSelectedForParagon([...selectedForParagon, clickedTower]);
                    }
                }
                return;
            }

            // Normal mode: Open upgrade panel
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
            const newTower = createTower(x, y, selectedTowerType, towerConfig);

            // Handle traps (consumable)
            if (towerConfig.isTrap && shopTowers[selectedTowerType].quantity > 0) {
                shopTowers[selectedTowerType].quantity--;
            }

            entitiesRef.current.towers.push(newTower);
            setMoney(money - towerConfig.cost);
            setSelectedTowerType(null);
        }
    }, [selectedTowerType, shopTowers, money, mapData, paragonMode, selectedForParagon]);

    const handleWaveControl = useCallback(() => {
        if (isWaveActive) {
            console.log('[DEBUG] Pausing wave');
            setIsWaveActive(false);
        } else {
            console.log(`[DEBUG] Starting wave ${waveNumber}`);
            const composition = generateWaveComposition(waveNumber, BALANCE_DATA);
            console.log(`[DEBUG] Generated composition: ${composition.length} enemies`, composition);
            spawnQueueRef.current = composition;
            setIsWaveActive(true);
        }
    }, [isWaveActive, waveNumber]);

    const handleTowerUpgradeoptimization = useMemo(() => ({
        canAfford: selectedTower && money >= selectedTower.getUpgradeCost(),
        cost: selectedTower?.getUpgradeCost() || 0
    }), [selectedTower, money]);

    const handleTowerUpgrade = useCallback(() => {
        if (!selectedTower) return;
        const cost = selectedTower.getUpgradeCost();
        if (money >= cost && !selectedTower.isParagon) {
            selectedTower.upgrade();
            setMoney(prev => prev - cost);
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

    const handleParagonMerge = useCallback(() => {
        if (selectedForParagon.length !== 3) return;

        const [tower1, tower2, tower3] = selectedForParagon;
        const paragonTower = createParagonTower(tower1, tower2, tower3);

        // Remove original towers
        entitiesRef.current.towers = entitiesRef.current.towers.filter(
            t => !selectedForParagon.includes(t)
        );

        // Add paragon
        entitiesRef.current.towers.push(paragonTower);

        // Exit paragon mode
        setParagonMode(false);
        setSelectedForParagon([]);
    }, [selectedForParagon]);

    // Game loop
    useEffect(() => {
        if (!ctxRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const entities = entitiesRef.current;

        function gameLoop() {
            try {
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
                            const enemy = createEnemy(
                                enemyType,
                                enemyData,
                                waveNumber,
                                startPoint,
                                canvas.width,
                                canvas.height,
                                difficultyData.speedMultiplier || 1
                            );
                            entities.enemies.push(enemy);
                        }
                    }
                }

                // Update and draw enemies
                entities.enemies = entities.enemies.filter(enemy => {
                    // Update status effects (freeze, burn, void)
                    updateEnemyStatusEffects(enemy);

                    // Update movement
                    // console.log(`[DEBUG] Updating enemy ${enemy.id || 'unknown'} at ${enemy.x.toFixed(1)},${enemy.y.toFixed(1)}`);

                    const path = mapData.paths[enemy.pathIndex || 0];
                    const reachedEnd = updateEnemyMovement(enemy, path, canvas.width, canvas.height);

                    if (reachedEnd) {
                        const livesDamage = calculateLivesDamage(enemy);
                        setLives(prev => prev - livesDamage);
                        return false;
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

                    // Barracks: Spawn soldiers
                    if (tower.config.effect === 'barracks') {
                        const maxSoldiers = 3;
                        const currentSoldiers = entities.soldiers.filter(s => s.barracksId === tower.x + '_' + tower.y).length;

                        if (currentSoldiers < maxSoldiers && tower.cooldown === 0) {
                            const angle = Math.random() * Math.PI * 2;
                            const dist = 30;
                            entities.soldiers.push({
                                ...createSoldier(
                                    tower.x + Math.cos(angle) * dist,
                                    tower.y + Math.sin(angle) * dist,
                                    tower.level
                                ),
                                barracksId: tower.x + '_' + tower.y
                            });
                            tower.cooldown = 180; // 3 seconds
                        }
                    }

                    // Check for trap activation
                    if (tower.config.isTrap && !tower.used) {
                        const activatedEnemy = checkTrapActivation(tower, entities.enemies);
                        if (activatedEnemy) {
                            activatedEnemy.health -= tower.damage;
                            tower.used = true;
                            // Mark for removal
                            setTimeout(() => {
                                entitiesRef.current.towers = entitiesRef.current.towers.filter(t => t !== tower);
                            }, 100);
                        }
                    }

                    // Find target (non-trap, non-income, non-barracks)
                    if (tower.cooldown === 0 && !tower.config.isTrap && tower.config.effect !== 'income' && tower.config.effect !== 'barracks') {
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

                // Update and draw soldiers
                entities.soldiers = entities.soldiers.filter(soldier => {
                    // Regeneration
                    soldier.regenTimer++;
                    if (soldier.regenTimer >= 60) { // Every second
                        soldier.regenTimer = 0;
                        soldier.health = Math.min(soldier.maxHealth, soldier.health + soldier.regenRate);
                    }

                    // Find enemy to attack
                    soldier.cooldown = Math.max(0, soldier.cooldown - 1);
                    if (soldier.cooldown === 0) {
                        const target = entities.enemies.find(enemy => {
                            const dist = Math.hypot(enemy.x - soldier.x, enemy.y - soldier.y);
                            return dist <= soldier.range;
                        });

                        if (target) {
                            target.health -= soldier.damage;
                            soldier.cooldown = soldier.attackCooldown;
                        }
                    }

                    // Check if dead
                    if (soldier.health <= 0) return false;

                    // Draw soldier
                    ctx.fillStyle = soldier.color;
                    ctx.beginPath();
                    ctx.arc(soldier.x, soldier.y, soldier.radius, 0, Math.PI * 2);
                    ctx.fill();

                    // Health bar
                    const barWidth = 30;
                    const healthPercent = soldier.health / soldier.maxHealth;
                    ctx.fillStyle = '#000';
                    ctx.fillRect(soldier.x - barWidth / 2, soldier.y - 25, barWidth, 4);
                    ctx.fillStyle = '#4ade80';
                    ctx.fillRect(soldier.x - barWidth / 2, soldier.y - 25, barWidth * healthPercent, 4);

                    return true;
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
                    console.log('[DEBUG] Wave Limit Reached - Ending Wave');
                    setIsWaveActive(false);
                    setWaveNumber(prev => prev + 1);
                    setMoney(prev => prev + GameConstants.WAVE_BONUS_MONEY);
                }

                gameTickRef.current++;
                animationFrameRef.current = requestAnimationFrame(gameLoop);
                animationFrameRef.current = requestAnimationFrame(gameLoop);
            } catch (error) {
                console.error("CRITICAL GAME LOOP ERROR:", error);
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            }
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
                onParagonMode={() => {
                    setParagonMode(true);
                    setSelectedTower(null);
                    setSelectedForParagon([]);
                }}
            />

            {paragonMode && (
                <ParagonMergeView
                    selectedTowers={selectedForParagon}
                    onMerge={handleParagonMerge}
                    onCancel={() => {
                        setParagonMode(false);
                        setSelectedForParagon([]);
                    }}
                />
            )}
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

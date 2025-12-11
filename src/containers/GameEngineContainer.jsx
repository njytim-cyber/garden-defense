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
    drawScenery,
    drawTowerRange,
    drawFloatingText
} from '../utils/renderHelpers';
import { isValidPlacement, generateWaveComposition, calculateDamage } from '../utils/gameLogic';
import assetLoader from '../utils/AssetLoader';
import { createTower, createEnemy, calculateLivesDamage, updateEnemyStatusEffects, updateEnemyMovement, createSoldier, checkTrapActivation, createParagonTower, findParagonCandidates } from '../utils/entityFactories';
import * as GameConstants from '../constants/GameConstants';
import { generateMapDecorations, drawDecorations } from '../utils/mapDecorations';

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
    const [assetsLoaded, setAssetsLoaded] = useState(false);

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
    const [isPaused, setIsPaused] = useState(false);
    const [gameSpeed, setGameSpeed] = useState(1);
    const [selectedTowerType, setSelectedTowerType] = useState(null);
    const [selectedTower, setSelectedTower] = useState(null);
    const [paragonMode, setParagonMode] = useState(false);
    const [selectedForParagon, setSelectedForParagon] = useState([]);

    const entitiesRef = useRef({
        towers: [],
        enemies: [],
        projectiles: [],
        soldiers: [], // For barracks
        coins: [],
        floatingTexts: [] // Damage numbers
    });

    const mouseRef = useRef({ x: 0, y: 0 });
    const gameTickRef = useRef(0);
    const shakeIntensityRef = useRef(0);
    const spawnQueueRef = useRef([]);
    const spawnTimerRef = useRef(0);
    const decorationsRef = useRef(null);

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

        // Trash/Cancel Logic: Bottom 15% of screen
        const TRASH_ZONE_Y = canvasRef.current ? canvasRef.current.height * 0.85 : 600;
        if (y > TRASH_ZONE_Y) {
            setSelectedTowerType(null);
            return;
        }

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

    const handleStartWave = useCallback(() => {
        if (!isWaveActive) {
            console.log(`[DEBUG] Starting wave ${waveNumber}`);
            const composition = generateWaveComposition(waveNumber, BALANCE_DATA);
            console.log(`[DEBUG] Generated composition: ${composition.length} enemies`, composition);
            spawnQueueRef.current = composition;
            setIsWaveActive(true);
            setIsPaused(false);
        }
    }, [isWaveActive, waveNumber]);

    const handlePauseToggle = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    const handleSpeedToggle = useCallback(() => {
        setGameSpeed(prev => prev === 1 ? 2 : 1);
    }, []);

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

    // Preload assets on mount
    useEffect(() => {
        assetLoader.load().then(() => {
            console.log('✅ All game assets loaded!');
            setAssetsLoaded(true);
        }).catch(err => {
            console.error('❌ Asset loading failed:', err);
            setAssetsLoaded(true); // Continue anyway with placeholders
        });
    }, []);

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
                // Screen shake logic
                if (shakeIntensityRef.current > 0) {
                    shakeIntensityRef.current *= 0.9; // Decay
                    if (shakeIntensityRef.current < 0.5) shakeIntensityRef.current = 0;
                }

                ctx.save();
                if (shakeIntensityRef.current > 0) {
                    const dx = (Math.random() - 0.5) * shakeIntensityRef.current;
                    const dy = (Math.random() - 0.5) * shakeIntensityRef.current;
                    ctx.translate(dx, dy);
                }

                // Draw background
                drawBackground(ctx, canvas.width, canvas.height, mapData.bgColor, mapData.sceneryType);

                // Draw water zones
                if (mapData.waterZones) {
                    mapData.waterZones.forEach(zone => {
                        drawWaterZone(ctx, zone, canvas.width, canvas.height);
                    });
                }

                // Generate decorations ONCE (cached in ref)
                if (!decorationsRef.current) {
                    decorationsRef.current = generateMapDecorations(canvas.width, canvas.height, mapData.sceneryType || 'default');
                }

                // Draw decorations (under path)
                drawDecorations(ctx, decorationsRef.current);

                // Draw paths
                mapData.paths.forEach(path => {
                    drawPath(ctx, path, canvas.width, canvas.height, mapData.sceneryType || 'default', assetLoader);
                });

                // If paused, only draw entities (no updates) then continue loop
                if (isPaused) {
                    // Draw existing entities without updating
                    entities.enemies.forEach(enemy => drawEnemy(ctx, enemy, assetLoader));
                    entities.towers.forEach(tower => {
                        if (tower === selectedTower) {
                            drawTowerRange(ctx, tower, tower.config?.effect);
                        }
                        drawTower(ctx, tower, assetLoader);
                    });
                    entities.projectiles.forEach(proj => drawProjectile(ctx, proj));

                    entities.projectiles.forEach(proj => drawProjectile(ctx, proj));

                    ctx.restore(); // Restore shake transform
                    animationFrameRef.current = requestAnimationFrame(gameLoop);
                    return;
                }

                // Apply speed multiplier for game updates
                const speedLoops = gameSpeed;
                for (let speedTick = 0; speedTick < speedLoops; speedTick++) {

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
                            shakeIntensityRef.current = 15; // Trigger strong shake on life loss
                            return false;
                        }

                        // Check if dead
                        if (enemy.health <= 0) {
                            setMoney(prev => prev + enemy.bounty);
                            return false;
                        }

                        drawEnemy(ctx, enemy, assetLoader);
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

                        // Find target for aiming/shooting (non-trap, non-income, non-barracks)
                        let currentTarget = null;
                        if (!tower.config.isTrap && tower.config.effect !== 'income' && tower.config.effect !== 'barracks') {
                            currentTarget = entities.enemies.find(enemy => {
                                // Camo detection
                                if (enemy.isStealthed && !tower.config.camoDetection) return false;

                                const dist = Math.hypot(enemy.x - tower.x, enemy.y - tower.y);
                                return dist <= tower.range;
                            });

                            // Fire projectile if ready and has target
                            if (tower.cooldown === 0 && currentTarget) {
                                entities.projectiles.push({
                                    x: tower.x,
                                    y: tower.y,
                                    targetX: currentTarget.x,
                                    targetY: currentTarget.y,
                                    target: currentTarget,
                                    damage: tower.damage,
                                    speed: tower.config.bulletSpeed || 8,
                                    color: tower.config.projectileColor || '#fff',
                                    effect: tower.config.effect,
                                    isParagon: tower.isParagon
                                });
                                tower.cooldown = tower.config.cooldown;
                            }
                        }

                        // Draw tower with rotation toward target
                        drawTower(ctx, tower, assetLoader, currentTarget);
                    });

                    // Draw range circle for selected tower
                    if (selectedTower && entitiesRef.current.towers.includes(selectedTower)) {
                        drawTowerRange(ctx, selectedTower);
                    }

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
                                target.hitFlash = 6; // Flash for 6 frames (~0.1s)
                                soldier.cooldown = soldier.attackCooldown;

                                // Floating text
                                entities.floatingTexts.push({
                                    x: target.x,
                                    y: target.y - 15,
                                    text: Math.round(soldier.damage),
                                    color: '#fff',
                                    alpha: 1.0,
                                    life: 40
                                });
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
                            projectile.target.hitFlash = 6; // Flash for 6 frames (~0.1s)

                            // Determine text color based on effect/crit
                            let textColor = '#fff';
                            if (damageResult.isCrit) textColor = '#fbbf24'; // Orange/Gold for crit
                            else if (projectile.effect === 'freeze') textColor = '#06b6d4'; // Cyan
                            else if (projectile.effect === 'burn') textColor = '#f97316'; // Orange
                            else if (projectile.effect === 'poison') textColor = '#84cc16'; // Lime
                            else if (projectile.effect === 'void') textColor = '#a855f7'; // Purple

                            // Spawn floating text
                            entities.floatingTexts.push({
                                x: projectile.target.x,
                                y: projectile.target.y - 15,
                                text: Math.round(damageResult.damage) + (damageResult.isCrit ? '!' : ''),
                                color: textColor,
                                alpha: 1.0,
                                life: 50
                            });

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

                    // Update and draw floating texts
                    entities.floatingTexts = entities.floatingTexts.filter(ft => {
                        ft.y -= 0.5; // Float up
                        ft.life--;
                        ft.alpha = Math.min(1, ft.life / 20); // Fade out

                        if (ft.life <= 0) return false;

                        drawFloatingText(ctx, ft.text, ft.x, ft.y, ft.alpha, ft.color);
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

                        // Check if in Trash Zone (bottom 15%)
                        const isTrashZone = my > canvas.height * 0.85;

                        // Draw indicator with Trash status
                        drawRangeIndicator(ctx, mx, my, towerConfig.range, validation.valid && !isTrashZone);

                        if (isTrashZone) {
                            ctx.save();
                            ctx.fillStyle = "rgba(220, 38, 38, 0.9)"; // Red
                            ctx.beginPath();
                            ctx.arc(mx, my, 40, 0, Math.PI * 2);
                            ctx.fill();

                            ctx.strokeStyle = "white";
                            ctx.lineWidth = 4;
                            ctx.beginPath();
                            // Draw X
                            const r = 15;
                            ctx.moveTo(mx - r, my - r);
                            ctx.lineTo(mx + r, my + r);
                            ctx.moveTo(mx + r, my - r);
                            ctx.lineTo(mx - r, my + r);
                            ctx.stroke();

                            ctx.font = "bold 14px Arial";
                            ctx.fillStyle = "white";
                            ctx.textAlign = "center";
                            ctx.fillText("CANCEL", mx, my + 55);
                            ctx.restore();
                        }
                    }

                    // Check wave complete
                    if (isWaveActive && spawnQueueRef.current.length === 0 && entities.enemies.length === 0) {
                        console.log('[DEBUG] Wave Limit Reached - Ending Wave');
                        setIsWaveActive(false);
                        setWaveNumber(prev => prev + 1);
                        setMoney(prev => prev + GameConstants.WAVE_BONUS_MONEY);
                    }

                } // End speed loop

                ctx.restore(); // Restore shake transform (end of frame)
                gameTickRef.current++;
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
            // Ensure context is restored if loop breaks unexpectedly
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.restore();
            }
        };
    }, [mapData, isWaveActive, isPaused, gameSpeed, waveNumber, selectedTowerType, selectedTower, shopTowers, money, difficultyData]);

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
                lives={lives}
                onCanvasReady={handleCanvasReady}
                onMouseMove={handleMouseMove}
                onClick={handleCanvasClick}
            />

            <WaveHUDView
                lives={lives}
                money={money}
                waveNumber={waveNumber}
                totalWaves={BALANCE_DATA.waves?.totalWaves || 15}
                isWaveActive={isWaveActive}
                isPaused={isPaused}
                gameSpeed={gameSpeed}
                onStartWave={handleStartWave}
                onPauseToggle={handlePauseToggle}
                onSpeedToggle={handleSpeedToggle}
                onMenuClick={onMenuClick}
            />

            <TowerPanelView
                towers={shopTowers}
                selectedTowerType={selectedTowerType}
                money={money}
                onTowerSelect={setSelectedTowerType}
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

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import MainMenuView from './views/MainMenuView';
import MapSelectionView from './views/MapSelectionView';
import DifficultySelectionView from './views/DifficultySelectionView';
import ShopView from './views/ShopView';
import CompendiumView from './views/CompendiumView';
import SkinShopView from './views/SkinShopView';
import GameEngineContainer from './containers/GameEngineContainer';
import BALANCE_DATA from './data/balance.json';
import { MAPS } from './data/maps';
import { loadGame, saveGame } from './utils/persistence';

function App() {
    const [screen, setScreen] = useState('menu');
    const [selectedMap, setSelectedMap] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);


    // Initialize state from storage
    const [initialState] = useState(() => {
        const t = JSON.parse(JSON.stringify(BALANCE_DATA.towers));
        const { metaMoney, xp } = loadGame(t);
        return { towers: t, metaMoney, xp: xp || 0 };
    });

    const [metaMoney, setMetaMoney] = useState(initialState.metaMoney);
    const [xp, setXp] = useState(initialState.xp);
    const [towers, setTowers] = useState(initialState.towers);

    // Shop items (towers with shopPrice)
    const shopItems = Object.entries(towers)
        .filter(([_, tower]) => tower.shopPrice)
        .map(([key, tower]) => ({ ...tower, key }));

    const handleBuyItem = (key) => {
        const item = towers[key];
        if (metaMoney >= item.shopPrice) {
            const newTowers = { ...towers };

            if (key === 'spike') {
                // Consumable - increase quantity
                newTowers[key] = {
                    ...item,
                    quantity: (item.quantity || 0) + 1,
                    locked: false
                };
                setMetaMoney(metaMoney - item.shopPrice);
            } else if (item.locked) {
                // Unlock
                newTowers[key] = { ...item, locked: false };
                setMetaMoney(metaMoney - item.shopPrice);
            }

            setTowers(newTowers);

            saveGame(metaMoney - item.shopPrice, newTowers, xp);
        }
    };

    const handleGainXp = (amount) => {
        const newXp = Math.floor(xp + amount);
        setXp(newXp);
        saveGame(metaMoney, towers, newXp);
    };

    const handleMapSelect = (mapKey) => {
        setSelectedMap(mapKey);
        setScreen('difficulty');
    };

    const handleDifficultySelect = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setScreen('game');
    };

    const handleGameOver = () => {
        alert('Game Over! Returning to menu.');
        setScreen('menu');
    };

    return (
        <div className="w-screen h-screen relative bg-slate-900">
            {screen === 'menu' && (
                <MainMenuView
                    onPlayClick={() => setScreen('maps')}
                    onShopClick={() => setScreen('shop')}
                    onSkinsClick={() => setScreen('skins')}
                    onGuideClick={() => setScreen('compendium')}

                    xp={xp}
                />
            )}

            {screen === 'maps' && (
                <MapSelectionView
                    onMapSelect={handleMapSelect}
                    onBack={() => setScreen('menu')}
                />
            )}

            {screen === 'difficulty' && (
                <DifficultySelectionView
                    onDifficultySelect={handleDifficultySelect}
                    onBack={() => setScreen('maps')}
                    mapData={MAPS[selectedMap]}
                />
            )}

            {screen === 'shop' && (
                <ShopView
                    items={shopItems}
                    metaMoney={metaMoney}
                    onBuyItem={handleBuyItem}
                    onBack={() => setScreen('menu')}
                />
            )}

            {screen === 'skins' && (
                <SkinShopView onBack={() => setScreen('menu')} />
            )}

            {screen === 'compendium' && (
                <CompendiumView onBack={() => setScreen('menu')} />
            )}

            {screen === 'game' && selectedMap && selectedDifficulty && (
                <GameEngineContainer
                    mapKey={selectedMap}
                    mapData={MAPS[selectedMap]}
                    difficulty={selectedDifficulty}
                    towers={towers}
                    onMenuClick={() => setScreen('menu')}

                    onGameOver={handleGameOver}
                    onGainXp={handleGainXp}
                />
            )}
        </div>
    );
}

export default App;

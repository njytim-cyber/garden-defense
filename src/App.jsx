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
    const [metaMoney, setMetaMoney] = useState(1000);
    const [towers, setTowers] = useState(() => {
        // Deep clone towers from balance data
        const towersCopy = JSON.parse(JSON.stringify(BALANCE_DATA.towers));
        // Load saved state
        const loadedMoney = loadGame(towersCopy);
        setMetaMoney(loadedMoney);
        return towersCopy;
    });

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
            saveGame(metaMoney - item.shopPrice, newTowers);
        }
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
                />
            )}
        </div>
    );
}

export default App;

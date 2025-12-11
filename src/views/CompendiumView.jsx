/**
 * Compendium (Wiki/Guide) View
 * Pure UI component extracted from monolith (lines 117-134, 877-961)
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BALANCE_DATA from '../data/balance.json';
import assetManifest from '../../assets/asset-manifest.json';
import { CoinIcon } from '../components/Icons';

export default function CompendiumView({ onBack }) {
    const [activeTab, setActiveTab] = useState('enemies');

    const enemies = Object.entries(BALANCE_DATA.enemies);
    const towers = Object.entries(BALANCE_DATA.towers);

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
            <div className="w-full max-w-6xl p-8 h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4 shrink-0">
                    <div className="flex items-center gap-6">
                        <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                            <img src="/assets/ui/compendium_icon.png" alt="Compendium" className="w-10 h-10 object-contain" /> COMPENDIUM
                        </h2>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('enemies')}
                                className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'enemies'
                                    ? 'bg-cyan-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                ENEMIES
                            </button>
                            <button
                                onClick={() => setActiveTab('towers')}
                                className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'towers'
                                    ? 'bg-cyan-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                TOWERS
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-slate-400 hover:text-white text-xl pointer-events-auto font-bold px-4 py-2 rounded hover:bg-white/10 transition-colors"
                    >
                        ✕ CLOSE
                    </button>
                </div>

                <div className="overflow-y-auto flex-grow pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-auto">
                    {activeTab === 'enemies' ? (
                        enemies.map(([enemyKey, enemy]) => (
                            <div
                                key={enemy.name}
                                className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col gap-3 shadow-md hover:border-cyan-500/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                                        {assetManifest.enemies[enemyKey] ? (
                                            <img
                                                src={`/assets/${assetManifest.enemies[enemyKey]}`}
                                                alt={enemy.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-12 h-12 rounded-full border-2 border-slate-600 shadow-inner flex items-center justify-center"
                                            style={{
                                                backgroundColor: enemy.color,
                                                display: assetManifest.enemies[enemyKey] ? 'none' : 'flex'
                                            }}
                                        >
                                            {getEnemyIcon(enemy)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{enemy.name}</h3>
                                        <p className="text-xs text-slate-400 italic capitalize">{enemy.type}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                                    <div className="bg-slate-900 px-2 py-1 rounded">
                                        HP: <span className="text-white">{enemy.baseHealth}</span>
                                    </div>
                                    <div className="bg-slate-900 px-2 py-1 rounded">
                                        Speed: <span className="text-white">{enemy.baseSpeed.toFixed(1)}</span>
                                    </div>
                                    <div className="bg-slate-900 px-2 py-1 rounded flex items-center gap-1">
                                        <CoinIcon className="w-4 h-4" /> <span className="text-yellow-400">{enemy.bounty}</span>
                                    </div>
                                    <div className="bg-slate-900 px-2 py-1 rounded capitalize">
                                        Type: <span className="text-white">{enemy.type}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        towers.map(([key, tower]) => (
                            <div
                                key={key}
                                className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col gap-3 shadow-md hover:border-yellow-500/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                                        {assetManifest.towers[key] ? (
                                            <img
                                                src={`/assets/${assetManifest.towers[key]}`}
                                                alt={tower.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{
                                                backgroundColor: tower.color,
                                                display: assetManifest.towers[key] ? 'none' : 'flex'
                                            }}
                                        >
                                            {getTowerIcon(key, tower)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{tower.name}</h3>
                                        <p className="text-xs text-slate-400 italic">
                                            {tower.desc || 'Standard defensive tower.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                                    <div className="bg-slate-900 px-2 py-1 rounded">
                                        Dmg: <span className="text-white">{tower.damage}</span>
                                    </div>
                                    <div className="bg-slate-900 px-2 py-1 rounded">
                                        Rng: <span className="text-white">{tower.range}</span>
                                    </div>
                                    <div className="bg-slate-900 px-2 py-1 rounded">
                                        Cost: <span className="text-yellow-400">{tower.cost}</span>
                                    </div>
                                    <div className="bg-slate-900 px-2 py-1 rounded">
                                        CD: <span className="text-white">{tower.cooldown}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

CompendiumView.propTypes = {
    onBack: PropTypes.func.isRequired
};

function getEnemyIcon(enemy) {
    if (enemy.type === 'boss') return <span className="text-2xl">👑</span>;
    if (enemy.type === 'stealth') return <span className="text-2xl">🥷</span>;
    return null;
}

function getTowerIcon(key, tower) {
    if (tower.waterOnly) {
        return (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-blue-900">
                ⛵
            </div>
        );
    }
    if (tower.isTrap) {
        return (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-stone-700">
                ⚙️
            </div>
        );
    }
    return (
        <div
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: tower.color }}
        />
    );
}

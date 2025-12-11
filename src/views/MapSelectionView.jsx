/**
 * Map Selection View - Campaign Mode
 * Grouped worlds, mini-map previews, and star ratings
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MAPS } from '../data/maps';
import MapPreview from '../components/MapPreview';

// World Definitions
const WORLDS = [
    { id: 'greenlands', name: 'The Greenlands', icon: '🌿', maps: ['garden', 'rainforest', 'stump', 'treeparadise', 'covered_garden', 'snake_pit', 'beehive', 'enchanted'] },
    { id: 'elemental', name: 'Elemental', icon: '🌋', maps: ['volcano', 'lava_lake', 'watersprouts', 'island_hopping', 'glass_layer', 'frozen_tundra', 'cloud_kingdom', 'red_bridge', 'the_canyon', 'desert_oasis', 'pyramid'] },
    { id: 'civilization', name: 'Civilization', icon: '🏙️', maps: ['city', 'crossing_roads', 'industrial', 'checkered', 'circuit_board', 'space_station'] },
    { id: 'void', name: 'The Void', icon: '🔮', maps: ['the_void', 'crystal_cavern', 'cursed', 'graveyard', 'dark_castle', 'spiral', 'the_loop', 'the_maze', 'double_cross'] },
    { id: 'abstract', name: 'Abstract', icon: '🎨', maps: ['four_circles', 'staggered', 'zen_garden', 'rainbow_heights', 'candy_land'] }
];

export default function MapSelectionView({ onMapSelect, onBack }) {
    const [activeWorldId, setActiveWorldId] = useState('greenlands');

    // Get maps for active world
    const activeWorld = WORLDS.find(w => w.id === activeWorldId);
    const activeMaps = activeWorld ? activeWorld.maps.map(key => ({ key, ...MAPS[key] })).filter(m => m.name) : [];

    // Mock progress data (would normally load from user profile)
    const getMapProgress = (mapKey) => {
        // Randomly assign stars for demo feel, or default to 0
        // In real app: return userProgress[mapKey] || { stars: 0, locked: false };
        const hash = mapKey.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return {
            stars: hash % 4, // 0-3 stars
            locked: false // hash % 5 === 0 // 20% locked
        };
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-slate-900 overflow-hidden">
            {/* Background Blur */}
            <div className="absolute inset-0 bg-[url('/assets/pattern-bg.png')] opacity-10 pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto p-6 md:p-8 h-full flex flex-col relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h2 className="text-4xl font-black text-white flex items-center gap-3 drop-shadow-md tracking-tight">
                            <span className="text-emerald-400">CAMPAIGN</span> SELECT
                        </h2>
                        <p className="text-slate-400 font-medium ml-1">Choose your battlefield</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-slate-400 hover:text-white px-5 py-2 rounded-lg font-bold hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                    >
                        ✕ BACK
                    </button>
                </div>

                {/* World Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto p-4 scrollbar-hide shrink-0 -mx-4 px-4">
                    {WORLDS.map(world => (
                        <button
                            key={world.id}
                            onClick={() => setActiveWorldId(world.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap border-2 ${activeWorldId === world.id
                                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/50 scale-105'
                                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-500'
                                }`}
                        >
                            <span className="text-xl">{world.icon}</span>
                            {world.name}
                        </button>
                    ))}
                </div>

                {/* Map Grid */}
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
                    .gradient-mask {
                        mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
                        -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
                    }
                `}</style>
                <div className="overflow-y-auto flex-grow -mr-4 pr-4 custom-scrollbar gradient-mask p-4 pb-[120px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pt-2">
                        {activeMaps.map((map, index) => {
                            const progress = getMapProgress(map.key);
                            const isNew = index === 0 && activeWorldId === 'greenlands'; // Mock 'New' badge
                            const isBonus = index === 2 && activeWorldId === 'elemental'; // Mock 'Bonus' badge

                            return (
                                <button
                                    key={map.key}
                                    onClick={() => onMapSelect(map.key)}
                                    disabled={progress.locked}
                                    className={`group relative aspect-[4/5] rounded-2xl overflow-hidden border-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left ${progress.locked
                                        ? 'border-slate-700 opacity-60 grayscale'
                                        : 'border-slate-700 hover:border-emerald-400 ring-0 hover:ring-4 hover:ring-emerald-500/20'
                                        }`}
                                    style={{ backgroundColor: map.bgColor }}
                                >
                                    {/* Mini Map Preview (Centered) */}
                                    <div className="absolute inset-0 flex items-center justify-center p-6 opacity-80 group-hover:scale-110 transition-transform duration-500">
                                        <MapPreview
                                            paths={map.paths}
                                            width={200}
                                            height={200}
                                            color="rgba(255,255,255,0.9)"
                                            lineWidth={6}
                                        />
                                    </div>

                                    {/* Background Icon (Faded, Corner) */}
                                    <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 filter blur-[2px] pointer-events-none select-none">
                                        {getMapIcon(map.key)}
                                    </div>

                                    {/* Gradient Overlay for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                    {/* Content (Bottom) */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-12">
                                        <div className="flex justify-between items-end mb-1">
                                            <h3 className="font-black text-white text-lg leading-tight uppercase tracking-wider drop-shadow-md">
                                                {map.name}
                                            </h3>
                                            {/* Star Rating */}
                                            <div className="flex gap-0.5 mb-1">
                                                {[1, 2, 3].map(star => (
                                                    <span key={star} className={`text-xs ${star <= progress.stars ? 'text-yellow-400' : 'text-slate-600'}`}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium truncate">
                                            {getMapDescription(map)}
                                        </p>
                                    </div>

                                    {/* Badges */}
                                    {isNew && (
                                        <div className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                                            NEW
                                        </div>
                                    )}
                                    {isBonus && (
                                        <div className="absolute top-3 right-3 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transform rotate-3">
                                            +50% GOLD
                                        </div>
                                    )}
                                    {progress.locked && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                                            <span className="text-4xl">🔒</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

MapSelectionView.propTypes = {
    onMapSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

// Helper functions for map icons and descriptions
function getMapIcon(mapKey) {
    const icons = {
        garden: '🌿', rainforest: '🌴', red_bridge: '🌉', city: '🏙️',
        crossing_roads: '🚦', cursed: '⛩️', graveyard: '🌑', volcano: '🌋',
        the_loop: '➰', castle_doors: '🚪', watersprouts: '🌊', rainbow_heights: '🌈',
        stump: '🪵', enchanted: '🔮', treeparadise: '🌳', light_paradise: '✨',
        four_circles: '🍀', staggered: '⚡', dark_castle: '🏰', spiral: '🌀',
        covered_garden: '🛖', glass_layer: '🧊', desert_oasis: '🏜️',
        frozen_tundra: '❄️', lava_lake: '🔥', space_station: '🛰️',
        cloud_kingdom: '☁️', circuit_board: '📟', candy_land: '🍭',
        haunted_swamp: '👻', the_maze: '🧩', double_cross: '❌',
        island_hopping: '🏝️', the_canyon: '⛰️', zen_garden: '☯️',
        industrial: '🏭', crystal_cavern: '💎', beehive: '🐝',
        the_void: '⚫', snake_pit: '🐍', pyramid: '🔺', checkered: '🏁'
    };
    return icons[mapKey] || '📍';
}

function getMapDescription(map) {
    if (map.isCursed) return 'Portals • Boss Warp';
    if (map.isGraveyard) return 'Blood Moon • Fast Foes';
    if (map.isCovered) return 'Shifting Glass';
    if (map.isGlassFloor) return 'Fragile Floor';
    if (map.specialFeature?.type === 'stump') return '2x Range Spot';

    // Categorize by scenery type
    if (map.sceneryType === 'ocean') return 'Ships Only';
    if (map.sceneryType === 'castle') return 'Hard • Armored';
    if (map.sceneryType === 'volcano') return 'Lava Flows';
    if (map.sceneryType === 'magic') return 'Multi-Path';
    if (map.sceneryType === 'rainbow') return 'Colorful Path';

    // Default descriptions based on path complexity
    if (map.paths.length > 1) return 'Multi-Path Strategy';
    if (map.paths[0].length > 10) return 'Endurance Challenge';
    if (map.paths[0].length < 5) return 'Quick Rush';

    return 'Standard Campaign';
}

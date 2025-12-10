/**
 * Map Selection View - Grid of 46 maps
 * Pure UI component extracted from monolith (lines 137-280)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { MAPS } from '../data/maps';

export default function MapSelectionView({ onMapSelect, onBack }) {
    const mapEntries = Object.entries(MAPS);

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
            <div className="w-full max-w-7xl p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                        <span className="text-4xl">🗺️</span> SELECT MAP
                    </h2>
                    <button
                        onClick={onBack}
                        className="text-slate-400 hover:text-white text-xl pointer-events-auto font-bold px-4 py-2 rounded hover:bg-white/10 transition-colors"
                    >
                        ✕ BACK
                    </button>
                </div>

                <div className="overflow-y-auto flex-grow pr-2">
                    <div className="grid grid-cols-5 gap-6 pointer-events-auto pb-8">
                        {mapEntries.map(([key, map]) => (
                            <button
                                key={key}
                                onClick={() => onMapSelect(key)}
                                className="map-card flex flex-col items-center justify-center rounded-xl border-4 overflow-hidden aspect-square transition-all hover:scale-105 hover:border-yellow-500 shadow-lg"
                                style={{
                                    backgroundColor: map.bgColor,
                                    borderColor: map.bgColor.replace('0.', '0.8')
                                }}
                            >
                                <div className="map-icon text-5xl mb-2 transition-transform group-hover:scale-110">
                                    {getMapIcon(key)}
                                </div>
                                <div className="map-title font-bold text-white text-sm tracking-wide drop-shadow-lg z-10">
                                    {map.name.toUpperCase()}
                                </div>
                                <div className="map-desc text-xs mt-1 text-slate-200 z-10">
                                    {getMapDescription(map)}
                                </div>
                            </button>
                        ))}
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
    if (map.paths.length > 1) return 'Multi-Path';
    if (map.paths[0].length > 10) return 'Long Path';
    if (map.paths[0].length < 5) return 'Narrow Path';

    return 'Classic';
}

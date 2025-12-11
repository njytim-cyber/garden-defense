/**
 * Tower Panel View - Bottom panel for selecting/building towers
 * Pure UI component extracted from monolith (lines 95-113)
 */

import React from 'react';
import PropTypes from 'prop-types';
import assetManifest from '../../assets/asset-manifest.json';
import { CoinIcon } from '../components/Icons';

export default function TowerPanelView({
    towers,
    selectedTowerType,
    money,
    onTowerSelect
}) {
    const availableTowers = Object.entries(towers).filter(([_, tower]) => !tower.locked);

    return (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none">
            <div className="flex items-center justify-center gap-2 p-4">
                {/* Tower Selection - now centered */}
                <div className="flex gap-2 overflow-x-auto pointer-events-auto">
                    {availableTowers.map(([key, tower]) => {
                        const canAfford = money >= tower.cost;
                        const isSelected = selectedTowerType === key;
                        const tooltipText = `${tower.name}\nDMG: ${tower.damage} | RNG: ${tower.range} | CD: ${tower.cooldown}f${tower.effect ? '\nEffect: ' + tower.effect : ''}`;

                        return (
                            <div key={key} className="relative group">
                                <button
                                    onClick={() => onTowerSelect(key)}
                                    disabled={!canAfford}
                                    title={tooltipText}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg min-w-[80px] transition-all duration-200 ${isSelected
                                        ? 'bg-cyan-600 border-2 border-yellow-400 shadow-lg shadow-yellow-500/30 -translate-y-2 scale-105'
                                        : canAfford
                                            ? 'bg-slate-800 border-2 border-slate-600 hover:bg-slate-700 hover:border-cyan-500 hover:-translate-y-1'
                                            : 'bg-slate-900 border-2 border-slate-700 cursor-not-allowed'
                                        }`}
                                >
                                    {/* Tower Icon */}
                                    <div className={`w-16 h-16 flex items-center justify-center ${!canAfford ? 'grayscale' : ''}`}>
                                        {assetManifest.towers[key] ? (
                                            <img
                                                src={`/assets/${assetManifest.towers[key]}`}
                                                alt={tower.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="w-12 h-12 rounded-full"
                                                style={{ backgroundColor: tower.color }}
                                            />
                                        )}
                                        <div
                                            className="w-12 h-12 rounded-full"
                                            style={{ backgroundColor: tower.color, display: 'none' }}
                                        />
                                    </div>

                                    {/* Tower Name */}
                                    <span className={`text-xs font-bold ${canAfford ? 'text-white' : 'text-slate-400'}`}>
                                        {tower.name}
                                    </span>

                                    {/* Cost */}
                                    <span className={`text-xs font-bold drop-shadow-sm flex items-center gap-1 ${canAfford ? 'text-yellow-400' : 'text-red-500'}`}>
                                        <CoinIcon className="w-4 h-4" /> {tower.cost}
                                    </span>

                                    {/* Trap Quantity */}
                                    {tower.isTrap && tower.quantity > 0 && (
                                        <span className="text-xs text-green-400 font-bold">
                                            x{tower.quantity}
                                        </span>
                                    )}
                                </button>

                                {/* Styled Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900/95 border border-cyan-500/50 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                                    <div className="font-bold text-cyan-400">{tower.name}</div>
                                    <div className="text-slate-300 mt-1">
                                        DMG: {tower.damage} | RNG: {tower.range} | CD: {tower.cooldown}f
                                    </div>
                                    {tower.effect && (
                                        <div className="text-green-400 text-[10px] mt-0.5">✨ {tower.effect}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

TowerPanelView.propTypes = {
    towers: PropTypes.object.isRequired,
    selectedTowerType: PropTypes.string,
    money: PropTypes.number.isRequired,
    onTowerSelect: PropTypes.func.isRequired
};

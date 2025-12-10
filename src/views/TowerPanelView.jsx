/**
 * Tower Panel View - Bottom panel for selecting/building towers
 * Pure UI component extracted from monolith (lines 95-113)
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function TowerPanelView({
    towers,
    selectedTowerType,
    money,
    onTowerSelect,
    onMenuClick
}) {
    const availableTowers = Object.entries(towers).filter(([_, tower]) => !tower.locked);

    return (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none">
            <div className="flex items-center justify-between gap-2 p-4">
                {/* Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="pointer-events-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg border border-slate-600 transition-all"
                >
                    ☰ MENU
                </button>

                {/* Tower Selection */}
                <div className="flex gap-2 overflow-x-auto pointer-events-auto">
                    {availableTowers.map(([key, tower]) => {
                        const canAfford = money >= tower.cost;
                        const isSelected = selectedTowerType === key;

                        return (
                            <button
                                key={key}
                                onClick={() => onTowerSelect(key)}
                                disabled={!canAfford}
                                className={`flex flex-col items-center gap-1 p-3 rounded-lg min-w-[80px] transition-all ${isSelected
                                        ? 'bg-cyan-600 border-2 border-cyan-400 shadow-lg scale-105'
                                        : canAfford
                                            ? 'bg-slate-800 border-2 border-slate-600 hover:bg-slate-700 hover:border-cyan-500'
                                            : 'bg-slate-900 border-2 border-slate-700 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                {/* Tower Icon */}
                                <div
                                    className="w-10 h-10 rounded-full"
                                    style={{ backgroundColor: tower.color }}
                                />

                                {/* Tower Name */}
                                <span className={`text-xs font-bold ${canAfford ? 'text-white' : 'text-slate-500'}`}>
                                    {tower.name}
                                </span>

                                {/* Cost */}
                                <span className={`text-xs font-mono ${canAfford ? 'text-yellow-400' : 'text-slate-600'}`}>
                                    ${tower.cost}
                                </span>

                                {/* Trap Quantity */}
                                {tower.isTrap && tower.quantity > 0 && (
                                    <span className="text-xs text-green-400 font-bold">
                                        x{tower.quantity}
                                    </span>
                                )}
                            </button>
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
    onTowerSelect: PropTypes.func.isRequired,
    onMenuClick: PropTypes.func.isRequired
};

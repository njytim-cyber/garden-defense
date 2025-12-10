/**
 * Upgrade Panel View - Tower upgrade/sell UI
 * Pure UI component extracted from monolith (lines 2047-2104)
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function UpgradePanelView({
    tower,
    onUpgrade,
    onSell,
    onClose,
    canAffordUpgrade
}) {
    if (!tower) return null;

    const upgradeCost = tower.getUpgradeCost ? tower.getUpgradeCost() : 999999;
    const sellValue = tower.getSellValue ? tower.getSellValue() : 0;

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 pointer-events-auto">
            <div className="bg-slate-900 rounded-2xl p-6 border-2 border-cyan-500 shadow-2xl max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                    <h3 className="text-2xl font-bold text-white">{tower.config.name}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-2xl font-bold px-2"
                    >
                        ✕
                    </button>
                </div>

                {/* Tower Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-800 p-3 rounded-lg">
                        <div className="text-slate-400 text-xs">Level</div>
                        <div className="text-white text-xl font-bold">{tower.level}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg">
                        <div className="text-slate-400 text-xs">Damage</div>
                        <div className="text-white text-xl font-bold">{Math.floor(tower.damage)}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg">
                        <div className="text-slate-400 text-xs">Range</div>
                        <div className="text-white text-xl font-bold">{Math.floor(tower.range)}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg">
                        <div className="text-slate-400 text-xs">Cooldown</div>
                        <div className="text-white text-xl font-bold">{tower.config.cooldown}f</div>
                    </div>
                </div>

                {/* Paragon Badge */}
                {tower.isParagon && (
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-2 rounded-lg mb-4 text-center">
                        <span className="text-white font-bold text-lg">⭐ PARAGON ⭐</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onUpgrade}
                        disabled={!canAffordUpgrade || tower.isParagon}
                        className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all ${canAffordUpgrade && !tower.isParagon
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {tower.isParagon ? 'MAX LEVEL' : `⬆️ Upgrade $${upgradeCost}`}
                    </button>

                    <button
                        onClick={onSell}
                        className="flex-1 py-3 rounded-lg font-bold text-lg bg-red-600 hover:bg-red-500 text-white transition-all"
                    >
                        💰 Sell ${sellValue}
                    </button>
                </div>
            </div>
        </div>
    );
}

UpgradePanelView.propTypes = {
    tower: PropTypes.object,
    onUpgrade: PropTypes.func.isRequired,
    onSell: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    canAffordUpgrade: PropTypes.bool.isRequired
};

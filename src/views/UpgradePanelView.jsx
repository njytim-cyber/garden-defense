/**
 * Upgrade Panel View - Tower upgrade/sell UI
 * Floating panel positioned near selected tower
 */

import React from 'react';
import PropTypes from 'prop-types';
import { CoinIcon, UpgradeIcon } from '../components/Icons';

export default function UpgradePanelView({
    tower,
    onUpgrade,
    onSell,
    onClose,
    canAffordUpgrade,
    canvasWidth = 800,
    canvasHeight = 600
}) {
    if (!tower) return null;

    const upgradeCost = tower.getUpgradeCost ? tower.getUpgradeCost() : 999999;
    const sellValue = tower.getSellValue ? tower.getSellValue() : 0;

    // Calculate position near tower with edge detection
    const panelWidth = 280;
    const panelHeight = 200;

    // Determine horizontal position (prefer right side, flip to left if near edge)
    let left = tower.x + 50;
    if (tower.x > canvasWidth - panelWidth - 80) {
        left = tower.x - panelWidth - 50;
    }

    // Determine vertical position (centered on tower, constrain to canvas)
    let top = tower.y - panelHeight / 2;
    top = Math.max(10, Math.min(canvasHeight - panelHeight - 10, top));

    return (
        <>
            {/* Backdrop - click to close */}
            <div
                className="absolute inset-0 z-20 pointer-events-auto"
                onClick={onClose}
            />

            {/* Floating Panel */}
            <div
                className="absolute z-30 pointer-events-auto animate-in fade-in slide-in-from-left-2 duration-200"
                style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${panelWidth}px`
                }}
            >
                <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-cyan-500 shadow-2xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
                        <h3 className="text-lg font-bold text-white">{tower.config.name}</h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white text-lg font-bold px-1 hover:bg-white/10 rounded"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Tower Info - Compact */}
                    <div className="grid grid-cols-4 gap-2 mb-3 text-center">
                        <div className="bg-slate-800 p-2 rounded">
                            <div className="text-slate-400 text-[10px]">LVL</div>
                            <div className="text-white text-sm font-bold">{tower.level}</div>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                            <div className="text-slate-400 text-[10px]">DMG</div>
                            <div className="text-white text-sm font-bold">{Math.floor(tower.damage)}</div>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                            <div className="text-slate-400 text-[10px]">RNG</div>
                            <div className="text-white text-sm font-bold">{Math.floor(tower.range)}</div>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                            <div className="text-slate-400 text-[10px]">CD</div>
                            <div className="text-white text-sm font-bold">{tower.config.cooldown}f</div>
                        </div>
                    </div>

                    {/* Paragon Badge */}
                    {tower.isParagon && (
                        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-1.5 rounded mb-3 text-center">
                            <span className="text-white font-bold text-sm">⭐ PARAGON ⭐</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={onUpgrade}
                            disabled={!canAffordUpgrade || tower.isParagon}
                            className={`flex-1 py-2 rounded font-bold text-sm transition-all ${canAffordUpgrade && !tower.isParagon
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {tower.isParagon ? 'MAX' : <><UpgradeIcon className="w-4 h-4 inline" /> <CoinIcon className="w-4 h-4 inline" />{upgradeCost}</>}
                        </button>

                        <button
                            onClick={onSell}
                            className="flex-1 py-2 rounded font-bold text-sm bg-red-600 hover:bg-red-500 text-white transition-all"
                        >
                            <CoinIcon className="w-4 h-4 inline" /> {sellValue}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

UpgradePanelView.propTypes = {
    tower: PropTypes.object,
    onUpgrade: PropTypes.func.isRequired,
    onSell: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    canAffordUpgrade: PropTypes.bool.isRequired,
    canvasWidth: PropTypes.number,
    canvasHeight: PropTypes.number
};


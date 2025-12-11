/**
 * Shop View - Item purchases and unlocks
 * Pure UI component extracted from monolith (lines 323-334, 963-1000)
 */

import React from 'react';
import PropTypes from 'prop-types';
import assetManifest from '../../assets/asset-manifest.json';
import { CartIcon, CoinIcon } from '../components/Icons';

export default function ShopView({ items, metaMoney, onBuyItem, onBack }) {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
            <div className="w-full max-w-5xl p-8">
                <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                    <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                        <CartIcon className="w-10 h-10" color="#94a3b8" /> ITEM SHOP
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="text-yellow-400 text-2xl font-mono font-bold bg-slate-800 px-4 py-2 rounded-lg border border-yellow-500/30 flex items-center gap-2">
                            <CoinIcon className="w-6 h-6" /> <span>{metaMoney}</span>
                        </div>
                        <button
                            onClick={onBack}
                            className="text-slate-400 hover:text-white text-xl pointer-events-auto font-bold px-4 py-2 rounded hover:bg-white/10 transition-colors"
                        >
                            ✕ CLOSE
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 pointer-events-auto overflow-y-auto max-h-[70vh] pr-2">
                    {items.map((item) => {
                        const canAfford = metaMoney >= item.shopPrice;
                        const isSpike = item.key === 'spike';
                        const isOwned = !item.locked && !isSpike;

                        return (
                            <div
                                key={item.key}
                                className={`bg-slate-800 rounded-xl p-4 border ${item.locked && !isSpike ? 'border-slate-600' : 'border-yellow-500'
                                    } flex flex-col gap-2 relative overflow-hidden h-64 shadow-lg transform transition-all hover:scale-[1.02]`}
                            >
                                {/* Icon */}
                                <div className="h-16 flex items-center justify-center bg-slate-900/50 rounded-lg mb-1">
                                    {getItemIcon(item)}
                                </div>

                                {/* Info */}
                                <div className="text-center flex-grow flex flex-col">
                                    <h3 className="text-lg font-bold text-white leading-tight">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 leading-snug h-8 overflow-hidden flex items-center justify-center">
                                        {item.desc || 'A powerful tower.'}
                                    </p>
                                </div>

                                {/* Button */}
                                <div className="mt-auto w-full">
                                    {isSpike ? (
                                        <>
                                            <button
                                                onClick={() => canAfford && onBuyItem(item.key)}
                                                className={`w-full h-10 rounded font-bold ${canAfford
                                                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                    } transition-colors flex items-center justify-center`}
                                                disabled={!canAfford}
                                            >
                                                Buy (+1) {item.shopPrice} G
                                            </button>
                                            <div className="text-center text-[10px] mt-1 h-4">
                                                <span className="text-yellow-300">Owned: {item.quantity}</span>
                                            </div>
                                        </>
                                    ) : item.locked ? (
                                        <button
                                            onClick={() => canAfford && onBuyItem(item.key)}
                                            className={`w-full h-10 rounded font-bold ${canAfford
                                                ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                } transition-colors flex items-center justify-center`}
                                            disabled={!canAfford}
                                        >
                                            Unlock {item.shopPrice} G
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full h-10 rounded font-bold bg-green-900/50 text-green-400 border border-green-700 cursor-default flex items-center justify-center"
                                        >
                                            ✓ OWNED
                                        </button>
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

ShopView.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        desc: PropTypes.string,
        shopPrice: PropTypes.number.isRequired,
        locked: PropTypes.bool.isRequired,
        quantity: PropTypes.number,
        color: PropTypes.string,
        waterOnly: PropTypes.bool,
        isTrap: PropTypes.bool
    })).isRequired,
    metaMoney: PropTypes.number.isRequired,
    onBuyItem: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

function getItemIcon(item) {
    // Try to use generated asset
    const assetPath = assetManifest.towers[item.key];

    if (assetPath) {
        return (
            <div className="w-14 h-14 flex items-center justify-center">
                <img
                    src={`/assets/${assetPath}`}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                    }}
                />
                <div
                    className="w-12 h-12 rounded-full shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: item.color, display: 'none' }}
                />
            </div>
        );
    }

    // Fallback to colored circles
    return (
        <div
            className="w-12 h-12 rounded-full shadow-inner"
            style={{ backgroundColor: item.color }}
        />
    );
}

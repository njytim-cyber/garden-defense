/**
 * Main Menu View - Start Screen
 * Pure UI component extracted from monolith (lines 84-114)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { CartIcon, ShirtIcon, BookIcon } from '../components/Icons';

export default function MainMenuView({ onPlayClick, onShopClick, onSkinsClick, onGuideClick }) {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/90 to-green-900/90 backdrop-blur-md transition-opacity duration-500">
            <div className="text-center mb-8 animate-float">
                <h1
                    className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2 drop-shadow-lg tracking-tight"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.5))' }}
                >
                    GARDEN DEFENSE
                </h1>
                <p className="text-2xl text-green-200 font-light tracking-[0.3em] opacity-90 border-t border-green-500/30 pt-2 mt-2 inline-block">
                    PROTECT THE SACRED SHRINE
                </p>
            </div>

            <div className="flex flex-col gap-4 items-center w-full max-w-md pointer-events-auto">
                <button
                    onClick={onPlayClick}
                    className="menu-btn w-full py-6 rounded-2xl flex items-center justify-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 border-green-400 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-900/50 group"
                >
                    <span className="text-4xl group-hover:scale-110 transition-transform">⚔️</span>
                    <span className="text-3xl font-bold text-white tracking-wide">PLAY GAME</span>
                </button>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={onShopClick}
                        className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-yellow-500/50 transition-all group"
                    >
                        <CartIcon className="w-6 h-6 group-hover:scale-110 transition-transform" color="#94a3b8" />
                        <span className="text-lg font-bold text-slate-200 group-hover:text-yellow-400">SHOP</span>
                    </button>

                    <button
                        onClick={onSkinsClick}
                        className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-pink-500/50 transition-all group"
                    >
                        <ShirtIcon className="w-6 h-6 group-hover:scale-110 transition-transform" color="#94a3b8" />
                        <span className="text-lg font-bold text-slate-200 group-hover:text-pink-400">SKINS</span>
                    </button>

                    <button
                        onClick={onGuideClick}
                        className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-cyan-500/50 transition-all group"
                    >
                        <BookIcon className="w-6 h-6 group-hover:scale-110 transition-transform" color="#94a3b8" />
                        <span className="text-lg font-bold text-slate-200 group-hover:text-cyan-400">GUIDE</span>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 text-slate-500 text-sm font-mono">
                v2.7 - Mega Map Pack
            </div>
        </div>
    );
}

MainMenuView.propTypes = {
    onPlayClick: PropTypes.func.isRequired,
    onShopClick: PropTypes.func.isRequired,
    onSkinsClick: PropTypes.func.isRequired,
    onGuideClick: PropTypes.func.isRequired
};

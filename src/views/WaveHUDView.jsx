/**
 * Wave HUD View - Top game HUD showing lives, money, wave
 * Pure UI component extracted from monolith (lines 84-93)
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { HeartIcon, CoinIcon } from '../components/Icons';

export default function WaveHUDView({
    lives,
    money,
    waveNumber,
    totalWaves = 15,
    isWaveActive,
    isPaused,
    gameSpeed = 1,
    onStartWave,
    onPauseToggle,
    onSpeedToggle,
    onMenuClick
}) {
    const [displayMoney, setDisplayMoney] = useState(money);
    const [isFlashing, setIsFlashing] = useState(false);
    const prevMoneyRef = useRef(money);

    // Lerp animation for gold counter
    useEffect(() => {
        if (money === displayMoney) return;

        // Flash effect when money increases
        if (money > prevMoneyRef.current) {
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 200);
        }
        prevMoneyRef.current = money;

        // Animate number change over 300ms
        const startValue = displayMoney;
        const endValue = money;
        const duration = 300;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startValue + (endValue - startValue) * eased);

            setDisplayMoney(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [money]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="absolute top-0 left-0 right-0 z-10 w-full pointer-events-none">
            {/* Main HUD Container - Aligned with Map */}
            <div className="max-w-[1000px] mx-auto flex justify-between items-center p-4">
                {/* LEFT: All status info consolidated (Lives + Gold + Wave) */}
                <div className="flex items-center gap-3">
                    {/* Lives */}
                    <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-red-500/30 shadow-md">
                        <HeartIcon className="w-5 h-5" />
                        <span className="text-lg font-bold text-white">{lives}</span>
                    </div>

                    {/* Money - with lerp animation and flash effect */}
                    <div className={`flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-yellow-500/30 shadow-md transition-all duration-100 ${isFlashing ? 'scale-110 brightness-150' : ''}`}>
                        <CoinIcon className="w-5 h-5" />
                        <span className={`text-lg font-bold transition-colors ${isFlashing ? 'text-white' : 'text-yellow-400'}`}>
                            {displayMoney}
                        </span>
                    </div>

                    {/* Wave Counter - now with status on left */}
                    <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-500/30 shadow-md">
                        <span className="text-base font-bold text-white">
                            Wave <span className="text-cyan-400">{waveNumber}</span>
                            <span className="text-slate-400">/{totalWaves}</span>
                        </span>
                    </div>
                </div>

                {/* CENTER: Start Wave button (only when wave not active) */}
                {!isWaveActive && (
                    <div className="absolute left-1/2 bottom-[-60px] transform -translate-x-1/2 pointer-events-auto">
                        <button
                            onClick={onStartWave}
                            className="px-8 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/50 animate-pulse-wave transition-all border border-green-400/30"
                        >
                            ▶️ START WAVE {waveNumber}
                        </button>
                    </div>
                )}

                {/* RIGHT: Controls (Speed + Pause + Menu) */}
                <div className="flex items-center gap-2">
                    {/* Speed Toggle (only when wave is active) */}
                    {isWaveActive && (
                        <button
                            onClick={onSpeedToggle}
                            className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-500/30 hover:border-cyan-500/50 hover:bg-slate-800 transition-all shadow-md"
                            title={gameSpeed === 1 ? 'Speed up (2x)' : 'Normal speed (1x)'}
                        >
                            <span className={`text-base font-bold ${gameSpeed === 2 ? 'text-cyan-400' : 'text-white'}`}>
                                {gameSpeed === 2 ? '⏩' : '▶️'}
                            </span>
                            <span className={`text-xs font-medium ${gameSpeed === 2 ? 'text-cyan-400' : 'text-slate-400'}`}>
                                {gameSpeed}x
                            </span>
                        </button>
                    )}

                    {/* Pause Button (only when wave active) */}
                    {isWaveActive && (
                        <button
                            onClick={onPauseToggle}
                            className={`pointer-events-auto w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-md ${isPaused
                                ? 'bg-yellow-600/90 border border-yellow-400/50 text-white animate-pulse'
                                : 'bg-slate-900/90 border border-slate-500/30 text-slate-300 hover:text-white hover:border-slate-400/80 hover:bg-slate-800'
                                }`}
                            title={isPaused ? 'Resume' : 'Pause'}
                        >
                            {isPaused ? '▶' : '⏸'}
                        </button>
                    )}

                    {/* Menu Button - moved here from bottom panel */}
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="pointer-events-auto w-9 h-9 rounded-lg flex items-center justify-center bg-slate-900/90 border border-slate-500/30 text-slate-300 hover:text-white hover:border-slate-400/80 hover:bg-slate-800 transition-all shadow-md"
                            title="Menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

WaveHUDView.propTypes = {
    lives: PropTypes.number.isRequired,
    money: PropTypes.number.isRequired,
    waveNumber: PropTypes.number.isRequired,
    totalWaves: PropTypes.number,
    isWaveActive: PropTypes.bool.isRequired,
    isPaused: PropTypes.bool,
    gameSpeed: PropTypes.number,
    onStartWave: PropTypes.func.isRequired,
    onPauseToggle: PropTypes.func,
    onSpeedToggle: PropTypes.func,
    onMenuClick: PropTypes.func
};

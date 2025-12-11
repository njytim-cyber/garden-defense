/**
 * Difficulty Selection View
 * Contextual UI with Map Preview and Gamified Rewards
 */

import React from 'react';
import PropTypes from 'prop-types';
import { CoinIcon } from '../components/Icons';
import MapPreview from '../components/MapPreview';

export default function DifficultySelectionView({ onDifficultySelect, onBack, mapData }) {
    // Fallback if mapData is missing (preview mode/debug)
    const mapName = mapData?.name || "Unknown Region";
    const mapColor = mapData?.bgColor || "#1e293b";

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Dynamic Blurred Background */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 blur-[20px] scale-110 brightness-[0.5]"
                style={{ backgroundColor: mapColor }}
            />
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('/assets/pattern-bg.png')]" />

            <div className="relative z-10 w-full max-w-6xl mx-auto p-8 flex flex-col items-center">

                {/* Contextual Header */}
                <div className="text-center mb-8 animate-fade-in-down">
                    <h3 className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-2">
                        CHALLENGE LEVEL
                    </h3>
                    <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-2xl">
                        {mapName.toUpperCase()}
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center justify-center w-full">

                    {/* LEFT: Tactical Map Preview */}
                    <div className="shrink-0 bg-slate-900/50 p-6 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col items-center gap-4 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                        <div className="text-slate-400 text-xs font-bold tracking-widest uppercase">TACTICAL OVERVIEW</div>
                        <div className="relative w-64 h-64 bg-black/40 rounded-xl overflow-hidden border border-white/5 shadow-inner">
                            {mapData && (
                                <MapPreview
                                    paths={mapData.paths}
                                    width={256}
                                    height={256}
                                    color={mapColor}
                                    lineWidth={8}
                                    className="opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                />
                            )}
                            {/* Start/End Markers could be added here overlaying absolute positions */}
                        </div>
                    </div>

                    {/* RIGHT: Difficulty Cards */}
                    <div className="flex gap-6">
                        {/* EASY */}
                        <button
                            onClick={() => onDifficultySelect('easy')}
                            className="group relative flex flex-col items-center gap-3 bg-slate-900/60 border-2 border-green-500/30 hover:border-green-400 hover:bg-green-900/40 p-6 rounded-xl w-56 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(34,197,94,0.2)]"
                        >
                            <div className="bg-green-500/20 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <span className="text-4xl text-green-400 h-10 w-10 flex items-center justify-center">🌱</span>
                            </div>
                            <h3 className="text-2xl font-black text-white group-hover:text-green-300">EASY</h3>
                            <div className="text-center space-y-2 w-full">
                                <div className="bg-black/30 px-3 py-1.5 rounded-lg text-green-100 font-mono text-sm">
                                    <CoinIcon className="w-3 h-3 inline mr-1" /> 150 Start
                                </div>
                                <div className="text-xs text-slate-400 font-medium">0.5x XP Multiplier</div>
                            </div>
                        </button>

                        {/* MEDIUM */}
                        <button
                            onClick={() => onDifficultySelect('medium')}
                            className="group relative flex flex-col items-center gap-3 bg-slate-900/60 border-2 border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/40 p-6 rounded-xl w-56 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] scale-105"
                        >
                            <div className="absolute -top-3 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-lg">
                                STANDARD
                            </div>
                            <div className="bg-blue-500/20 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <span className="text-4xl text-blue-400 h-10 w-10 flex items-center justify-center">⚔️</span>
                            </div>
                            <h3 className="text-2xl font-black text-white group-hover:text-blue-300">MEDIUM</h3>
                            <div className="text-center space-y-2 w-full">
                                <div className="bg-black/30 px-3 py-1.5 rounded-lg text-blue-100 font-mono text-sm">
                                    <CoinIcon className="w-3 h-3 inline mr-1" /> 100 Start
                                </div>
                                <div className="text-xs text-blue-200 font-bold">1.0x XP Multiplier</div>
                            </div>
                        </button>

                        {/* HARD */}
                        <button
                            onClick={() => onDifficultySelect('hard')}
                            className="group relative flex flex-col items-center gap-3 bg-slate-900/60 border-2 border-red-500/30 hover:border-red-400 hover:bg-red-900/40 p-6 rounded-xl w-56 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                        >
                            <div className="absolute -top-3 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-bold rounded-full shadow-lg flex gap-1">
                                <span>💎</span> BONUS REWARDS
                            </div>
                            <div className="bg-red-500/20 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <span className="text-4xl text-red-400 h-10 w-10 flex items-center justify-center">☠️</span>
                            </div>
                            <h3 className="text-2xl font-black text-white group-hover:text-red-300">HARD</h3>
                            <div className="text-center space-y-2 w-full">
                                <div className="bg-black/30 px-3 py-1.5 rounded-lg text-red-100 font-mono text-sm">
                                    <CoinIcon className="w-3 h-3 inline mr-1" /> 100 Start
                                </div>
                                <div className="text-xs text-orange-300 font-bold animate-pulse">2.0x XP + 💎 Bonus</div>
                            </div>
                            <div className="text-[10px] text-red-400 font-medium uppercase tracking-wider mt-1">
                                +10% Enemy Speed
                            </div>
                        </button>
                    </div>
                </div>

                <button
                    onClick={onBack}
                    className="mt-16 text-slate-400 hover:text-white text-lg font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors pointer-events-auto border border-white/5 hover:border-white/20"
                >
                    ✕ CANCEL MISSION
                </button>
            </div>
        </div>
    );
}

DifficultySelectionView.propTypes = {
    onDifficultySelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    mapData: PropTypes.object
};

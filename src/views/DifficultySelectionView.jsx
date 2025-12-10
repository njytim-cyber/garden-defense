/**
 * Difficulty Selection View
 * Pure UI component extracted from monolith (lines 283-320)
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function DifficultySelectionView({ onDifficultySelect, onBack }) {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
            <div className="text-center mb-10">
                <h2 className="text-5xl font-black text-white mb-2 drop-shadow-lg">
                    SELECT DIFFICULTY
                </h2>
                <p className="text-xl text-slate-400">
                    Choose your challenge level
                </p>
            </div>

            <div className="flex gap-8 pointer-events-auto">
                {/* EASY */}
                <button
                    onClick={() => onDifficultySelect('easy')}
                    className="group flex flex-col items-center gap-4 bg-green-900/40 border-2 border-green-500 hover:bg-green-900/80 p-8 rounded-2xl w-64 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                    <div className="text-6xl group-hover:scale-110 transition-transform">🌱</div>
                    <h3 className="text-3xl font-bold text-green-400">EASY</h3>
                    <div className="bg-slate-900/60 px-4 py-2 rounded-lg text-green-200 font-mono text-lg">
                        Start: $150
                    </div>
                </button>

                {/* MEDIUM */}
                <button
                    onClick={() => onDifficultySelect('medium')}
                    className="group flex flex-col items-center gap-4 bg-blue-900/40 border-2 border-blue-500 hover:bg-blue-900/80 p-8 rounded-2xl w-64 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                    <div className="text-6xl group-hover:scale-110 transition-transform">⚔️</div>
                    <h3 className="text-3xl font-bold text-blue-400">MEDIUM</h3>
                    <div className="bg-slate-900/60 px-4 py-2 rounded-lg text-blue-200 font-mono text-lg">
                        Start: $100
                    </div>
                </button>

                {/* HARD */}
                <button
                    onClick={() => onDifficultySelect('hard')}
                    className="group flex flex-col items-center gap-4 bg-red-900/40 border-2 border-red-500 hover:bg-red-900/80 p-8 rounded-2xl w-64 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                    <div className="text-6xl group-hover:scale-110 transition-transform">☠️</div>
                    <h3 className="text-3xl font-bold text-red-400">HARD</h3>
                    <div className="bg-slate-900/60 px-4 py-2 rounded-lg text-red-200 font-mono text-lg w-full text-center">
                        Start: $100<br />
                        <span className="text-red-400 font-bold text-sm">+10% Enemy Speed</span>
                    </div>
                </button>
            </div>

            <button
                onClick={onBack}
                className="mt-12 text-slate-400 hover:text-white text-xl font-bold px-6 py-3 rounded hover:bg-white/10 transition-colors pointer-events-auto"
            >
                ✕ BACK TO MAPS
            </button>
        </div>
    );
}

DifficultySelectionView.propTypes = {
    onDifficultySelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

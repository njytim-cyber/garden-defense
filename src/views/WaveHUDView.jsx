/**
 * Wave HUD View - Top game HUD showing lives, money, wave
 * Pure UI component extracted from monolith (lines 84-93)
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function WaveHUDView({
    lives,
    money,
    waveNumber,
    isWaveActive,
    onWaveControlClick
}) {
    return (
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-slate-900/90 to-transparent pointer-events-none">
            {/* Lives */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-lg border border-red-500/30">
                <span className="text-2xl">❤️</span>
                <span className="text-xl font-bold text-white">{lives}</span>
            </div>

            {/* Money */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-lg border border-yellow-500/30">
                <span className="text-2xl">💰</span>
                <span className="text-xl font-bold text-yellow-400">{money}</span>
            </div>

            {/* Wave Control */}
            <button
                onClick={onWaveControlClick}
                className={`pointer-events-auto px-6 py-3 rounded-lg font-bold text-lg transition-all ${isWaveActive
                        ? 'bg-orange-600 hover:bg-orange-500 text-white'
                        : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/50'
                    }`}
            >
                {isWaveActive ? '⏸️ PAUSE' : `▶️ START WAVE ${waveNumber}`}
            </button>
        </div>
    );
}

WaveHUDView.propTypes = {
    lives: PropTypes.number.isRequired,
    money: PropTypes.number.isRequired,
    waveNumber: PropTypes.number.isRequired,
    isWaveActive: PropTypes.bool.isRequired,
    onWaveControlClick: PropTypes.func.isRequired
};

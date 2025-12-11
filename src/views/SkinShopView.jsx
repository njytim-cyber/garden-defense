/**
 * Skin Shop View - Placeholder for future customization
 * UI matching original monolith design
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function SkinShopView({ onBack }) {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
            <div className="w-full max-w-3xl p-8 text-center">
                <h2 className="text-5xl font-bold text-pink-400 mb-4">SKIN SHOP</h2>
                <p className="text-xl text-slate-300 mb-8">Customize your towers and enemies! (Coming Soon)</p>

                <div className="grid grid-cols-3 gap-4 mb-8 opacity-50 pointer-events-none">
                    <div className="bg-slate-800 h-40 rounded-xl border border-slate-600 flex items-center justify-center text-4xl">
                        🤖
                    </div>
                    <div className="bg-slate-800 h-40 rounded-xl border border-slate-600 flex items-center justify-center text-4xl">
                        🐉
                    </div>
                    <div className="bg-slate-800 h-40 rounded-xl border border-slate-600 flex items-center justify-center text-4xl">
                        🎃
                    </div>
                </div>

                <button
                    onClick={onBack}
                    className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-full pointer-events-auto transition-colors"
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
}

SkinShopView.propTypes = {
    onBack: PropTypes.func.isRequired
};

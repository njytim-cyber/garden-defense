/**
 * Paragon Merge View - Multi-tower selection UI
 * Shows when in paragon mode, displays selected towers and merge button
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function ParagonMergeView({
    selectedTowers,
    onMerge,
    onCancel
}) {
    const canMerge = selectedTowers.length === 3;

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-4 border-2 border-yellow-400 shadow-2xl min-w-[400px]">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-bold text-xl">⭐ Paragon Merge Mode</h3>
                    <button
                        onClick={onCancel}
                        className="text-white hover:text-gray-200 text-2xl font-bold px-2"
                    >
                        ✕
                    </button>
                </div>

                {/* Instructions */}
                <p className="text-white text-sm mb-3">
                    Select 3 towers of the same type (level 10+) to merge into a Paragon tower.
                </p>

                {/* Selection Progress */}
                <div className="flex gap-2 mb-3">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className={`flex-1 h-12 rounded-lg flex items-center justify-center font-bold ${selectedTowers[i]
                                    ? 'bg-white text-orange-600'
                                    : 'bg-orange-800 text-orange-400'
                                }`}
                        >
                            {selectedTowers[i] ? (
                                <span>
                                    {selectedTowers[i].config.name} L{selectedTowers[i].level}
                                </span>
                            ) : (
                                <span>Slot {i + 1}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Merge Button */}
                <button
                    onClick={onMerge}
                    disabled={!canMerge}
                    className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${canMerge
                            ? 'bg-white text-orange-600 hover:bg-gray-100'
                            : 'bg-orange-800 text-orange-400 cursor-not-allowed'
                        }`}
                >
                    {canMerge ? '✨ Merge to Paragon' : 'Select 3 Towers'}
                </button>

                {/* Stats Preview */}
                {canMerge && (
                    <div className="mt-3 p-2 bg-white/20 rounded-lg text-white text-sm">
                        <p className="font-bold mb-1">Paragon Stats:</p>
                        <p>• Damage: {Math.floor(selectedTowers[0].damage * 5)}</p>
                        <p>• Range: {Math.floor(selectedTowers[0].range * 1.5)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

ParagonMergeView.propTypes = {
    selectedTowers: PropTypes.array.isRequired,
    onMerge: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

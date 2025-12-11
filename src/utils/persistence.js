/**
 * Persistence Utilities - LocalStorage save/load
 * Extracted from monolith (lines 785-824)
 */

import { SAVE_KEY } from '../constants/GameConstants';

/**
 * Save game state to localStorage
 * @param {number} metaMoney - Persistent gold currency
 * @param {Object} towers - Tower unlock/quantity state
 */
export function saveGame(metaMoney, towers, xp = 0) {
    const data = {
        metaMoney: metaMoney,
        towers: {},
        xp: xp
    };

    for (const [key, val] of Object.entries(towers)) {
        // Only save purchasable/unlockable items state to keep file size small
        if (val.shopPrice) {
            data.towers[key] = {
                locked: val.locked,
                quantity: val.quantity || 0
            };
        }
    }

    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

/**
 * Load game state from localStorage
 * @param {Object} towers - Tower config object to update
 * @returns {Object} { metaMoney, xp }
 */
export function loadGame(towers) {
    const saved = localStorage.getItem(SAVE_KEY);
    let metaMoney = 1000; // Default starting gold
    let xp = 0;

    if (saved) {
        try {
            const data = JSON.parse(saved);

            if (data.metaMoney !== undefined) {
                metaMoney = data.metaMoney;
            }
            if (data.xp !== undefined) {
                xp = data.xp;
            }

            if (data.towers) {
                for (const [key, val] of Object.entries(data.towers)) {
                    if (towers[key]) {
                        towers[key].locked = val.locked;
                        if (val.quantity !== undefined) {
                            towers[key].quantity = val.quantity;
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Save file corrupted:', e);
        }
    }

    return { metaMoney, xp };
}

/**
 * Clear all saved data
 */
export function clearSave() {
    localStorage.removeItem(SAVE_KEY);
}

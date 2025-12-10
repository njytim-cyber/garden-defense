/**
 * Unit Tests for gameLogic.js
 * Tests placement validation, damage calculation, and wave generation
 */

import { describe, it, expect } from 'vitest';
import { calculateDamage, generateWaveComposition } from '../utils/gameLogic';
import BALANCE_DATA from '../data/balance.json';

describe('gameLogic - calculateDamage', () => {
    it('should return damage value for basic projectile', () => {
        const projectile = { damage: 50, effect: null };
        const enemy = { isArmored: false };

        const result = calculateDamage(projectile, enemy);

        expect(result).toHaveProperty('damage');
        expect(result.damage).toBe(50);
    });

    it('should reduce damage for armored enemies without fire effect', () => {
        const projectile = { damage: 50, effect: null };
        const enemy = { isArmored: true };

        const result = calculateDamage(projectile, enemy);

        expect(result).toHaveProperty('damage');
        expect(result.damage).toBeLessThan(50);
    });

    it('should deal full damage to armored enemies with burn effect', () => {
        const projectile = { damage: 50, effect: 'burn' };
        const enemy = { isArmored: true };

        const result = calculateDamage(projectile, enemy);

        expect(result.damage).toBe(50);
    });

    it('should handle explosive effect bypassing armor', () => {
        const projectile = { damage: 50, effect: 'explosive' };
        const enemy = { isArmored: true };

        const result = calculateDamage(projectile, enemy);

        expect(result.damage).toBe(50);
    });
});

describe('gameLogic - generateWaveComposition', () => {
    it('should generate enemies for wave 1', () => {
        const composition = generateWaveComposition(1, BALANCE_DATA);

        expect(composition).toBeInstanceOf(Array);
        expect(composition.length).toBeGreaterThan(0);
    });

    it('should return array of enemy type strings', () => {
        const composition = generateWaveComposition(5, BALANCE_DATA);

        const allStrings = composition.every(type => typeof type === 'string');
        expect(allStrings).toBe(true);
    });

    it('should include only valid enemy types from balance data', () => {
        const composition = generateWaveComposition(5, BALANCE_DATA);
        const validTypes = Object.keys(BALANCE_DATA.enemies);

        const allValid = composition.every(type => validTypes.includes(type));
        expect(allValid).toBe(true);
    });

    it('should handle boss waves (multiples of 10)', () => {
        const wave10 = generateWaveComposition(10, BALANCE_DATA);
        const wave20 = generateWaveComposition(20, BALANCE_DATA);

        expect(wave10.length).toBeGreaterThan(0);
        expect(wave20.length).toBeGreaterThan(0);
    });

    it('should generate valid compositions for high waves', () => {
        const wave50 = generateWaveComposition(50, BALANCE_DATA);
        const wave100 = generateWaveComposition(100, BALANCE_DATA);

        expect(wave50.length).toBeGreaterThan(0);
        expect(wave100.length).toBeGreaterThan(0);
    });
});

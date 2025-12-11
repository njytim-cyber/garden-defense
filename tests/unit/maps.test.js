
import { describe, it, expect } from 'vitest';
import { MAPS } from '../../src/data/maps';

describe('Maps Data Integrity', () => {
    it('should export MAPS object', () => {
        expect(MAPS).toBeDefined();
        expect(typeof MAPS).toBe('object');
    });

    it('should contain "garden" map', () => {
        expect(MAPS.garden).toBeDefined();
        expect(MAPS.garden.name).toBe('Garden');
    });

    it('should have correct structure for all maps', () => {
        Object.entries(MAPS).forEach(([key, map]) => {
            expect(map.name).toBeDefined();
            expect(map.bgColor).toBeDefined();
            expect(map.paths).toBeInstanceOf(Array);
        });
    });
});

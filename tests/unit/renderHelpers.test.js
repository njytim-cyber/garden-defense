import { describe, it, expect } from 'vitest';
import * as renderHelpers from '../../src/utils/renderHelpers';

describe('Render Helpers', () => {
    it('should export all drawing functions', () => {
        expect(renderHelpers.drawPath).toBeDefined();
        expect(renderHelpers.drawTower).toBeDefined();
        expect(renderHelpers.drawEnemy).toBeDefined();
        expect(renderHelpers.drawScenery).toBeDefined();
    });
});

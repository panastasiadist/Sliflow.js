import { describe, expect, it } from '@jest/globals';
import modulo from '../../lib/Utilities/modulo';

describe('modulo', () => {
    it.each([
        [10, 3, 1], // Expected: 10 % 3 = 1
        [20, 5, 0], // Expected: 20 % 5 = 0
        [15, 4, 3], // Expected: 15 % 4 = 3
        [-10, 3, 2], // Expected: -10 % 3 = 2
        [-20, 5, 0], // Expected: -20 % 5 = 0
        [-15, 4, 1], // Expected: -15 % 4 = 1
        [10, 1, 0], // Expected: 10 % 1 = 0
        [-10, 1, 0], // Expected: -10 % 1 = 0
    ])(
        'When dividing %i by %i should return a modulo of %i',
        (dividend: number, divisor: number, modResult: number) => {
            // Execute & Verify
            expect(modulo(dividend, divisor)).toBe(modResult);
        },
    );

    it.each([
        [10, 0], // Expected: 10 % 0 = NaN
        [-10, 0], // Expected: -10 % 0 = NaN
        [0, 0], // Expected: 0 % 0  = NaN
    ])('When dividing %i by %i should return NaN', (dividend: number, divisor: number) => {
        // Execute & Verify
        expect(modulo(dividend, divisor)).toBeNaN();
    });
});

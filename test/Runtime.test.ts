import { describe, expect, it, beforeEach } from '@jest/globals';
import Runtime from '../lib/Runtime';

describe('Runtime', () => {
    let element: HTMLElement;

    beforeEach(() => {
        // Setup
        element = document.createElement('span');
    });

    it('should return the correct slider element', () => {
        // Execute
        const runtime = new Runtime(element, false, true);
        const sliderElement = runtime.getSliderElement();

        // Verify
        expect(sliderElement).toBe(element);
    });

    it.each([
        [true, true],
        [true, false],
        [false, false],
        [false, true],
    ])('should return the correct RTL status when changed from %s to %s', (oldIsRTL: boolean, newIsRTL: boolean) => {
        // Execute
        const runtime = new Runtime(element, oldIsRTL, true);

        // Verify
        expect(runtime.getIsRTL()).toEqual(oldIsRTL);

        // Execute
        runtime.setIsRTL(newIsRTL);

        // Verify
        expect(runtime.getIsRTL()).toEqual(newIsRTL);
    });

    it.each([[true], [false]])(
        'should return the correct horizontal value when horizontal has been set to %s',
        (isHorizontal: boolean) => {
            // Execute
            const runtime = new Runtime(element, false, isHorizontal);

            // Verify
            expect(runtime.getIsHorizontal()).toEqual(isHorizontal);
        },
    );

    it.each([
        [1, true, true],
        [-1, true, false],
        [-1, false, true],
        [-1, false, false],
    ])(
        'should return direction coefficient = %s when horizontal = %s and RTL = %s',
        (expectedRTLCoefficient: number, isHorizontal: boolean, isRTL: boolean) => {
            // Execute
            const runtime = new Runtime(element, isRTL, isHorizontal);

            // Verify
            expect(runtime.getDirectionCoefficient()).toEqual(expectedRTLCoefficient);
        },
    );
});

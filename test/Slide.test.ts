import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import Slide from '../lib/Slide';

describe('Slide', () => {
    let slide: Slide;
    let element: HTMLElement;

    beforeEach(() => {
        // Reset
        jest.resetAllMocks();

        // Setup
        element = document.createElement('div');
        slide = new Slide(element);
    });

    it('getElement returns the HTML element of the slide', () => {
        expect(slide.getElement()).toBe(element);
    });

    describe('change slide current position', () => {
        it.each([
            [-1, 'non current'],
            [0, 'current'],
            [1, 'non current'],
        ])('set current position to %s and make the slide %s', (position: number, currentStatus: string) => {
            // Execute
            slide.setIsActive();
            slide.setCurrentPosition(position);

            // Verify
            expect(slide.getIsCurrent()).toBe(currentStatus === 'current');
        });
    });

    it.each([
        ['width' as keyof CSSStyleDeclaration, 300, '300px'],
        ['height' as keyof CSSStyleDeclaration, 300, '300px'],
    ])(
        'setLength changes the %s of the HTML element',
        (dimension: keyof CSSStyleDeclaration, length: number, expectedLength: string) => {
            const isWidth = dimension === 'width';

            // Execute
            slide.setLength(length, isWidth);

            // Verify
            expect(element.style[dimension]).toBe(expectedLength);
        },
    );

    it.each([
        ['X', 300, 'translateX(300px)'],
        ['Y', 300, 'translateY(300px)'],
    ])(
        'setOffset changes the %s offset of the HTML element',
        (orientation: string, offset: number, expectedTransform: string) => {
            // Execute
            slide.setOffset(offset, orientation === 'X');

            // Verify
            expect(element.style.transform).toBe(expectedTransform);
        },
    );

    it.each([
        ['Slide element is visible (default)', '', true],
        ['Slide element is visible (block)', 'block', true],
        ['Slide element is visible (inline)', 'inline', true],
        ['Slide element is hidden', 'none', false],
    ])(
        'setIsActive sets the slide as active depending on the visibility of its HTML element - %s',
        (_description: string, display: string, expectedIsActive: boolean) => {
            // Execute
            element.style.display = display;
            slide.setIsActive();

            // Verify
            expect(slide.getIsActive()).toBe(expectedIsActive);
        },
    );
});

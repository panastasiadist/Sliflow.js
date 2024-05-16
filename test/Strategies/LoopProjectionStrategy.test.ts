import { it, jest, expect } from '@jest/globals';
import ProjectionStrategyTest, { Scenario } from '../__mocks__/ProjectionStrategyTest';
import LoopProjectionStrategy from '../../lib/Strategies/LoopProjectionStrategy';
import ProjectionStrategyInterface from '../../lib/Interfaces/ProjectionStrategyInterface';
import Slide from '../../lib/Slide';
import setupRuntimeMock from '../__mocks__/setupRuntimeMock';

class LoopProjectionStrategyTest extends ProjectionStrategyTest {
    constructor() {
        super();

        it('should reset (set to 0) the offset of inactive slides', () => {
            const { projector } = this.mockBundle;

            const slideLength = 100;

            const slides = new Array(2).fill({
                setOffset: jest.fn(),
                getIsActive: () => false,
            });

            const offsetInterval = (slides.length - 1) * slideLength;

            // Setup
            setupRuntimeMock(
                this.mockBundle.runtime,
                undefined,
                () => false,
                () => true,
            );

            (projector.getSlideLength as jest.MockedFunction<() => number>).mockReturnValue(slideLength);

            (projector.getOffsetInterval as jest.MockedFunction<() => number>).mockReturnValue(offsetInterval);

            (projector.getSlides as jest.MockedFunction<(activeOnly?: boolean) => Slide[]>).mockImplementation(
                (activeOnly = true) => (activeOnly ? [] : slides),
            );

            this.getProjectionStrategy().project(0);

            slides.forEach((slide) => {
                expect(slide.setOffset).toHaveBeenCalledWith(0, true);
                // expect(slide.setOffset).toHaveBeenCalledTimes(1);
            });
        });
    }

    protected getProjectionStrategy(): ProjectionStrategyInterface {
        return new LoopProjectionStrategy(this.mockBundle.projector);
    }

    // eslint-disable-next-line class-methods-use-this
    protected getScenarios(): Scenario[] {
        // Cases:
        // - shouldProject = whether the case should lead to a projection
        // - slideWidth = the width of the slider / every slide
        // - slideCount = the number of slides to use while testing\
        // - isRTL = whether the slider should operate in right-to-left mode
        // - requestedOffset = the offset to be requested for projection
        // - expectedOffset = the actual offset expected to be used for projection
        // - array of tuples [index, expected offset] of slides whose projection should be checked
        return [
            {
                description: 'when projecting with no slides',
                cases: [
                    [false, 100, 0, false, 0, 0, []], // In-bound projection: 1st (100%)
                ],
            },
            {
                description: 'when projecting with no slides (RTL)',
                cases: [
                    [false, 100, 0, true, 0, 0, []], // In-bound projection: 1st (100%)
                ],
            },
            {
                description: 'when projecting with slides of zero length',
                cases: [
                    [false, 0, 3, false, 0, 0, []], // In-bound projection: 1st (100%)
                ],
            },
            {
                description: 'when projecting with slides of zero length (RTL)',
                cases: [
                    [false, 0, 3, true, 0, 0, []], // In-bound projection: 1st (100%)
                ],
            },
            {
                description: 'when projecting in-bound offsets',
                cases: [
                    [true, 100, 3, false, -200, -200, []], // In-bound projection: 3rd (100%)
                    [true, 100, 3, false, -150, -150, []], // In-bound projection: 2nd (50%), 3rd (50%)
                    [true, 100, 3, false, -100, -100, []], // In-bound projection: 2nd (100%)
                    [true, 100, 3, false, -50, -50, []], // In-bound projection: 1st (50%), 2nd (50%)
                    [true, 100, 3, false, 0, 0, []], // In-bound projection: 1st (100%)
                ],
            },
            {
                description: 'when projecting in-bound offsets (RTL)',
                cases: [
                    [true, 100, 3, true, 200, 200, []], // In-bound projection: 3rd (100%)
                    [true, 100, 3, true, 150, 150, []], // In-bound projection: 2nd (50%), 3rd (50%)
                    [true, 100, 3, true, 100, 100, []], // In-bound projection: 2nd (100%)
                    [true, 100, 3, true, 50, 50, []], // In-bound projection: 1st (50%), 2nd (50%)
                    [true, 100, 3, true, 0, 0, []], // In-bound projection: 1st (100%)
                ],
            },
            {
                description:
                    // eslint-disable-next-line max-len
                    'when projecting out-of-bound offsets (< 0) that should lead to slide looping starting from the last one, continuing backward',
                cases: [
                    [true, 100, 3, false, -800, -800, [[2, 600]]], // 2nd loop cycle projection: 3rd (100%)
                    [true, 100, 3, false, -750, -750, [[2, 600]]], // 2nd loop cycle projection: 2nd (50%), 3rd (50%)
                    [true, 100, 3, false, -700, -700, [[1, 600]]], // 2nd loop cycle projection: 2nd (100%)
                    [true, 100, 3, false, -650, -650, [[1, 600]]], // 2nd loop cycle projection: 1st (50%), 2nd (50%)
                    [true, 100, 3, false, -600, -600, [[0, 600]]], // 2nd loop cycle projection: 1st (100%)
                    [true, 100, 3, false, -550, -550, [[0, 600]]], // 2nd loop cycle projection: 3rd (50%), 1st (50%)
                    [true, 100, 3, false, -500, -500, [[2, 300]]], // 1st loop cycle projection: 3rd (100%)
                    [true, 100, 3, false, -450, -450, [[2, 300]]], // 1st loop cycle projection: 2nd (50%), 3rd (50%)
                    [true, 100, 3, false, -400, -400, [[1, 300]]], // 1st loop cycle projection: 2nd (100%)
                    [true, 100, 3, false, -350, -350, [[1, 300]]], // 1st loop cycle projection: 1st (50%), 2nd (50%)
                    [true, 100, 3, false, -300, -300, [[0, 300]]], // 1st loop cycle projection: 1st (100%)
                    [true, 100, 3, false, -250, -250, [[0, 300]]], // 1st loop cycle projection: 3rd (50%), 1st (50%)
                ],
            },
            {
                description:
                    // eslint-disable-next-line max-len
                    'when projecting out-of-bound offsets (> max in-bound offset) that should lead to slide looping starting from the last one, continuing backward (RTL)',
                cases: [
                    [true, 100, 3, true, 800, 800, [[2, -600]]], // 2nd loop cycle projection: 3rd (100%)
                    [true, 100, 3, true, 750, 750, [[2, -600]]], // 2nd loop cycle projection: 2nd (50%), 3rd (50%)
                    [true, 100, 3, true, 700, 700, [[1, -600]]], // 2nd loop cycle projection: 2nd (100%)
                    [true, 100, 3, true, 650, 650, [[1, -600]]], // 2nd loop cycle projection: 1st (50%), 2nd (50%)
                    [true, 100, 3, true, 600, 600, [[0, -600]]], // 2nd loop cycle projection: 1st (100%)
                    [true, 100, 3, true, 550, 550, [[0, -600]]], // 2nd loop cycle projection: 3rd (50%), 1st (50%)
                    [true, 100, 3, true, 500, 500, [[2, -300]]], // 1st loop cycle projection: 3rd (100%)
                    [true, 100, 3, true, 450, 450, [[2, -300]]], // 1st loop cycle projection: 2nd (50%), 3rd (50%)
                    [true, 100, 3, true, 400, 400, [[1, -300]]], // 1st loop cycle projection: 2nd (100%)
                    [true, 100, 3, true, 350, 350, [[1, -300]]], // 1st loop cycle projection: 1st (50%), 2nd (50%)
                    [true, 100, 3, true, 300, 300, [[0, -300]]], // 1st loop cycle projection: 1st (100%)
                    [true, 100, 3, true, 250, 250, [[0, -300]]], // 1st loop cycle projection: 3rd (50%), 1st (50%)
                ],
            },
            {
                description:
                    // eslint-disable-next-line max-len
                    'when projecting out-of-bound offsets (> max in-bound offset) that should lead to slide looping starting from the first one, continuing forward',
                cases: [
                    [true, 100, 3, false, 50, 50, [[2, -300]]], // 1st loop cycle projection: 1st (50%), 3rd (50%)
                    [true, 100, 3, false, 100, 100, [[2, -300]]], // 1st loop cycle projection: 3rd (100%)
                    [true, 100, 3, false, 150, 150, [[1, -300]]], // 1st loop cycle projection: 3rd (50%), 2nd (50%)
                    [true, 100, 3, false, 200, 200, [[1, -300]]], // 1st loop cycle projection: 2nd (100%)
                    [true, 100, 3, false, 250, 250, [[0, -300]]], // 1st loop cycle projection: 2nd (50%), 1st (50%)
                    [true, 100, 3, false, 300, 300, [[0, -300]]], // 1st loop cycle projection: 1st (100%)
                    [true, 100, 3, false, 350, 350, [[2, -600]]], // 2nd loop cycle projection: 1st (50%), 3rd (50%)
                    [true, 100, 3, false, 400, 400, [[2, -600]]], // 2nd loop cycle projection: 3rd (100%)
                    [true, 100, 3, false, 450, 450, [[1, -600]]], // 2nd loop cycle projection: 3rd (50%), 2nd (50%)
                    [true, 100, 3, false, 500, 500, [[1, -600]]], // 2nd loop cycle projection: 2nd (100%)
                    [true, 100, 3, false, 550, 550, [[0, -600]]], // 2nd loop cycle projection: 2nd (50%), 1st (50%)
                    [true, 100, 3, false, 600, 600, [[0, -600]]], // 2nd loop cycle projection: 1st (100%)
                ],
            },
            {
                description:
                    // eslint-disable-next-line max-len
                    'when projecting out-of-bound offsets (< 0>) that should lead to slide looping starting from the first one, continuing forward (RTL)',
                cases: [
                    [true, 100, 3, true, -50, -50, [[2, 300]]], // 1st loop cycle projection: 1st (50%), 3rd (50%)
                    [true, 100, 3, true, -100, -100, [[2, 300]]], // 1st loop cycle projection: 3rd (100%)
                    [true, 100, 3, true, -150, -150, [[1, 300]]], // 1st loop cycle projection: 3rd (50%), 2nd (50%)
                    [true, 100, 3, true, -200, -200, [[1, 300]]], // 1st loop cycle projection: 2nd (100%)
                    [true, 100, 3, true, -250, -250, [[0, 300]]], // 1st loop cycle projection: 2nd (50%), 1st (50%)
                    [true, 100, 3, true, -300, -300, [[0, 300]]], // 1st loop cycle projection: 1st (100%)
                    [true, 100, 3, true, -350, -350, [[2, 600]]], // 2nd loop cycle projection: 1st (50%), 3rd (50%)
                    [true, 100, 3, true, -400, -400, [[2, 600]]], // 2nd loop cycle projection: 3rd (100%)
                    [true, 100, 3, true, -450, -450, [[1, 600]]], // 2nd loop cycle projection: 3rd (50%), 2nd (50%)
                    [true, 100, 3, true, -500, -500, [[1, 600]]], // 2nd loop cycle projection: 2nd (100%)
                    [true, 100, 3, true, -550, -550, [[0, 600]]], // 2nd loop cycle projection: 2nd (50%), 1st (50%)
                    [true, 100, 3, true, -600, -600, [[0, 600]]], // 2nd loop cycle projection: 1st (100%)
                ],
            },
        ];
    }
}

// eslint-disable-next-line no-new
new LoopProjectionStrategyTest();

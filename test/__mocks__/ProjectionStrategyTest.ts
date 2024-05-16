import { it, jest, expect, describe, afterEach, beforeAll } from '@jest/globals';

import { createPluginMockBundle, PluginMockBundle } from './createPluginMockBundle';

import ProjectionStrategyInterface from '../../lib/Interfaces/ProjectionStrategyInterface';
import Slide from '../../lib/Slide';
import setupRuntimeMock from './setupRuntimeMock';

// slideIndex, slideOffset
type CaseSlide = [number, number];

// shouldProject, slideWidth, slideCount, isRTL, requestedOffset, expectedOffset
type Case = [boolean, number, number, boolean, number, number, CaseSlide[]];

export type Scenario = {
    cases: Case[];
    description: string;
};

export default abstract class ProjectionStrategyTest {
    protected mockBundle: PluginMockBundle;

    constructor() {
        beforeAll(() => {
            this.mockBundle = createPluginMockBundle();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe(this.constructor.name, () => {
            this.getScenarios().forEach((scenario) => {
                describe(scenario.description, () => {
                    scenario.cases.forEach((item) => this.testProjectionStrategy(...item));
                });
            });
        });
    }

    protected testProjectionStrategy(
        shouldProject: boolean,
        slideWidth: number,
        slideCount: number,
        isRTL: boolean,
        requestedOffset: number,
        expectedOffset: number,
        slides: CaseSlide[],
    ) {
        it(`should ${shouldProject ? '' : 'not '}project offset ${requestedOffset} to ${expectedOffset} offset`, () => {
            const bundle = this.mockBundle;

            // Setup
            setupRuntimeMock(bundle.runtime, undefined, () => isRTL, undefined);

            (bundle.projector.getSlideLength as jest.MockedFunction<() => number>).mockReturnValue(slideWidth);

            (bundle.projector.getOffsetInterval as jest.MockedFunction<() => number>).mockReturnValue(
                (slideCount - 1) * slideWidth,
            );

            (bundle.projector.getSlides as jest.MockedFunction<(activeOnly?: boolean) => Slide[]>).mockReturnValue(
                new Array(slideCount).fill({
                    setOffset: jest.fn(),
                    getIsActive: () => true,
                }),
            );

            // Execute
            this.getProjectionStrategy().project(requestedOffset);

            // Verify
            if (shouldProject) {
                expect(bundle.projector.setOffset).toHaveBeenCalledWith(expectedOffset);
            } else {
                expect(bundle.projector.setOffset).not.toHaveBeenCalled();
            }

            slides.forEach((slide) => {
                const [slideIndex, slideOffset] = slide;
                expect(this.mockBundle.projector.getSlides()[slideIndex].setOffset).toHaveBeenCalledWith(
                    slideOffset,
                    true,
                );
            });
        });
    }

    protected abstract getProjectionStrategy(): ProjectionStrategyInterface;

    protected abstract getScenarios(): Scenario[];
}

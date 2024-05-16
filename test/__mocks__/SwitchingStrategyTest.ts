import { it, jest, expect, describe, afterEach, beforeAll } from '@jest/globals';
import { createPluginMockBundle, PluginMockBundle } from './createPluginMockBundle';
import Slide from '../../lib/Slide';
import SwitchingStrategyInterface from '../../lib/Interfaces/SwitchingStrategyInterface';
import setupRuntimeMock from './setupRuntimeMock';

// targetIndex, expectedOffset, expectedSlideIndex, slideCount, slideWidth, isRTL
type Case = [number, number, number, number, number, boolean];

export type Scenario = {
    cases: Case[];
    description: string;
};

export default abstract class SwitchingStrategyTest {
    protected mockBundle: PluginMockBundle;

    constructor() {
        beforeAll(() => {
            this.mockBundle = createPluginMockBundle();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe(this.constructor.name, () => {
            this.getScenarios().forEach((scenario: Scenario) => {
                describe(scenario.description, () => {
                    scenario.cases.forEach((item: Case) => this.testSwitchingStrategy(...item));
                });
            });
        });
    }

    private testSwitchingStrategy(
        targetIndex: number,
        expectedOffset: number,
        expectedSlideIndex: number,
        slideCount: number,
        slideWidth: number,
        isRTL: boolean,
    ) {
        it(`should project to ${expectedOffset} and set active slide to ${expectedSlideIndex}`, () => {
            // Setup
            const bundle = this.mockBundle;

            setupRuntimeMock(
                bundle.runtime,
                undefined,
                () => isRTL,
                () => true,
            );

            (bundle.projector.getSlides as jest.MockedFunction<(activeOnly?: boolean) => Slide[]>).mockImplementation(
                () => new Array(slideCount).fill(null),
            );

            (bundle.projector.getSlideLength as jest.MockedFunction<() => number>).mockImplementation(() => slideWidth);

            // Execute
            this.getSwitchingStrategy().switch(targetIndex);

            // Verify
            expect(bundle.projector.getSlideLength).toHaveBeenCalled();
            expect(bundle.projector.project).toHaveBeenCalledWith(expectedOffset, false);
            expect(bundle.projector.setCurrentSlide).toHaveBeenCalledWith(expectedSlideIndex);
            expect(bundle.projector.setCurrentSlideIndex).toHaveBeenCalledWith(expectedSlideIndex);
        });
    }

    protected abstract getScenarios(): Scenario[];

    protected abstract getSwitchingStrategy(): SwitchingStrategyInterface;
}

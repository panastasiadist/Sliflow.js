import SwitchingStrategyTest, { Scenario } from '../__mocks__/SwitchingStrategyTest';
import SwitchingStrategyInterface from '../../lib/Interfaces/SwitchingStrategyInterface';
import SimpleSwitchingStrategy from '../../lib/Strategies/SimpleSwitchingStrategy';

class SimpleSwitchingStrategyTest extends SwitchingStrategyTest {
    // eslint-disable-next-line class-methods-use-this
    protected getScenarios(): Scenario[] {
        // Cases:
        // - targetIndex = the slide index to request during testing
        // - expectedOffset = the offset that should be projected because of the requested target slide index
        // - expectedSlideIndex = the index of the resulted slide because of the requested target slide index
        // - slideCount = the number of slides to use while testing
        // - slideWidth = the width of the slider / every slide
        // - isRTL = whether the slider should operate in right-to-left mode
        return [
            {
                description: 'when using in-bound indices that should lead to the associated slide',
                cases: [
                    [0, -0, 0, 3, 100, false],
                    [1, -100, 1, 3, 100, false],
                    [2, -200, 2, 3, 100, false],
                ],
            },
            {
                description: 'when using in-bound indices that should lead to the associated slide (RTL)',
                cases: [
                    [0, 0, 0, 3, 100, true],
                    [1, 100, 1, 3, 100, true],
                    [2, 200, 2, 3, 100, true],
                ],
            },
            {
                description: 'when using out-of-bound (< 0) that should lead to the first slide',
                cases: [
                    [-100, -0, 0, 3, 100, false],
                    [-10, -0, 0, 3, 100, false],
                    [-1, -0, 0, 3, 100, false],
                ],
            },
            {
                description: 'when using out-of-bound (< 0) that should lead to the first slide (RTL)',
                cases: [
                    [-100, 0, 0, 3, 100, true],
                    [-10, 0, 0, 3, 100, true],
                    [-1, 0, 0, 3, 100, true],
                ],
            },
            {
                description:
                    'when using out-of-bound indices (> max in-bound index) that should lead to the last slide',
                cases: [
                    [3, -200, 2, 3, 100, false],
                    [10, -200, 2, 3, 100, false],
                    [100, -200, 2, 3, 100, false],
                ],
            },
            {
                description:
                    'when using out-of-bound indices (> max in-bound index) that should lead to the last slide (RTL)',
                cases: [
                    [3, 200, 2, 3, 100, true],
                    [10, 200, 2, 3, 100, true],
                    [100, 200, 2, 3, 100, true],
                ],
            },
        ];
    }

    protected getSwitchingStrategy(): SwitchingStrategyInterface {
        return new SimpleSwitchingStrategy(this.mockBundle.projector);
    }
}

// eslint-disable-next-line no-new
new SimpleSwitchingStrategyTest();

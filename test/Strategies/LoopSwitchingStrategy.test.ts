import SwitchingStrategyTest, { Scenario } from '../__mocks__/SwitchingStrategyTest';
import SwitchingStrategyInterface from '../../lib/Interfaces/SwitchingStrategyInterface';
import LoopSwitchingStrategy from '../../lib/Strategies/LoopSwitchingStrategy';

class LoopSwitchingStrategyTest extends SwitchingStrategyTest {
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
                description:
                    'when using out-of-bound indices (< 0) that should lead to loop slides starting from the last one',
                cases: [
                    [-1, 100, -1, 3, 100, false],
                    [-2, 200, -2, 3, 100, false],
                    [-3, 300, -3, 3, 100, false],
                    [-4, 400, -4, 3, 100, false],
                    [-5, 500, -5, 3, 100, false],
                    [-6, 600, -6, 3, 100, false],
                ],
            },
            {
                description:
                    // eslint-disable-next-line max-len
                    'when using out-of-bound indices (< 0) that should lead to loop slides starting from the last one (RTL)',
                cases: [
                    [-1, -100, -1, 3, 100, true],
                    [-2, -200, -2, 3, 100, true],
                    [-3, -300, -3, 3, 100, true],
                    [-4, -400, -4, 3, 100, true],
                    [-5, -500, -5, 3, 100, true],
                    [-6, -600, -6, 3, 100, true],
                ],
            },
            {
                description:
                    // eslint-disable-next-line max-len
                    'when using out-of-bound indices (> max in-bound index) that should lead to loop slides starting from the first one',
                cases: [
                    [3, -300, 3, 3, 100, false],
                    [4, -400, 4, 3, 100, false],
                    [5, -500, 5, 3, 100, false],
                    [6, -600, 6, 3, 100, false],
                    [7, -700, 7, 3, 100, false],
                    [8, -800, 8, 3, 100, false],
                ],
            },
            {
                description:
                    // eslint-disable-next-line max-len
                    'when using out-of-bound indices (> max in-bound index) that should lead to loop slides starting from the first one (RTL)',
                cases: [
                    [3, 300, 3, 3, 100, true],
                    [4, 400, 4, 3, 100, true],
                    [5, 500, 5, 3, 100, true],
                    [6, 600, 6, 3, 100, true],
                    [7, 700, 7, 3, 100, true],
                    [8, 800, 8, 3, 100, true],
                ],
            },
        ];
    }

    protected getSwitchingStrategy(): SwitchingStrategyInterface {
        return new LoopSwitchingStrategy(this.mockBundle.projector);
    }
}

// eslint-disable-next-line no-new
new LoopSwitchingStrategyTest();

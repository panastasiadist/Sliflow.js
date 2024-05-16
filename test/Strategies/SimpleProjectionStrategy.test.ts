import ProjectionStrategyTest, { Scenario } from '../__mocks__/ProjectionStrategyTest';
import SimpleProjectionStrategy from '../../lib/Strategies/SimpleProjectionStrategy';
import ProjectionStrategyInterface from '../../lib/Interfaces/ProjectionStrategyInterface';

class SimpleProjectionStrategyTest extends ProjectionStrategyTest {
    protected getProjectionStrategy(): ProjectionStrategyInterface {
        return new SimpleProjectionStrategy(this.mockBundle.projector);
    }

    // eslint-disable-next-line class-methods-use-this
    protected getScenarios(): Scenario[] {
        // Cases:
        // - shouldProject = whether the case should lead to a projection
        // - slideWidth = the width of the slider / every slide
        // - slideCount = the number of slides to use while testing
        // - isRTL = whether the slider should operate in right-to-left mode
        // - requestedOffset = the offset to be requested for projection
        // - expectedOffset = the actual offset expected to be used for projection
        // - array of tuples [index, expected offset] of slides whose projection should be checked
        return [
            {
                // In-bound when isRTL = false:
                // Min Offset: (slideCount-1) * slideWidth * -1
                // Max Offset: 0
                description: 'when projecting in-bound offsets',
                cases: [
                    [true, 100, 2, false, -100, -100, []], // 2nd (100%)
                    [true, 100, 2, false, -50, -50, []], // 1st (50%), 2nd (50%)
                    [true, 100, 2, false, 0, 0, []], // 1st (100%)
                ],
            },
            {
                // In-bound when isRTL = true:
                // Min Offset: 0
                // Max Offset: (slideCount-1) * slideWidth * -1
                description: 'when projecting in-bound offsets (RTL)',
                cases: [
                    [true, 100, 2, true, 100, 100, []], // 2nd (100%)
                    [true, 100, 2, true, 50, 50, []], // 1st (50%), 2nd (50%)
                    [true, 100, 2, true, 0, 0, []], // 1st (100%)
                ],
            },
            {
                // Out-of-bound when isRTL = false: every offset not within the in-bound offset interval
                description: 'when projecting out-of-bound offsets',
                cases: [
                    [false, 100, 2, false, -200, -200, []],
                    [false, 100, 2, false, 200, 200, []],
                ],
            },
            {
                // Out-of-bound when isRTL = true: every offset not within the in-bound offset interval
                description: 'when projecting out-of-bound offsets (RTL)',
                cases: [
                    [false, 100, 2, true, -200, -200, []],
                    [false, 100, 2, true, 200, 200, []],
                ],
            },
        ];
    }
}

// eslint-disable-next-line no-new
new SimpleProjectionStrategyTest();

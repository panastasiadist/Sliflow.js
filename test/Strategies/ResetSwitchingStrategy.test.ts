import SwitchingStrategyTest, { Scenario } from '../__mocks__/SwitchingStrategyTest';
import SwitchingStrategyInterface from '../../lib/Interfaces/SwitchingStrategyInterface';
import ResetSwitchingStrategy from '../../lib/Strategies/ResetSwitchingStrategy';

class ResetSwitchingStrategyTest extends SwitchingStrategyTest {
    // eslint-disable-next-line class-methods-use-this
    protected getScenarios(): Scenario[] {
        return [
            {
                description: 'when using in-bound indices',
                cases: [
                    [0, -0, 0, 3, 100, false],
                    [1, -100, 1, 3, 100, false],
                    [2, -200, 2, 3, 100, false],
                ],
            },
            {
                description: 'when using out-of-bound indices (< 0)',
                cases: [
                    [-1, -200, 2, 3, 100, false],
                    [-2, -100, 1, 3, 100, false],
                    [-3, -0, 0, 3, 100, false],
                ],
            },
            {
                description: 'when using out-of-bound indices (> max in-bound index)',
                cases: [
                    [3, -0, 0, 3, 100, false],
                    [4, -100, 1, 3, 100, false],
                    [5, -200, 2, 3, 100, false],
                ],
            },
        ];
    }

    protected getSwitchingStrategy(): SwitchingStrategyInterface {
        return new ResetSwitchingStrategy(this.mockBundle.projector);
    }
}

// eslint-disable-next-line no-new
new ResetSwitchingStrategyTest();

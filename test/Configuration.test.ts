import { describe, expect, it, jest } from '@jest/globals';
import Configuration from '../lib/Configuration';
import ConfigurationLoadingStrategyInterface from '../lib/Interfaces/ConfigurationLoadingStrategyInterface';

describe('Configuration', () => {
    const generateStrategy = (config: Record<string, string>): ConfigurationLoadingStrategyInterface => ({
        getConfiguration: jest.fn(() => config),
    });

    type Test = [string, Array<Record<string, string>>, Record<string, string>, Record<string, string>];

    const tests: Test[] = [
        ['uses value from configuration when key exists', [{ test: 'value' }], { test: 'value' }, {}],
        ['uses a default value when key does not exist', [{}], { test: 'default' }, { test: 'default' }],
        [
            'uses values from multiple strategies',
            [{ test: 'value' }, { test2: 'value2' }],
            {
                test: 'value',
                test2: 'value2',
            },
            { test2: 'value2default' },
        ],
        [
            'uses later strategies to overwrite previous values',
            [{ test: 'value' }, { test2: 'value2' }, { test: 'valueNew' }],
            {
                test: 'valueNew',
                test2: 'value2',
            },
            { test2: 'value2default' },
        ],
    ];

    it.each(tests)(
        '%s',
        (
            _description: string,
            configs: Record<string, string>[],
            expectedValues: Record<string, string>,
            defaultValues: Record<string, string>,
        ) => {
            const strategies = configs.map((config) => generateStrategy(config));
            const configuration = new Configuration(strategies);

            Object.keys(expectedValues).forEach((key) => {
                expect(configuration.getValue(key, defaultValues[key])).toBe(expectedValues[key]);
            });
        },
    );
});

import { describe, expect, it } from '@jest/globals';
import ObjectConfigurationLoadingStrategy from '../../lib/Strategies/ObjectConfigurationLoadingStrategy';

describe('ObjectConfigurationLoadingStrategy', () => {
    describe('getConfiguration', () => {
        const tests = [
            {
                description: 'should return the same object that was passed to constructor',
                data: {
                    width: '1000',
                    height: '500',
                    imageHeight: '2000',
                },
            },
            {
                description: 'should return an empty object if an empty object was passed to constructor',
                data: {},
            },
        ];

        tests.forEach((test) => {
            it(test.description, () => {
                // Setup
                const strategy = new ObjectConfigurationLoadingStrategy(test.data);

                // Execute and Verify
                expect(strategy.getConfiguration()).toBe(test.data);
            });
        });
    });
});

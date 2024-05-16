import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import isPassiveEventListenerSupported from '../../lib/Utilities/isPassiveEventListenerSupported';

describe('isPassiveEventListenerSupported', () => {
    let supportPassive = false;

    beforeAll(() => {
        Object.defineProperty(window, 'addEventListener', {
            writable: true,
            value: jest.fn().mockImplementation((...args) => {
                if (supportPassive) {
                    return (args[2] as AddEventListenerOptions).passive;
                }

                throw Error('Not supported');
            }),
        });
    });

    it.each([
        [true, 'supported'],
        [false, 'not supported'],
    ])(`should return %s when passive event listeners are %s`, (supported: boolean) => {
        supportPassive = supported;
        expect(isPassiveEventListenerSupported()).toBe(supported);
    });
});

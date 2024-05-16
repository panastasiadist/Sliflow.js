import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import handleSuppressibleCallback from '../../lib/Utilities/handleSuppressibleCallback';

describe('handleSuppressibleCallback', () => {
    let callback: jest.Mock;

    beforeEach(() => {
        // Setup
        callback = jest.fn();
    });

    it('should call the callback all times when a suppression count has not been provided', () => {
        // Execute
        const suppressibleCallback = handleSuppressibleCallback(callback);
        suppressibleCallback();

        // Verify
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it.each([
        [4, 0, 4],
        [2, 1, 3],
        [0, 3, 3],
        [0, 4, 3],
    ])(
        'should call the callback %d times when suppression count is %d and the callback is invoked %d times',
        (c1: number, c2: number, c3: number) => {
            // Execute
            const suppressibleCallback = handleSuppressibleCallback(callback, c2);
            for (let idx = 0; idx < c3; idx += 1) {
                suppressibleCallback();
            }

            // Verify
            expect(callback).toHaveBeenCalledTimes(c1);
        },
    );
});

import { describe, expect, it, beforeEach, jest, afterEach } from '@jest/globals';
import executeUIFunctions from '../../lib/Utilities/executeUIFunctions';

describe('executeUIFunctions', () => {
    let log: number[];
    let mockCallbackFn1: jest.Mock;
    let mockCallbackFn2: jest.Mock;

    beforeEach(() => {
        log = [];
        mockCallbackFn1 = jest.fn(() => log.push(1));
        mockCallbackFn2 = jest.fn(() => log.push(2));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should execute all functions in order', () => {
        const mockCallbackFn3 = jest.fn(() => log.push(3));

        executeUIFunctions([mockCallbackFn1, mockCallbackFn2, mockCallbackFn3]);

        expect(log).toEqual([1, 2, 3]);
    });

    it('should call onFinished callback after all functions have run', () => {
        const mockFinishedCallbackFn = jest.fn(() => log.push(3));

        executeUIFunctions([mockCallbackFn1, mockCallbackFn2], mockFinishedCallbackFn);

        expect(log).toEqual([1, 2, 3]);
    });
});

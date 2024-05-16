import { jest } from '@jest/globals';
import Runtime from '../../lib/Runtime';
import RuntimeInterface from '../../lib/Interfaces/RuntimeInterface';

jest.mock('../../lib/Runtime', () => ({
    default: jest.fn().mockImplementation(
        (element: unknown, isRTL: unknown, isHorizontal: unknown) =>
            ({
                getIsRTL: jest.fn(() => isRTL),
                getSliderElement: jest.fn(() => element),
                setIsRTL: jest.fn(() => {}),
                getDirectionCoefficient: jest.fn(() => (isRTL ? 1 : -1)),
                getIsHorizontal: jest.fn(() => isHorizontal),
            }) as RuntimeInterface,
    ),
}));

export default Runtime;

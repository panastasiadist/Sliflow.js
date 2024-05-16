import { jest } from '@jest/globals';
import RuntimeInterface from '../../lib/Interfaces/RuntimeInterface';

export default function setupRuntimeMock(
    runtime: RuntimeInterface,
    element: (() => HTMLElement) | undefined,
    isRTL: (() => boolean) | undefined = undefined,
    isHorizontal: (() => boolean) | undefined = undefined,
) {
    if (element) {
        (runtime.getSliderElement as jest.MockedFunction<() => HTMLElement>).mockImplementation(element);
    }

    if (isRTL) {
        (runtime.getIsRTL as jest.MockedFunction<() => boolean>).mockImplementation(isRTL);
        (runtime.getDirectionCoefficient as jest.MockedFunction<() => number>).mockImplementation(() =>
            isRTL() ? 1 : -1,
        );
    }

    if (isHorizontal) {
        (runtime.getIsHorizontal as jest.MockedFunction<() => boolean>).mockImplementation(isHorizontal);
    }
}

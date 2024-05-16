import { describe, expect, it, jest, beforeEach, beforeAll, afterEach } from '@jest/globals';
import ResizeRefreshPlugin from '../../lib/Plugins/ResizeRefreshPlugin';
import { fireResizeObserverCallbacks } from '../__mocks__/ResizeObserver';
import { createPluginMockBundle, PluginMockBundle } from '../__mocks__/createPluginMockBundle';

describe('ResizeRefreshPlugin', () => {
    let plugin: ResizeRefreshPlugin;
    let mockBundle: PluginMockBundle;

    beforeAll(() => {
        // Setup
        mockBundle = createPluginMockBundle();
    });

    beforeEach(() => {
        // Setup
        plugin = new ResizeRefreshPlugin(
            mockBundle.runtime,
            mockBundle.configuration,
            mockBundle.projector,
            mockBundle.bus,
        );
    });

    afterEach(() => {
        // Reset
        jest.clearAllMocks();
    });

    it('should initialize correctly, set the dimensions of the projector and switch to the current slide', () => {
        // Execute
        plugin.init();
        fireResizeObserverCallbacks(mockBundle.runtime.getSliderElement(), 500, 500);

        // Verify
        expect(mockBundle.projector.setDimensions).toHaveBeenCalledTimes(1);
        expect(mockBundle.projector.switch).toHaveBeenCalledTimes(1);
        expect(mockBundle.projector.switch).toHaveBeenCalledWith('+0');
    });
});

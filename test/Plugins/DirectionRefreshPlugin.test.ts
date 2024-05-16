import { describe, expect, it, jest, beforeEach, beforeAll, afterEach } from '@jest/globals';
import DirectionRefreshPlugin from '../../lib/Plugins/DirectionRefreshPlugin';
import setupRuntimeMock from '../__mocks__/setupRuntimeMock';
import { createPluginMockBundle, PluginMockBundle } from '../__mocks__/createPluginMockBundle';
import {
    createMutationRecord,
    fireMutationObserverCallbacks,
    resetMutationObserverCallbacks,
} from '../__mocks__/MutationObserver';

describe('DirectionRefreshPlugin', () => {
    let plugin: DirectionRefreshPlugin;
    let mockBundle: PluginMockBundle;
    let sliderElement: HTMLElement;

    beforeAll(() => {
        mockBundle = createPluginMockBundle();
        setupRuntimeMock(mockBundle.runtime, () => sliderElement);
    });

    beforeEach(() => {
        sliderElement = document.createElement('div');
        plugin = new DirectionRefreshPlugin(
            mockBundle.runtime,
            mockBundle.configuration,
            mockBundle.projector,
            mockBundle.bus,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
        resetMutationObserverCallbacks();
    });

    it.each([
        // When a previous dir attribute hasn't been set (or empty string).
        ['change', 'dir', 'html', '', 'rtl', 'ltr', 'rtl'],
        ['change', 'dir', 'html', null, 'rtl', 'ltr', 'rtl'],
        ['change', 'dir', 'slider', '', 'rtl', 'ltr', 'rtl'],
        ['change', 'dir', 'slider', null, 'rtl', 'ltr', 'rtl'],
        // When the previous and the new dir values differ.
        ['change', 'dir', 'html', 'ltr', 'rtl', 'ltr', 'rtl'],
        ['change', 'dir', 'html', 'rtl', 'ltr', 'rtl', 'ltr'],
        ['change', 'dir', 'slider', 'ltr', 'rtl', 'ltr', 'rtl'],
        ['change', 'dir', 'slider', 'rtl', 'ltr', 'rtl', 'ltr'],
        // When the previous and the new dir values are the same.
        ['not change', 'dir', 'html', 'ltr', 'ltr', 'ltr', 'rtl'],
        ['not change', 'dir', 'html', 'rtl', 'rtl', 'rtl', 'ltr'],
        ['not change', 'dir', 'slider', 'ltr', 'ltr', 'ltr', 'rtl'],
        ['not change', 'dir', 'slider', 'rtl', 'rtl', 'rtl', 'ltr'],
        // When a previous style attribute hasn't been set (or empty string).
        ['change', 'style', 'html', '', 'direction: rtl', 'ltr', 'rtl'],
        ['change', 'style', 'html', null, 'direction: ltr', 'rtl', 'ltr'],
        ['change', 'style', 'slider', '', 'direction: rtl', 'ltr', 'rtl'],
        ['change', 'style', 'slider', null, 'direction: ltr', 'rtl', 'ltr'],
        // When the previous and the new style values differ.
        ['change', 'style', 'html', 'direction: ltr', 'direction: rtl', 'ltr', 'rtl'],
        ['change', 'style', 'html', 'direction: rtl', 'direction: ltr', 'rtl', 'ltr'],
        ['change', 'style', 'slider', 'direction: ltr', 'direction: rtl', 'ltr', 'rtl'],
        ['change', 'style', 'slider', 'direction: rtl', 'direction: ltr', 'rtl', 'ltr'],
        // When the previous and the new style values are the same.
        ['not change', 'style', 'html', 'direction: ltr', 'direction: ltr', 'ltr', 'ltr'],
        ['not change', 'style', 'html', 'direction: rtl', 'direction: rtl', 'rtl', 'rtl'],
        ['not change', 'style', 'slider', 'direction: ltr', 'direction: ltr', 'ltr', 'ltr'],
        ['not change', 'style', 'slider', 'direction: rtl', 'direction: rtl', 'rtl', 'rtl'],
        // When a previous class attribute hasn't been set (or empty string).
        ['change', 'class', 'html', '', 'class2', 'ltr', 'rtl'],
        ['change', 'class', 'html', null, 'class2', 'rtl', 'ltr'],
        ['change', 'class', 'slider', '', 'class2', 'ltr', 'rtl'],
        ['change', 'class', 'slider', null, 'class2', 'rtl', 'ltr'],
        // When the previous and the new class values differ.
        ['change', 'class', 'html', 'class1', 'class2', 'ltr', 'rtl'],
        ['change', 'class', 'html', 'class1', 'class2', 'rtl', 'ltr'],
        ['change', 'class', 'slider', 'class1', 'class2', 'ltr', 'rtl'],
        ['change', 'class', 'slider', 'class1', 'class2', 'rtl', 'ltr'],
        // // When the previous and the new class values are the same.
        ['not change', 'class', 'html', 'class1', 'class1', 'ltr', 'ltr'],
        ['not change', 'class', 'html', 'class1', 'class1', 'rtl', 'rtl'],
        ['not change', 'class', 'slider', 'class1', 'class1', 'ltr', 'ltr'],
        ['not change', 'class', 'slider', 'class1', 'class1', 'rtl', 'rtl'],
    ])(
        "should %s the projector's direction when the '%s' attribute of the %s element changes from '%s' to '%s'",
        (
            change: string,
            property: string,
            tag: string,
            oldPropertyValue: string | null | undefined,
            newPropertyValue: string,
            oldDir: string,
            newDir: string,
        ) => {
            // Setup
            const element = tag === 'html' ? document.documentElement : sliderElement;
            setupRuntimeMock(mockBundle.runtime, undefined, () => oldDir === 'rtl');

            element.setAttribute(property, newPropertyValue);

            sliderElement.style.direction = oldDir;

            // Execute
            plugin.init();

            sliderElement.style.direction = newDir;

            fireMutationObserverCallbacks(element, [
                createMutationRecord('attributes', element, property, null, null, oldPropertyValue),
            ]);

            // Verify
            if (change === 'change') {
                expect(mockBundle.runtime.setIsRTL).toHaveBeenCalledTimes(1);
                expect(mockBundle.runtime.setIsRTL).toHaveBeenCalledWith(newDir === 'rtl');
                expect(mockBundle.projector.switch).toHaveBeenCalledTimes(1);
                expect(mockBundle.projector.switch).toHaveBeenCalledWith('+0');
            } else {
                expect(mockBundle.runtime.setIsRTL).not.toHaveBeenCalled();
                expect(mockBundle.projector.switch).not.toHaveBeenCalled();
            }
        },
    );
});

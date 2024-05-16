import { describe, beforeEach, it, jest, expect, beforeAll, afterEach } from '@jest/globals';
import NavigationPlugin from '../../lib/Plugins/NavigationPlugin';
import { createPluginMockBundle, PluginMockBundle } from '../__mocks__/createPluginMockBundle';
import setupRuntimeMock from '../__mocks__/setupRuntimeMock';

describe('NavigationPlugin', () => {
    let plugin: NavigationPlugin;
    let previousButton: HTMLElement;
    let nextButton: HTMLElement;
    let mockBundle: PluginMockBundle;

    function clickButtons(buttons: HTMLElement[]) {
        buttons.forEach((button) => {
            button.dispatchEvent(new MouseEvent('click'));
        });
    }

    beforeAll(() => {
        mockBundle = createPluginMockBundle();
    });

    beforeEach(() => {
        // Setup
        previousButton = document.createElement('button');
        previousButton.setAttribute('data-sliflow-navigation-target', '-1');

        nextButton = document.createElement('button');
        nextButton.setAttribute('data-sliflow-navigation-target', '+1');

        plugin = new NavigationPlugin(
            mockBundle.runtime,
            mockBundle.configuration,
            mockBundle.projector,
            mockBundle.bus,
        );
    });

    afterEach(() => {
        // Reset
        jest.resetAllMocks();
    });

    describe('when control buttons are present', () => {
        it('should set up event listeners and perform projector switching', () => {
            // Setup
            const element = document.createElement('div');
            element.appendChild(previousButton);
            element.appendChild(nextButton);
            setupRuntimeMock(mockBundle.runtime, () => element);

            // Execute
            plugin.init();
            clickButtons([previousButton, nextButton, previousButton, nextButton]);

            // Verify
            expect(mockBundle.projector.switch).toHaveBeenCalledTimes(4);
            expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(1, '-1');
            expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(2, '+1');
            expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(3, '-1');
            expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(4, '+1');
        });
    });

    describe('when no control buttons are present', () => {
        it('should not perform projector switching', () => {
            // Setup
            const element = document.createElement('div');
            setupRuntimeMock(mockBundle.runtime, () => element);

            // Execute
            plugin.init();
            clickButtons([previousButton, nextButton]);

            // Verify
            expect(mockBundle.projector.switch).not.toHaveBeenCalled();
        });
    });
});

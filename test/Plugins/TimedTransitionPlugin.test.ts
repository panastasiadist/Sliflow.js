import { describe, expect, it, beforeEach, jest, beforeAll, afterEach } from '@jest/globals';
import TimedTransitionPlugin from '../../lib/Plugins/TimedTransitionPlugin';
import { PluginMockBundle, createPluginMockBundle } from '../__mocks__/createPluginMockBundle';
import setupRuntimeMock from '../__mocks__/setupRuntimeMock';

describe('TimedTransitionPlugin', () => {
    let plugin: TimedTransitionPlugin;
    let currentSlideIndex = 0;
    let mockSliderElement: HTMLElement;
    let mockBundle: PluginMockBundle;

    function mockConfig<T>(values: Record<string, T>) {
        (
            mockBundle.configuration.getValue as jest.MockedFunction<(key: string, defaultValue: T) => T>
        ).mockImplementation((key, defaultValue) => (key in values ? values[key] : defaultValue));
    }

    beforeAll(() => {
        // Setup
        jest.useFakeTimers();
        jest.spyOn(global, 'setInterval');

        mockSliderElement = document.createElement('div');

        mockBundle = createPluginMockBundle();

        setupRuntimeMock(mockBundle.runtime, () => mockSliderElement);

        (mockBundle.projector.switch as jest.MockedFunction<(slideIndex: number | string) => void>).mockImplementation(
            () => {
                currentSlideIndex += 1;
            },
        );
        (mockBundle.projector.getCurrentSlideIndex as jest.MockedFunction<() => number>).mockImplementation(
            () => currentSlideIndex,
        );
    });

    beforeEach(() => {
        plugin = new TimedTransitionPlugin(
            mockBundle.runtime,
            mockBundle.configuration,
            mockBundle.projector,
            mockBundle.bus,
        );
    });

    afterEach(() => {
        // Reset
        jest.clearAllMocks();
        jest.clearAllTimers();
        currentSlideIndex = 0;
    });

    describe('when initialized with a non positive or non set timedTransitionInterval configuration value', () => {
        it.each([[0], [-1], [undefined]])(
            'should not switch to the next slide if timedTransitionInterval is %s',
            (timedTransitionInterval: number | undefined) => {
                // Setup
                const config = timedTransitionInterval !== undefined ? { timedTransitionInterval } : {};
                mockConfig(config as Record<string, string>);

                // Execute
                plugin.init();
                jest.advanceTimersByTime(100);

                // Verify
                expect(mockBundle.projector.switch).not.toBeCalled();
            },
        );
    });

    // eslint-disable-next-line max-len
    describe('when initialized with a positive timedTransitionInterval and different timedTransitionHoverStrategy configuration values', () => {
        describe('when hovering', () => {
            // eslint-disable-next-line max-len
            it('should not switch to next slide if timedTransitionHoverStrategy configuration option is set to pause value', () => {
                // Setup
                mockConfig({
                    timedTransitionInterval: 1,
                    timedTransitionHoverStrategy: 'pause',
                });

                jest.spyOn(mockSliderElement, 'matches').mockImplementation((key: string) => key === ':hover');

                // Execute
                plugin.init();
                jest.advanceTimersByTime(1000);

                // Verify
                expect(mockBundle.projector.switch).not.toBeCalled();
            });

            // eslint-disable-next-line max-len
            it('should switch to next slide if timedTransitionHoverStrategy configuration option is not set to pause value', () => {
                // Setup
                mockConfig({
                    timedTransitionInterval: 1,
                    timedTransitionHoverStrategy: 'invalid.value',
                });

                jest.spyOn(mockSliderElement, 'matches').mockImplementation((key: string) => key === ':hover');

                // Execute
                plugin.init();
                jest.advanceTimersByTime(1000);

                // Verify
                expect(mockBundle.projector.switch).toBeCalledWith('+1');
            });
        });

        describe('when not hovering', () => {
            it('should switch to the next slides after the interval', () => {
                // Setup
                mockConfig({
                    timedTransitionInterval: 1,
                    timedTransitionHoverStrategy: 'pause',
                });

                jest.spyOn(mockSliderElement, 'matches').mockImplementation((key: string) => !(key === ':hover'));

                // Execute
                plugin.init();
                jest.advanceTimersByTime(1000);
                jest.advanceTimersByTime(1000);

                // Verify
                expect(mockBundle.projector.switch).toHaveBeenCalledTimes(2);
                expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(1, '+1');
                expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(2, '+1');
            });
        });

        describe('when slide switching happens from a third party between two consecutive tick events', () => {
            it('should wait for another tick event to switch to the next slide', () => {
                // Setup
                mockConfig({ timedTransitionInterval: 1 });

                // Execute
                plugin.init();
                jest.advanceTimersByTime(1000); // Should lead to currentSlideIndex = 1
                jest.advanceTimersByTime(1000); // Should lead to currentSlideIndex = 2
                currentSlideIndex = 3; // Simulate a slide switch which has been performed by third-party code
                jest.advanceTimersByTime(1000); // Should leave currentSlideIndex = 3, as set by the third-party code
                jest.advanceTimersByTime(1000); // Should lead to currentSlideIndex = 4

                // Verify
                expect(mockBundle.projector.switch).toHaveBeenCalledTimes(3);
                expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(1, '+1');
                expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(2, '+1');
                expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(3, '+1');
                expect(mockBundle.projector.getCurrentSlideIndex).toHaveLastReturnedWith(4);
            });
        });
    });
});

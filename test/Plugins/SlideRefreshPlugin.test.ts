import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
    createMutationRecord,
    fireMutationObserverCallbacks,
    resetMutationObserverCallbacks,
} from '../__mocks__/MutationObserver';
import { createPluginMockBundle, PluginMockBundle } from '../__mocks__/createPluginMockBundle';
import { fireResizeObserverCallbacks, resetResizeObserverCallbacks } from '../__mocks__/ResizeObserver';
import SlideRefreshPlugin from '../../lib/Plugins/SlideRefreshPlugin';
import BusEvent from '../../lib/Enums/BusEvent';
import { BusListenerFunction } from '../../lib/Interfaces/BusInterface';
import Slide from '../../lib/Slide';

describe('SlideRefreshPlugin', () => {
    let plugin: SlideRefreshPlugin;
    let stageElement: HTMLElement;
    let mockBundle: PluginMockBundle;
    const currentSlides: Slide[] = [];
    let currentSlideIndex = 0;
    let eventToListener: Record<string, jest.MockedFunction<BusListenerFunction>> = {};

    function setupSlides(
        count: number,
        isActive: boolean,
        isCurrent: number,
        mode: 'replace' | 'prepend' | 'append' = 'replace',
        element: HTMLElement = document.createElement('div'),
    ) {
        const slides: Slide[] = [];

        for (let index = 0; index < count; index += 1) {
            slides.push({
                getIsActive: () => isActive,
                getIsCurrent: () => index === isCurrent,
                getElement: () => element,
            } as unknown as Slide);
        }

        if (mode === 'replace') {
            currentSlides.splice(0);
            currentSlides.push(...slides);
        } else if (mode === 'prepend') {
            currentSlides.unshift(...slides);
        } else if (mode === 'append') {
            currentSlides.push(...slides);
        }

        currentSlideIndex = slides.findIndex((slide) => slide.getIsCurrent());
    }

    beforeAll(() => {
        mockBundle = createPluginMockBundle();

        (mockBundle.projector.getStageElement as jest.MockedFunction<() => HTMLElement>).mockImplementation(
            () => stageElement,
        );

        (mockBundle.projector.getCurrentSlideIndex as jest.MockedFunction<() => number>).mockImplementation(
            () => currentSlideIndex,
        );

        (mockBundle.projector.getSlides as jest.MockedFunction<() => Slide[]>).mockImplementation(() => currentSlides);

        const { bus } = mockBundle;

        (bus.subscribe as jest.MockedFunction<(event: BusEvent, fn: BusListenerFunction) => void>).mockImplementation(
            (event: BusEvent, fn: BusListenerFunction) => {
                eventToListener[event] = jest.fn((eventType) => fn(eventType));
            },
        );

        (bus.notify as jest.MockedFunction<(event: BusEvent) => void>).mockImplementation((event: BusEvent) => {
            const fn = eventToListener[event];
            if (typeof fn !== 'undefined') {
                fn(event);
            }
        });
    });

    beforeEach(() => {
        stageElement = document.createElement('div');
        stageElement.setAttribute('id', 'test');

        plugin = new SlideRefreshPlugin(
            mockBundle.runtime,
            mockBundle.configuration,
            mockBundle.projector,
            mockBundle.bus,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
        currentSlideIndex = 0;
        currentSlides.splice(0);
        eventToListener = {};
        resetResizeObserverCallbacks();
        resetMutationObserverCallbacks();
    });

    it('does not refresh slides when slide switching is in progress', () => {
        // Setup
        currentSlides.splice(0);

        // Execute
        plugin.init();

        mockBundle.bus.notify(BusEvent.TRANSITIONING_STARTED);

        fireResizeObserverCallbacks(document.documentElement, 500, 500);

        mockBundle.bus.notify(BusEvent.TRANSITIONING_FINISHED);

        // Verify
        expect(mockBundle.projector.setSlides).not.toHaveBeenCalled();
    });

    describe('viewport resize', () => {
        it('calls the projector to refresh the slides on viewport resize', () => {
            // Setup
            // No slides available

            // Execute
            plugin.init();

            // Simulate a resize event.
            fireResizeObserverCallbacks(document.documentElement, 500, 500);

            // Verify
            expect(mockBundle.projector.setSlides).toHaveBeenCalledTimes(1);
        });

        it('should switch slide on resize if slides have changed', () => {
            // Create a single, active, current slide.
            setupSlides(1, true, 0);

            // Execute
            // On initialization, it will take into account a single present.
            plugin.init();

            // Simulate a resize event.
            fireResizeObserverCallbacks(document.documentElement, 500, 500);

            // Create another active, non-current slide and place it before the previous slide.
            setupSlides(1, true, -1, 'prepend');

            // Simulate another resize event.
            fireResizeObserverCallbacks(document.documentElement, 500, 500);

            // Verify
            expect(mockBundle.projector.switch).toHaveBeenCalledTimes(2);
            expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(1, 0);
            expect(mockBundle.projector.switch).toHaveBeenNthCalledWith(2, 1);
        });

        it('should switch to the first available slide if no slide is the current one', () => {
            // Setup
            // Create a single, active, non-current slide.
            setupSlides(1, true, -1);

            // Execute
            plugin.init();

            // Simulate a resize event.
            fireResizeObserverCallbacks(document.documentElement, 500, 500);

            // Verify
            expect(mockBundle.projector.switch).toHaveBeenCalledWith(0);
            expect(mockBundle.projector.switch).toHaveBeenCalledTimes(1);
        });
    });

    describe('slide addition and removal', () => {
        it('should refresh and switch slide if a slide has been added', () => {
            // Setup
            const slideElement1 = document.createElement('div');
            const slideElement2 = document.createElement('div');

            // Create an active, current slide.
            setupSlides(1, true, 0, 'replace', slideElement1);

            // Execute
            // On initialization, it will take into account a single present.
            plugin.init();

            // Simulate the creation of another active, non-current slide.
            setupSlides(1, true, -1, 'append', slideElement2);

            // By the time the mutation is fired, the last slide will have been added.
            // The addition should be detected by the plugin and projector.setSlides and projector.switch be called.
            fireMutationObserverCallbacks(stageElement, [
                createMutationRecord('childList', stageElement, null, slideElement2, null),
            ]);

            // Verify
            expect(mockBundle.projector.switch).toHaveBeenCalledWith(0);
            expect(mockBundle.projector.switch).toHaveBeenCalledTimes(1);
            expect(mockBundle.projector.setSlides).toHaveBeenCalledTimes(1);
        });

        it('should refresh and switch slide if a slide has been removed', () => {
            // Setup
            const slideElement1 = document.createElement('div');
            const slideElement2 = document.createElement('div');

            // Create 2 slides, both of them active, the first of them current
            setupSlides(1, true, 0, 'replace', slideElement1);
            setupSlides(1, true, -1, 'append', slideElement2);

            // Execute
            // On initialization, it will take 2 slides into account.
            plugin.init();

            // Remove the slide created last.
            currentSlides.splice(1);

            // By the time the mutation is fired, the last slide will have been removed.
            // The removal should be detected by the plugin and projector.setSlides and projector.switch be called.
            fireMutationObserverCallbacks(stageElement, [
                createMutationRecord('childList', stageElement, null, null, slideElement2),
            ]);

            // Verify
            expect(mockBundle.projector.switch).toHaveBeenCalledWith(0);
            expect(mockBundle.projector.switch).toHaveBeenCalledTimes(1);
            expect(mockBundle.projector.setSlides).toHaveBeenCalledTimes(1);
        });
    });

    describe('slide attribute modification', () => {
        it.each([
            // attribute, oldValue, newValue
            ['class', 'class1', 'class2'],
            ['class', null, 'class1'],
            ['class', 'class1', null],
            ['style', 'display: none', 'display: block'],
            ['style', null, 'display: block'],
            ['style', 'display: none', null],
        ])(
            "should refresh and switch slide if the '%s' attribute of a slide has changed from '%s' to '%s'",
            (attribute: string, oldValue: string | null, newValue: string | null) => {
                // Setup
                const slideElement = document.createElement('div');

                // Create a single active, current slide.
                setupSlides(1, true, 0, 'replace', slideElement);

                // Execute
                // On initialization, it will take 1 slide into account.
                plugin.init();

                // Simulate change of attributes of a slide element.
                if (newValue) {
                    slideElement.setAttribute(attribute, newValue);
                } else {
                    slideElement.removeAttribute(attribute);
                }

                // By the time the mutation is fired, attributes on the elements will have changed.
                // The change should be detected by the plugin and projector.setSlides and projector.switch be called.
                fireMutationObserverCallbacks(slideElement, [
                    createMutationRecord('attributes', slideElement, attribute, null, null, oldValue),
                ]);

                // Verify
                expect(mockBundle.projector.switch).toHaveBeenCalledWith(0);
                expect(mockBundle.projector.switch).toHaveBeenCalledTimes(1);
                expect(mockBundle.projector.setSlides).toHaveBeenCalledTimes(1);
            },
        );
    });
});

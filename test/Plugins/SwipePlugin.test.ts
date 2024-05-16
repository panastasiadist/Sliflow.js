import { describe, expect, it, jest, beforeEach, beforeAll, afterEach } from '@jest/globals';
import SwipePlugin from '../../lib/Plugins/SwipePlugin';
import { createPluginMockBundle, PluginMockBundle } from '../__mocks__/createPluginMockBundle';
import setupRuntimeMock from '../__mocks__/setupRuntimeMock';
import HtmlClass from '../../lib/Enums/HtmlClass';

describe('SwipePlugin', () => {
    let plugin: SwipePlugin;
    let projectorElement: HTMLElement;
    let sliderElement: HTMLElement;
    let mockBundle: PluginMockBundle;

    enum GestureMode {
        Touch = 'touch',
        MouseUp = 'mouseup',
        MouseLeave = 'mouseleave',
    }

    enum GestureEvent {
        TouchStart = 'touchstart',
        TouchMove = 'touchmove',
        TouchEnd = 'touchend',
        MouseDown = 'mousedown',
        MouseMove = 'mousemove',
        MouseLeave = 'mouseleave',
        MouseUp = 'mouseup',
    }

    function mockConfig<T>(values: Record<string, T>) {
        (
            mockBundle.configuration.getValue as jest.MockedFunction<(key: string, defaultValue: T) => T>
        ).mockImplementation((key, defaultValue) => (key in values ? values[key] : defaultValue));
    }

    function createGesturePositionEventFromEventType(
        eventType: GestureEvent,
        isHorizontal: boolean,
        clientPos: number,
    ): Event {
        const isTouchGesture = [
            GestureEvent.TouchStart.toString(),
            GestureEvent.TouchMove.toString(),
            GestureEvent.TouchEnd.toString(),
        ].includes(eventType.toString());

        const EventClass = isTouchGesture ? TouchEvent : MouseEvent;
        const direction = isHorizontal ? 'clientX' : 'clientY';

        const options = isTouchGesture
            ? { touches: [{ [direction]: clientPos } as unknown as Touch] }
            : { [direction]: clientPos };

        return new EventClass(eventType, options);
    }

    function dispatchGestureEvents(
        mode: GestureMode,
        isHorizontal: boolean,
        sourceClientPos: number,
        targetClientPos: number,
    ) {
        const gestureKindStart = mode === GestureMode.Touch ? GestureEvent.TouchStart : GestureEvent.MouseDown;
        const gestureKindMove = mode === GestureMode.Touch ? GestureEvent.TouchMove : GestureEvent.MouseMove;
        const gestureKindEnd = mode === GestureMode.Touch ? 'touchend' : mode.toString();

        projectorElement.dispatchEvent(
            createGesturePositionEventFromEventType(gestureKindStart, isHorizontal, sourceClientPos),
        );

        projectorElement.dispatchEvent(
            createGesturePositionEventFromEventType(gestureKindMove, isHorizontal, targetClientPos),
        );

        projectorElement.dispatchEvent(new (mode === GestureMode.Touch ? TouchEvent : MouseEvent)(gestureKindEnd));
    }

    function simulateGestureLifecycle<T>(
        values: Record<string, T>,
        sourceClientPos: number,
        targetClientPos: number,
        mode: GestureMode,
        isHorizontal: boolean,
    ) {
        // Setup
        mockConfig(values);

        // Execute
        plugin.init();

        dispatchGestureEvents(mode, isHorizontal, sourceClientPos, targetClientPos);
    }

    function testProjectOnGesture<T>(
        values: Record<string, T>,
        sourceClientPos: number,
        targetClientPos: number,
        expectedOffset: number,
        mode: GestureMode,
        isHorizontal: boolean,
    ) {
        // Setup & Execute
        simulateGestureLifecycle(values, sourceClientPos, targetClientPos, mode, isHorizontal);

        // Verify
        expect(mockBundle.projector.project).toHaveBeenCalledTimes(1);
        expect(mockBundle.projector.project).toHaveBeenCalledWith(expectedOffset, true);
    }

    function testSwitchOnGesture<T>(
        values: Record<string, T>,
        sourceClientPos: number,
        targetClientPos: number,
        expectedSwitch: string,
        mode: GestureMode,
        isHorizontal: boolean,
    ) {
        // Setup & Execute
        simulateGestureLifecycle(values, sourceClientPos, targetClientPos, mode, isHorizontal);

        // Verify
        expect(mockBundle.projector.switch).toHaveBeenCalledTimes(1);
        expect(mockBundle.projector.switch).toHaveBeenCalledWith(expectedSwitch);
    }

    function testClassPresenceWithinGestureLifecycle(
        startEventType: GestureEvent,
        endEventType: GestureEvent,
        isHorizontal: boolean,
    ) {
        // Setup
        const startEvent = createGesturePositionEventFromEventType(startEventType, isHorizontal, 0);
        const endEvent = createGesturePositionEventFromEventType(endEventType, isHorizontal, 0);

        mockConfig({ swipe: 'true' });

        // Execute & Verify
        plugin.init();

        mockBundle.projector.getProjectorElement().dispatchEvent(startEvent);
        expect(sliderElement.classList).toContain(HtmlClass.SWIPING);

        mockBundle.projector.getProjectorElement().dispatchEvent(endEvent);
        expect(sliderElement.classList).not.toContain(HtmlClass.SWIPING);
    }

    function setupRuntime(isRTL: boolean, isHorizontal: boolean) {
        setupRuntimeMock(
            mockBundle.runtime,
            undefined,
            () => isRTL,
            () => isHorizontal,
        );
    }

    beforeAll(() => {
        // Setup
        mockBundle = createPluginMockBundle();

        (mockBundle.projector.getProjectorElement as jest.MockedFunction<() => HTMLElement>).mockImplementation(
            () => projectorElement,
        );

        setupRuntimeMock(mockBundle.runtime, () => sliderElement);
    });

    beforeEach(() => {
        // Setup
        projectorElement = document.createElement('div');
        sliderElement = document.createElement('div');
        plugin = new SwipePlugin(mockBundle.runtime, mockBundle.configuration, mockBundle.projector, mockBundle.bus);
    });

    afterEach(() => {
        // Reset
        jest.clearAllMocks();
    });

    describe('when initialized with different swipe values', () => {
        it.each([
            [0, 'does not exist', 'horizontal', {} as Record<string, unknown>],
            [0, 'is not "true"', 'horizontal', { swipe: true } as Record<string, unknown>],
            [1, 'is "true"', 'horizontal', { swipe: 'true' } as Record<string, unknown>],
            [0, 'is not exist', 'vertical', {} as Record<string, unknown>],
            [0, 'is not "true"', 'vertical', { swipe: true } as Record<string, unknown>],
            [1, 'is "true"', 'vertical', { swipe: 'true' } as Record<string, unknown>],
        ])(
            'Triggers run() %s times when swipe configuration value %s and the mode is %s',
            (expectedCalledTimes: number, _description: string, mode: string, config: Record<string, unknown>) => {
                // Setup
                mockConfig(config);

                // Execute
                plugin.init();
                dispatchGestureEvents(GestureMode.Touch, mode === 'horizontal', 0, 10);

                // Verify
                expect(mockBundle.projector.project).toHaveBeenCalledTimes(expectedCalledTimes);
            },
        );
    });

    describe("when a gesture's lifecycle is not complete", () => {
        it.each([
            ['horizontal mouse', GestureEvent.MouseMove, true],
            ['horizontal touch', GestureEvent.TouchMove, true],
            ['vertical mouse', GestureEvent.MouseMove, false],
            ['vertical touch', GestureEvent.TouchMove, false],
        ])(
            "should not project if a %s gesture's lifecycle is not complete",
            (_description: string, eventType: GestureEvent, isHorizontal: boolean) => {
                // Setup
                mockConfig({ swipe: 'true' });

                // Execute
                plugin.init();
                projectorElement.dispatchEvent(createGesturePositionEventFromEventType(eventType, isHorizontal, 0));

                // Verify
                expect(mockBundle.projector.project).not.toHaveBeenCalled();
            },
        );
    });

    describe('when initialized with no swipeAutoSlidingThreshold and swipeAccelerationMultiplier values', () => {
        it.each([
            ['left-to-right', GestureMode.Touch, 'horizontal', 0, 100, 100], // left-to-right, touch gesture
            ['right-to-left', GestureMode.Touch, 'horizontal', 100, 0, -100], // right-to-left, touch gesture
            ['left-to-right', GestureMode.MouseUp, 'horizontal', 0, 100, 100], // left-to-right, mouse gesture
            ['right-to-left', GestureMode.MouseUp, 'horizontal', 100, 0, -100], // right-to-left, mouse gesture
            ['left-to-right', GestureMode.MouseLeave, 'horizontal', 0, 100, 100], // left-to-right, mouse gesture
            ['right-to-left', GestureMode.MouseLeave, 'horizontal', 100, 0, -100], // right-to-left, mouse gesture
            ['top-to-bottom', GestureMode.Touch, 'vertical', 0, 100, 100], // top-to-bottom, touch gesture
            ['bottom-to-top', GestureMode.Touch, 'vertical', 100, 0, -100], // bottom-to-top, touch gesture
            ['top-to-bottom', GestureMode.MouseUp, 'vertical', 0, 100, 100], // top-to-bottom, mouse gesture
            ['bottom-to-top', GestureMode.MouseUp, 'vertical', 100, 0, -100], // bottom-to-top, mouse gesture
            ['top-to-bottom', GestureMode.MouseLeave, 'vertical', 0, 100, 100], // top-to-bottom, mouse gesture
            ['bottom-to-top', GestureMode.MouseLeave, 'vertical', 100, 0, -100], // bottom-to-top, mouse gesture
        ])(
            'projects a %s gesture using a %s event in %s orientation',
            (
                _movement: string,
                mode: GestureMode,
                orientation: string,
                sourceClientPos: number,
                targetClientPos: number,
                expectedOffset: number,
            ) => {
                const isHorizontal = orientation === 'horizontal';

                setupRuntime(false, isHorizontal);
                testProjectOnGesture(
                    { swipe: 'true' },
                    sourceClientPos,
                    targetClientPos,
                    expectedOffset,
                    mode,
                    isHorizontal,
                );
            },
        );

        it.each([
            [GestureEvent.TouchStart, GestureEvent.TouchEnd, 'horizontal'],
            [GestureEvent.MouseDown, GestureEvent.MouseUp, 'horizontal'],
            [GestureEvent.MouseDown, GestureEvent.MouseLeave, 'horizontal'],
            [GestureEvent.TouchStart, GestureEvent.TouchEnd, 'vertical'],
            [GestureEvent.MouseDown, GestureEvent.MouseUp, 'vertical'],
            [GestureEvent.MouseDown, GestureEvent.MouseLeave, 'vertical'],
        ])(
            // eslint-disable-next-line max-len
            `toggles "${HtmlClass.SWIPING}" class during the lifecycle of a %s event, ending with a %s event, in %s orientation`,
            (startEventType: GestureEvent, endEventType: GestureEvent, orientation: string) => {
                const isHorizontal = orientation === 'horizontal';

                setupRuntime(false, isHorizontal);
                testClassPresenceWithinGestureLifecycle(startEventType, endEventType, isHorizontal);
            },
        );
    });

    describe('when initialized with a swipeAccelerationMultiplier value', () => {
        it.each([
            ['left-to-right', 0.5, 'horizontal', 0, 100, 50], // left-to-right gesture
            ['right-to-left', 2, 'horizontal', 100, 0, -200], // right-to-left gesture
            ['top-to-bottom', 0.5, 'vertical', 0, 100, 50], // top-to-bottom gesture
            ['bottom-to-top', 2, 'vertical', 100, 0, -200], // bottom-to-top gesture
        ])(
            'projects a %s touch gesture given a swipeAccelerationMultiplier of %s in %s orientation',
            (
                _movement: string,
                multiplier: number,
                orientation: string,
                sourceClientPos: number,
                targetClientPos: number,
                expectedOffset: number,
            ) => {
                const isHorizontal = orientation === 'horizontal';

                setupRuntime(false, isHorizontal);
                testProjectOnGesture(
                    {
                        swipe: 'true',
                        swipeDistanceMultiplier: `${multiplier}`,
                    },
                    sourceClientPos,
                    targetClientPos,
                    expectedOffset,
                    GestureMode.Touch,
                    isHorizontal,
                );
            },
        );
    });

    describe('when initialized with a swipeAutoSlidingThreshold value', () => {
        it.each([
            ['Next, Horizontal', '50', 100, 0, '+1', false, true],
            ['Next, Horizontal, RTL', '50', 0, 100, '+1', true, true],
            ['Previous, Horizontal', '0', 0, 10, '-1', false, true],
            ['Previous, Horizontal, RTL', '0', 10, 0, '-1', true, true],
            ['Next, Vertical', '50', 100, 0, '+1', false, false],
            ['Next, Vertical, RTL', '50', 0, 100, '+1', true, false],
            ['Previous, Vertical', '0', 0, 10, '-1', false, false],
            ['Previous, Vertical, RTL', '0', 10, 0, '-1', true, false],
        ])(
            'calls projector to switch slide (%s)',
            (
                _description: string,
                swipeTransitionThreshold: string,
                sourceClientPos: number,
                targetClientPos: number,
                expectedSlideIndex: string,
                isRTL: boolean,
                isHorizontal: boolean,
            ) => {
                setupRuntime(isRTL, isHorizontal);
                testSwitchOnGesture(
                    {
                        swipe: 'true',
                        swipeTransitionThreshold,
                    },
                    sourceClientPos,
                    targetClientPos,
                    expectedSlideIndex,
                    GestureMode.Touch,
                    isHorizontal,
                );
            },
        );
    });
});

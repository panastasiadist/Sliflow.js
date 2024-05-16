import { describe, expect, it, beforeEach, jest, afterEach } from '@jest/globals';

import Slider from '../lib/Slider';
import Runtime from '../lib/Runtime';
import HtmlClass from '../lib/Enums/HtmlClass';
import Projector from '../lib/Projector';
import SimpleSwitchingStrategy from '../lib/Strategies/SimpleSwitchingStrategy';
import LoopSwitchingStrategy from '../lib/Strategies/LoopSwitchingStrategy';
import ResetSwitchingStrategy from '../lib/Strategies/ResetSwitchingStrategy';
import SimpleProjectionStrategy from '../lib/Strategies/SimpleProjectionStrategy';
import LoopProjectionStrategy from '../lib/Strategies/LoopProjectionStrategy';
import SwipePlugin from '../lib/Plugins/SwipePlugin';
import NavigationPlugin from '../lib/Plugins/NavigationPlugin';
import ResizeRefreshPlugin from '../lib/Plugins/ResizeRefreshPlugin';
import TimedTransitionPlugin from '../lib/Plugins/TimedTransitionPlugin';
import SlideRefreshPlugin from '../lib/Plugins/SlideRefreshPlugin';
import RuntimeInterface from '../lib/Interfaces/RuntimeInterface';

jest.mock('../lib/Strategies/SimpleSwitchingStrategy');
jest.mock('../lib/Strategies/LoopSwitchingStrategy');
jest.mock('../lib/Strategies/ResetSwitchingStrategy');
jest.mock('../lib/Strategies/SimpleProjectionStrategy');
jest.mock('../lib/Strategies/LoopProjectionStrategy');
jest.mock('../lib/Plugins/SwipePlugin');
jest.mock('../lib/Plugins/NavigationPlugin');
jest.mock('../lib/Plugins/ResizeRefreshPlugin');
jest.mock('../lib/Plugins/TimedTransitionPlugin');
jest.mock('../lib/Plugins/SlideRefreshPlugin');

jest.mock('../lib/Runtime', () => ({
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

describe('Slider', () => {
    let sliderElement: HTMLElement;

    beforeEach(() => {
        // Setup
        sliderElement = document.createElement('div');

        sliderElement.innerHTML = `
            <div class="${HtmlClass.PROJECTOR}">
                <div class="${HtmlClass.STAGE}">
                    <div class="${HtmlClass.SLIDE}"></div>
                    <div class="${HtmlClass.SLIDE}"></div>
                    <div class="${HtmlClass.SLIDE}"></div>
                </div>
            </div>
        `;

        jest.spyOn(Projector.prototype, 'switch').mockImplementation(() => {});
        jest.spyOn(Projector.prototype, 'setSwitchingStrategy').mockImplementation(() => {});
        jest.spyOn(Projector.prototype, 'setProjectionStrategy').mockImplementation(() => {});
    });

    afterEach(() => {
        // Reset
        jest.clearAllMocks();
    });

    describe('lifecycle', () => {
        it(`should add the "${HtmlClass.READY}" if the slider element is properly structured`, () => {
            // Execute
            // eslint-disable-next-line no-new
            new Slider(sliderElement);

            // Verify
            // expect(emptySlideElement.classList.contains(Class.READY)).not.toBeTruthy();
            expect(sliderElement.classList).toContain(HtmlClass.READY);
        });

        it(`should throw an exception during initialization if the slider element is not properly structured`, () => {
            const emptySlideElement = document.createElement('div');

            // Execute & Verify
            expect(() => new Slider(emptySlideElement)).toThrow();
        });
    });

    describe('orientation management', () => {
        it.each([
            ['', false],
            ['ltr', false],
            ['rtl', true],
        ])(
            `should initialize correctly and add the "${HtmlClass.READY}" class to the slider element (%s)`,
            (dir: string, isRTL: boolean) => {
                // Setup
                sliderElement.style.direction = dir;

                // Execute
                // eslint-disable-next-line no-new
                new Slider(sliderElement);

                // Verify
                expect(Runtime).toHaveBeenCalledTimes(1);
                expect(Runtime).toHaveBeenCalledWith(sliderElement, isRTL, true);
                expect(SwipePlugin.prototype.init).toHaveBeenCalledTimes(1);
                expect(NavigationPlugin.prototype.init).toHaveBeenCalledTimes(1);
                expect(ResizeRefreshPlugin.prototype.init).toHaveBeenCalledTimes(1);
                expect(SlideRefreshPlugin.prototype.init).toHaveBeenCalledTimes(1);
                expect(TimedTransitionPlugin.prototype.init).toHaveBeenCalledTimes(1);
                expect(sliderElement.classList.contains(HtmlClass.READY)).toBeTruthy();
            },
        );
    });

    describe('configuration handling', () => {
        // eslint-disable-next-line max-len
        it('should initialize with SimpleSwitchingStrategy and SimpleProjectionStrategy when no config is provided', () => {
            // Execute
            // eslint-disable-next-line no-new
            new Slider(sliderElement);

            // Verify
            expect(SimpleSwitchingStrategy).toHaveBeenCalledTimes(1);
            expect(SimpleProjectionStrategy).toHaveBeenCalledTimes(1);
        });

        it.each([
            [
                // eslint-disable-next-line max-len
                'should initialize with SimpleSwitchingStrategy and SimpleProjectionStrategy when replayStrategy has been configured to "none"',
                { replayStrategy: 'none' },
                SimpleSwitchingStrategy,
                SimpleProjectionStrategy,
            ],
            [
                // eslint-disable-next-line max-len
                'should initialize with LoopSwitchingStrategy and LoopProjectionStrategy strategies when replayStrategy has been configured to "loop"',
                { replayStrategy: 'loop' },
                LoopSwitchingStrategy,
                LoopProjectionStrategy,
            ],
            [
                // eslint-disable-next-line max-len
                'should initialize with ResetSwitchingStrategy and SimpleProjectionStrategy strategies when replayStrategy has been configured to "rewind"',
                { replayStrategy: 'rewind' },
                ResetSwitchingStrategy,
                SimpleProjectionStrategy,
            ],
        ])(
            '%s',
            (
                _description: string,
                config: Record<string, string>,
                switchingStrategy: unknown,
                projectionStrategy: unknown,
            ) => {
                // Execute
                // eslint-disable-next-line no-new
                new Slider(sliderElement, config);

                // Verify
                expect(switchingStrategy).toHaveBeenCalledTimes(1);
                expect(projectionStrategy).toHaveBeenCalledTimes(1);
                expect(Projector.prototype.setSwitchingStrategy).toHaveBeenCalledTimes(1);
                expect(Projector.prototype.setProjectionStrategy).toHaveBeenCalledTimes(1);
            },
        );

        it.each([
            ['should switch to the first slide when no configuration has been provided', {}, 0],
            [
                'should switch to the second slide when "initialSlideIndex" configuration value is "1"',
                { initialSlideIndex: '1' },
                '1',
            ],
        ])('%s', (_description: string, config: Record<string, string>, expectedInitialSlide: string | number) => {
            // Execute
            // eslint-disable-next-line no-new
            new Slider(sliderElement, config);

            // Verify
            expect(Projector.prototype.switch).toHaveBeenCalledTimes(1);
            expect(Projector.prototype.switch).toHaveBeenCalledWith(expectedInitialSlide);
        });
    });
});

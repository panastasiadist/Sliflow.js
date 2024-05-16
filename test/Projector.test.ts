import { describe, expect, it, beforeEach, jest, beforeAll, afterEach } from '@jest/globals';
import RuntimeInterface from '../lib/Interfaces/RuntimeInterface';
import ProjectionStrategyInterface from '../lib/Interfaces/ProjectionStrategyInterface';
import SwitchingStrategyInterface from '../lib/Interfaces/SwitchingStrategyInterface';
import Slide from '../lib/Slide';
import Projector from '../lib/Projector';
import Bus from './__mocks__/Bus';
import Runtime from './__mocks__/Runtime';
import setupRuntimeMock from './__mocks__/setupRuntimeMock';
import HtmlClass from '../lib/Enums/HtmlClass';

describe('Projector', () => {
    let mockRuntime: RuntimeInterface;
    let mockProjectionStrategy: ProjectionStrategyInterface;
    let mockSwitchingStrategy: SwitchingStrategyInterface;
    let projector: Projector;
    let sliderElement: HTMLElement;

    function testDimensions() {
        expect(projector.getSlideLength()).toBe(mockRuntime.getSliderElement().getBoundingClientRect().width);
        expect(projector.getOffsetInterval()).toBe(projector.getSlideLength() * (projector.getSlides().length - 1));

        projector.getSlides(false).forEach((slide) => {
            expect(slide.setLength).toHaveBeenCalledWith(projector.getSlideLength(), true);
        });
    }

    function setupRuntimeOperation(isRTL: boolean, isHorizontal: boolean): void {
        setupRuntimeMock(
            mockRuntime,
            undefined,
            () => isRTL,
            () => isHorizontal,
        );
    }

    beforeAll(() => {
        jest.spyOn(Slide.prototype, 'setLength').mockImplementation(() => {});
        jest.spyOn(Slide.prototype, 'setCurrentPosition').mockImplementation(() => {});

        mockProjectionStrategy = {
            project: jest.fn((offset: number) => {
                projector.setOffset(offset);
            }),
        };

        mockSwitchingStrategy = {
            switch: jest.fn((targetIndex: number) => {
                projector.setCurrentSlide(targetIndex);
                projector.setCurrentSlideIndex(targetIndex);
            }),
        };
    });

    beforeEach(() => {
        sliderElement = document.createElement('div');
        sliderElement.innerHTML = `
            <div class="${HtmlClass.PROJECTOR}">
                <div class="${HtmlClass.STAGE}">
                    <div class="${HtmlClass.SLIDE}"></div>
                    <div class="${HtmlClass.SLIDE}"></div>
                    <div class="${HtmlClass.SLIDE}"></div>
                    <div class="${HtmlClass.SLIDE}" style="display: none"></div>
                 </div>
            </div>
        `;

        mockRuntime = new Runtime(sliderElement, false, true);
        projector = new Projector(mockRuntime, new Bus());

        projector.setSwitchingStrategy(mockSwitchingStrategy);
        projector.setProjectionStrategy(mockProjectionStrategy);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('lifecycle operations', () => {
        it.each([[`.${HtmlClass.PROJECTOR}`]])(
            "should throw an exception during initialization if the '%s' element is non existent",
            (className: string) => {
                // Setup
                sliderElement.querySelector(className)?.remove();

                // Execute & Verify
                expect(() => new Projector(mockRuntime, new Bus())).toThrow();
            },
        );

        it(`should fallback to the "${HtmlClass.PROJECTOR}" element as the stage`, () => {
            // Setup
            sliderElement.querySelector(`.${HtmlClass.STAGE}`)?.remove();

            const projector2 = new Projector(mockRuntime, new Bus());

            // Execute & Verify
            expect(projector2.getStageElement()).toBe(projector2.getProjectorElement());
        });

        it.each([
            ['Horizontal', true, false],
            ['Horizontal, RTL', true, true],
            ['Vertical', false, false],
            ['Vertical, RTL', false, true],
        ])('should initialize properly - %s', (_description: string, isHorizontal: boolean, isRTL: boolean) => {
            // Setup
            setupRuntimeOperation(isRTL, isHorizontal);

            // Execute & Verify
            testDimensions();
            expect(projector.getSlides().length).toBe(3);
        });

        it.each([
            ['Horizontal', true, false],
            ['Horizontal, RTL', true, true],
            ['Vertical', false, false],
            ['Vertical, RTL', false, true],
        ])('should calculate dimensions - %s', (_mode: string, isHorizontal: boolean, isRTL: boolean) => {
            // Setup
            setupRuntimeOperation(isRTL, isHorizontal);

            // Execute
            projector.setDimensions();

            // Verify
            testDimensions();
        });

        it(`should find a projector element with the class "${HtmlClass.PROJECTOR}"`, () => {
            // Execute & Verify
            expect(projector.getProjectorElement()).toBeInstanceOf(HTMLElement);
            expect(projector.getProjectorElement().classList).toContain(HtmlClass.PROJECTOR);
        });

        it(`should find a stage element with the class "${HtmlClass.STAGE}"`, () => {
            // Execute & Verify
            expect(projector.getStageElement()).toBeInstanceOf(HTMLElement);
            expect(projector.getStageElement().classList).toContain(HtmlClass.STAGE);
        });
    });

    describe('active slide management', () => {
        it('should refresh the slides', () => {
            Array.from(sliderElement.querySelectorAll(`.${HtmlClass.SLIDE}`))
                .slice(1)
                .forEach((element) => {
                    element.remove();
                });

            projector.setSlides();
            expect(projector.getSlides(false).length).toBe(1);
        });

        it('inactive (hidden) slides should be omitted', () => {
            expect(projector.getSlides().length).toBe(3);
            expect(projector.getSlides(true).length).toBe(3);
        });

        it('inactive (hidden) slides should be returned when instructed so', () => {
            expect(projector.getSlides(false).length).toBe(4);
        });

        it('should set active slide indices', () => {
            // For every slide index
            [...Array(projector.getSlides().length).keys()].forEach((index) => {
                // Execute
                projector.setCurrentSlideIndex(index);

                // Verify
                expect(projector.getCurrentSlideIndex()).toBe(index);
            });
        });

        it('should set current slide and the relative positions of the other slides', () => {
            const slides = projector.getSlides();

            // For every slide index
            [...Array(slides.length).keys()].forEach((targetIndex) => {
                // Execute
                projector.setCurrentSlide(targetIndex);

                // Verify
                expect(projector.getSlides()[targetIndex].setCurrentPosition).toHaveBeenCalledWith(0);

                [...Array(targetIndex).keys()].forEach((index) => {
                    expect(slides[index].setCurrentPosition).toHaveBeenCalledWith(index - targetIndex);
                });
            });
        });
    });

    describe('slide switching', () => {
        it('should not switch if the targetSlide is invalid', () => {
            // Execute
            projector.switch('+');

            // Verify
            expect(mockSwitchingStrategy.switch).not.toHaveBeenCalled();
        });

        it('should subsequently switch to every slide', () => {
            [...Array(projector.getSlides().length).keys()].forEach((index) => {
                // Execute
                projector.switch(index);

                // Verify
                expect(mockSwitchingStrategy.switch).toHaveBeenCalledWith(index);
            });
        });

        it.each([
            ['next slide', 0, '+1', 1],
            ['the slide after the next one', 0, '+2', 2],
            ['previous slide', 1, '-1', 0],
            ['the slide before the previous one', 2, '-2', 0],
        ])(
            `should switch to %s`,
            (_description: string, initialSlide: number, relativeTargetSlide: string, expectedSlide: number) => {
                // Execute
                projector.switch(initialSlide);
                projector.switch(relativeTargetSlide);

                // Verify
                expect(mockSwitchingStrategy.switch).toHaveBeenNthCalledWith(1, initialSlide);
                expect(mockSwitchingStrategy.switch).toHaveBeenNthCalledWith(2, expectedSlide);
                expect(mockSwitchingStrategy.switch).toHaveBeenCalledTimes(2);
            },
        );
    });

    describe('slide projection', () => {
        it.each([
            ['X', -100, 'Horizontal', true, false],
            ['X', 0, 'Horizontal', true, false],
            ['X', 100, 'Horizontal', true, false],
            ['X', -100, 'Horizontal, RTL', true, true],
            ['X', 0, 'Horizontal, RTL', true, true],
            ['X', 100, 'Horizontal, RTL', true, true],
            ['Y', -100, 'Vertical', false, false],
            ['Y', 0, 'Vertical', false, false],
            ['Y', 100, 'Vertical', false, false],
            ['Y', -100, 'Vertical, RTL', false, true],
            ['Y', 0, 'Vertical, RTL', false, true],
            ['Y', 100, 'Vertical, RTL', false, true],
        ])(
            'should set projector element %s offset to %spx - %s',
            (_orientation: string, offset: number, _mode: string, isHorizontal: boolean, isRTL: boolean) => {
                // Setup
                setupRuntimeOperation(isRTL, isHorizontal);

                // Execute
                projector.setOffset(offset);

                // Verify
                expect(projector.getCurrentOffset()).toBe(offset);
                expect(projector.getProjectorElement().style.transform).toBe(`translate${_orientation}(${offset}px)`);
            },
        );

        it.each([[-100], [0], [100]])(`should call a projection strategy with an offset of %spx`, (offset: number) => {
            // Execute
            projector.project(offset, false);

            // Verify
            expect(mockProjectionStrategy.project).toHaveBeenCalledWith(offset);
            expect(mockProjectionStrategy.project).toHaveBeenCalledTimes(1);
        });

        it.each([
            [-100, 100, 0],
            [0, 100, 100],
            [100, 100, 200],
            [200, -400, -200],
        ])(
            `should call a projection strategy with an offset shifted from %spx (%spx) to %spx`,
            (initialOffset: number, shiftingOffset: number, expectedOffset: number) => {
                // Execute
                projector.project(initialOffset, false);
                projector.project(shiftingOffset, true);

                // Verify
                expect(mockProjectionStrategy.project).toHaveBeenNthCalledWith(1, initialOffset);
                expect(mockProjectionStrategy.project).toHaveBeenNthCalledWith(2, expectedOffset);
                expect(mockProjectionStrategy.project).toHaveBeenCalledTimes(2);
            },
        );
    });

    it('should get the runtime', () => {
        expect(projector.getRuntime()).toBe(mockRuntime);
    });
});

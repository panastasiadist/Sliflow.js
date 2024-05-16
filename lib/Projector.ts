import Slide from './Slide';
import BusEvent from './Enums/BusEvent';
import modulo from './Utilities/modulo';
import BusInterface from './Interfaces/BusInterface';
import RuntimeInterface from './Interfaces/RuntimeInterface';
import executeUIFunctions from './Utilities/executeUIFunctions';
import ProjectorInterface from './Interfaces/ProjectorInterface';
import SwitchingStrategyInterface from './Interfaces/SwitchingStrategyInterface';
import ProjectionStrategyInterface from './Interfaces/ProjectionStrategyInterface';

/**
 * This class provides functionality for managing a collection of slides and directing slide transitions.
 *
 * @since 0.1.0
 */
export default class Projector implements ProjectorInterface {
    /**
     * @since 0.1.0
     */
    private currentOffset: number = 0;

    /**
     * @since 0.1.0
     */
    private currentSlideIndex: number = 0;

    /**
     * @since 0.1.0
     */
    private offsetIntervalInPixels: number = 0;

    /**
     * @since 0.1.0
     */
    private projectionStrategy: ProjectionStrategyInterface;

    /**
     * @since 0.1.0
     */
    private readonly projectorElement: HTMLElement;

    /**
     * @since 0.1.0
     */
    private slideLength: number = 0;

    /**
     * @since 0.1.0
     */
    private sliderElement: HTMLElement;

    /**
     * @since 0.1.0
     */
    private slides: Slide[] = [];

    /**
     * @since 0.1.0
     */
    private readonly stageElement: HTMLElement;

    /**
     * @since 0.1.0
     */
    private switchingStrategy: SwitchingStrategyInterface;

    /**
     * Constructor for this class.
     * It populates the instance with slides, sets their dimensions, and initializes necessary elements.
     *
     * @param runtime - An instance of RuntimeInterface.
     * @param bus - An instance of BusInterface.
     * @throws Error if a projector element is not found in the provided slider element.
     */
    constructor(
        private readonly runtime: RuntimeInterface,
        private readonly bus: BusInterface,
    ) {
        this.sliderElement = runtime.getSliderElement();

        const projectorElement = this.sliderElement.querySelector('.sliflow-projector') as HTMLElement | null;

        if (!projectorElement) {
            throw new Error('A projector element is required');
        }

        this.projectorElement = projectorElement;

        let stageElement = this.projectorElement.querySelector('.sliflow-stage') as HTMLElement | null;

        if (!stageElement) {
            stageElement = projectorElement;
        }

        this.stageElement = stageElement;

        this.setSlides();
        this.setDimensions();
    }

    getCurrentOffset(): number {
        return this.currentOffset;
    }

    getCurrentSlideIndex(): number {
        return this.currentSlideIndex;
    }

    getOffsetInterval(): number {
        return this.offsetIntervalInPixels;
    }

    getProjectorElement(): HTMLElement {
        return this.projectorElement;
    }

    getRuntime(): RuntimeInterface {
        return this.runtime;
    }

    getSlideLength(): number {
        return this.slideLength;
    }

    getSlides(activeOnly = true): Slide[] {
        return activeOnly ? this.slides.filter((slide) => slide.getIsActive()) : this.slides;
    }

    getStageElement(): HTMLElement {
        return this.stageElement;
    }

    project(offset: number, shift: boolean): void {
        const targetOffset = offset + (shift ? this.currentOffset : 0);
        this.projectionStrategy.project(targetOffset);
    }

    setCurrentSlide(slideIndex: number): void {
        const targetSlideIndex = modulo(slideIndex, this.getSlides().length);
        const activeSlides = this.getSlides();

        [...new Array(activeSlides.length).keys()].forEach((index) => {
            activeSlides[index].setCurrentPosition(index - targetSlideIndex);
        });

        this.bus.notify(BusEvent.CURRENT_SLIDE_SET);
    }

    setCurrentSlideIndex(slideIndex: number): void {
        this.currentSlideIndex = slideIndex;
    }

    setDimensions(): void {
        const rect = this.sliderElement.getBoundingClientRect();
        const isHorizontal = this.getRuntime().getIsHorizontal();

        this.slideLength = isHorizontal ? rect.width : rect.height;
        this.offsetIntervalInPixels = this.slideLength * (this.getSlides().length - 1);
        this.slides.forEach((slide) => slide.setLength(this.slideLength, isHorizontal));
    }

    setOffset(offset: number): void {
        this.currentOffset = offset;
        this.projectorElement.style.transform = this.getRuntime().getIsHorizontal()
            ? `translateX(${offset}px)`
            : `translateY(${offset}px)`;
    }

    setProjectionStrategy(projectionStrategy: ProjectionStrategyInterface): void {
        this.projectionStrategy = projectionStrategy;
    }

    setSlides(): void {
        const map = new Map<HTMLElement, Slide>();

        this.slides.forEach((slide) => {
            map.set(slide.getElement(), slide);
        });

        const slides: Slide[] = [];

        this.stageElement.querySelectorAll('.sliflow-slide').forEach((element) => {
            const slide = map.get(element as HTMLElement);
            slides.push(slide || new Slide(element as HTMLElement));
        });

        this.slides = slides;

        this.slides.forEach((slide) => {
            slide.setIsActive();
        });
    }

    setSwitchingStrategy(switchingStrategy: SwitchingStrategyInterface): void {
        this.switchingStrategy = switchingStrategy;
    }

    switch(targetSlide: number | string): void {
        const matches = targetSlide.toString().match(/^([-+]?)(\d+)$/) as RegExpMatchArray | null;

        if (matches === null) {
            return;
        }

        const sign = matches[1];
        const index = parseInt(matches[2], 10);
        let targetIndex = this.getCurrentSlideIndex();

        if (sign === '+') {
            targetIndex += index;
        } else if (sign === '-') {
            targetIndex -= index;
        } else {
            targetIndex = index;
        }

        executeUIFunctions([
            () => this.bus.notify(BusEvent.TRANSITIONING_STARTED),
            () => this.switchingStrategy.switch(targetIndex),
            () => this.bus.notify(BusEvent.TRANSITIONING_FINISHED),
        ]);
    }
}

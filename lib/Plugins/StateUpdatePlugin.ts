import BusEvent from '../Enums/BusEvent';
import HtmlClass from '../Enums/HtmlClass';
import PluginBase from '../Base/PluginBase';

/**
 * Generates a CSS class name based on the position of a slide relative to the current slide.
 *
 * @since 0.1.0
 *
 * @param position - The position to generate a class name for. A positive number signifies a slide positioned after the
 * current one, while a negative number indicates a slide before the current one. The position value denotes the
 * distance (in terms of slides) between the slide occupying the position and the current slide, hence the current slide
 * always has a position of 0.
 *
 * @returns The class name for the given position. The class name is generated from the position's absolute value,
 * prefixed with "current" and suffixed with "-p" for negative positions (backward) or "-n" for positive positions
 * (forward).
 */
function generatePositionClass(position: number): string {
    const absIndex = Math.abs(position);
    let relativeClass = HtmlClass.CURRENT.toString();

    if (position < 0) {
        relativeClass += `-p${absIndex}`;
    } else if (position > 0) {
        relativeClass += `-n${absIndex}`;
    }

    return relativeClass;
}

interface Indicator {
    element: HTMLElement;
    slideIndex: number;
}

/**
 * Plugin that refreshes the classes in the slider's DOM to match various states.
 *
 * @since 0.1.0
 */
export default class StateUpdatePlugin extends PluginBase {
    /**
     * Holds the index of the last current slide, relatively to all slides, active and inactive.
     *
     * @since 0.1.0
     */
    private lastCurrentSlideIndex = -1;

    /**
     * Holds the slide count of all slides, active and inactive.
     *
     * @since 0.1.0
     */
    private lastSlideCount = 0;

    init(): void {
        const element = this.runtime.getSliderElement();

        const listeners: [BusEvent, () => void][] = [
            [BusEvent.TRANSITIONING_STARTED, () => element.classList.add(HtmlClass.TRANSITIONING)],
            [BusEvent.TRANSITIONING_FINISHED, () => element.classList.remove(HtmlClass.TRANSITIONING)],
            [BusEvent.SLIDER_READY, () => this.runtime.getSliderElement().classList.add(HtmlClass.READY)],
            [BusEvent.CURRENT_SLIDE_SET, () => this.handleCurrentSlideSetEvent()],
        ];

        listeners.forEach((item) => {
            this.bus.subscribe(item[0] as BusEvent, () => {
                this.performStateUpdate(item[1]);
            });
        });
    }

    /**
     * Apply a given function to all the Slide or indicator HTML elements.
     *
     * @since 0.1.0
     */
    private applyToSlideRelatedElements(fn: (element: HTMLElement) => void): void {
        const allSlides = this.projector.getSlides(false).map((slide) => slide.getElement());
        const allIndicators = this.getIndicators(false).map((indicator) => indicator.element);

        [...allSlides, ...allIndicators].forEach(fn);
    }

    /**
     * Retrieves an array of objects that contain details about the indicator elements found within the Slider's DOM.
     *
     * @since 0.1.0
     * @param activeOnly - Indicates whether to retrieve only active indicators or all indicators.
     * @returns - An array of Indicator objects representing the indicator HTML elements.
     */
    private getIndicators(activeOnly = true): Indicator[] {
        let elements: HTMLElement[] = Array.from(
            this.runtime.getSliderElement().querySelectorAll('[data-sliflow-slide-indicator]'),
        );

        if (activeOnly) {
            elements = elements.filter((element) => window.getComputedStyle(element).display !== 'none');
        }

        const indicators: Indicator[] = [];

        elements.forEach((element) => {
            const slideIndexString = element.getAttribute('data-sliflow-slide-indicator');
            const slideIndex = Number.parseInt(slideIndexString || '-1', 10);

            if (slideIndex > -1) {
                indicators.push({
                    element,
                    slideIndex,
                });
            }
        });

        return indicators;
    }

    /**
     * Updates the slider's HTML elements with state classes.
     * Called when an attempt to change the current slide is made or when there are slide changes in general.
     *
     * @since 0.1.0
     */
    private handleCurrentSlideSetEvent(): void {
        const slides = this.projector.getSlides();
        const index = slides.findIndex((slide) => slide.getIsCurrent());

        // Consider the following essential cases:
        // - A current slide is set for the initial time (index < 0)
        // - A new current slide is set (based on index)
        // - An update in slide count
        // Exit early unless at least one of the mentioned conditions is met.
        if (index < 0 || (this.lastCurrentSlideIndex === index && this.lastSlideCount === slides.length)) {
            return;
        }

        // Store for later reference.
        this.lastCurrentSlideIndex = index;
        this.lastSlideCount = slides.length;

        this.setPositionClasses();
        this.setStartAndEndClasses();
        this.setFirstAndLastClasses();
    }

    /**
     * Performs a state update by executing the given function and notifying the bus events.
     *
     * @since 0.1.0
     * @param fn - The function to be executed during the state update.
     */
    private performStateUpdate(fn: () => void): void {
        this.bus.notify(BusEvent.STATE_UPDATE_STARTED);
        fn();
        this.bus.notify(BusEvent.STATE_UPDATE_FINISHED);
    }

    /**
     * Removes the start and last class from slide related elements.
     * Adds the first and last class to the first and last slides and their indicators.
     *
     * @since 0.1.0
     */
    private setFirstAndLastClasses(): void {
        this.applyToSlideRelatedElements((element: HTMLElement) => {
            element.classList.remove(HtmlClass.FIRST);
            element.classList.remove(HtmlClass.LAST);
        });

        const slides = this.projector.getSlides();
        const indicators = this.getIndicators();

        const getElementPair = (index: number) =>
            [
                slides.length > 0 ? slides[index].getElement() : undefined,
                ...indicators
                    .filter((indicator) => indicator.slideIndex === index)
                    .map((indicator) => indicator.element),
            ].filter((element) => typeof element !== 'undefined');

        getElementPair(0).forEach((element) => (element as HTMLElement).classList.add(HtmlClass.FIRST));
        getElementPair(slides.length - 1).forEach((element) => (element as HTMLElement).classList.add(HtmlClass.LAST));
    }

    /**
     * Sets position classes for slide elements and slide indicators.
     *
     * @since 0.1.0
     */
    private setPositionClasses() {
        // Reset any previously set state classes as they will be re-set appropriately.
        this.applyToSlideRelatedElements((element: HTMLElement) => {
            element.classList.forEach((className) => {
                if (className.startsWith(HtmlClass.CURRENT.toString())) {
                    element.classList.remove(className);
                }
            });
        });

        const activeSlides = this.projector.getSlides();
        const currentSlideIndex = activeSlides.findIndex((slide) => slide.getIsCurrent());

        // Stores HTML elements corresponding to slides or slide indicators.
        // Each will be marked with a class reflecting its relation to the current slide.
        const elementsForPositionClass = this.projector.getSlides().map((slide, index) => ({
            index,
            element: slide.getElement(),
        }));

        this.getIndicators().forEach((indicator) => {
            elementsForPositionClass.push({
                index: indicator.slideIndex,
                element: indicator.element,
            });
        });

        elementsForPositionClass.forEach((item) => {
            const position = generatePositionClass(item.index - currentSlideIndex);
            item.element.classList.add(position);
        });
    }

    /**
     * Sets the start and end classes for the slider element based on the current slide index.
     *
     * @since 0.1.0
     */
    private setStartAndEndClasses(): void {
        const activeSlides = this.projector.getSlides();
        const currentSlideIndex = activeSlides.findIndex((slide) => slide.getIsCurrent());
        const sliderElement = this.runtime.getSliderElement();

        if (currentSlideIndex === 0) {
            sliderElement.classList.add(HtmlClass.START);
            sliderElement.classList.remove(HtmlClass.END);
        } else if (currentSlideIndex === activeSlides.length - 1) {
            sliderElement.classList.remove(HtmlClass.START);
            sliderElement.classList.add(HtmlClass.END);
        } else {
            sliderElement.classList.remove(HtmlClass.START);
            sliderElement.classList.remove(HtmlClass.END);
        }
    }
}

import Slide from '../Slide';
import RuntimeInterface from './RuntimeInterface';
import SwitchingStrategyInterface from './SwitchingStrategyInterface';
import ProjectionStrategyInterface from './ProjectionStrategyInterface';

/**
 * This interface should be implemented by a service that manages the slides and serves projection requests.
 *
 * @since 0.1.0
 */
export default interface ProjectorInterface {
    /**
     * Returns the offset that the projector is presenting.
     *
     * @since 0.1.0
     * @returns The current offset value.
     */
    getCurrentOffset(): number;

    /**
     * Retrieves the index of the current slide.
     *
     * @since 0.1.0
     * @returns The index of the current slide.
     */
    getCurrentSlideIndex(): number;

    /**
     * Returns the maximum absolute offset displacement (from 0 to a positive value) required to project all slides.
     * Projecting this offset (either positive or negative) brings the final slide fully into view.
     *
     * @since 0.1.0
     * @returns The offset interval.
     */
    getOffsetInterval(): number;

    /**
     * Retrieves the HTML element associated with the projector.
     *
     * @since 0.1.0
     * @returns The projector element.
     */
    getProjectorElement(): HTMLElement;

    /**
     * Returns a service tasked with the configuration and retrieval of runtime information.
     *
     * @since 0.1.0
     * @returns The runtime service.
     */
    getRuntime(): RuntimeInterface;

    /**
     * Returns the width (for horizontal mode) or height (for vertical mode) of each slide.
     *
     * @since 0.1.0
     * @returns The width or height of the slide.
     */
    getSlideLength(): number;

    /**
     * Retrieves an array of slides based on the specified criteria.
     *
     * @since 0.1.0
     * @param activeOnly - Optional flag indicating whether to retrieve only active slides.
     * @returns An array of Slide objects matching the specified criteria.
     */
    getSlides(activeOnly?: boolean): Slide[];

    /**
     * Retrieves the HTML element holding the slides.
     *
     * @since 0.1.0
     * @returns The stage element.
     */
    getStageElement(): HTMLElement;

    /**
     * Directs the Projector to project an offset — either the provided value, or another resulting from shifting the
     * current offset by an amount specified by the given one.
     *
     * @since 0.1.0
     * @param offset - The offset by which to project or shift the current offset.
     * @param shift - Indicates whether to perform shifting or not.
     */
    project(offset: number, shift: boolean): void;

    /**
     * Has the Projector perform all necessary operations so the slide indicated by the given index is considered to be
     * the current one.
     *
     * @since 0.1.0
     * @param slideIndex - The index of the slide to set as the current one.
     */
    setCurrentSlide(slideIndex: number): void;

    /**
     * Sets the index of the current slide.
     *
     * @since 0.1.0
     * @param slideIndex - The index of the slide to be set as the current one.
     */
    setCurrentSlideIndex(slideIndex: number): void;

    /**
     * Directs the Projector to perform any operations and bookkeeping related to layout or dimensions. Should be called
     * when there are changes in layout.
     *
     * @since 0.1.0
     */
    setDimensions(): void;

    /**
     * Has the Projector act on the DOM, setting the offset as provided, in order to reveal the part of the slide strip
     * that corresponds to the given offset.
     *
     * @since 0.1.0
     * @param offset - The offset value to be set.
     */
    setOffset(offset: number): void;

    /**
     * Sets the strategy to use when projecting slides.
     *
     * @since 0.1.0
     * @param projectionStrategy - The implementation of the projection strategy.
     */
    setProjectionStrategy(projectionStrategy: ProjectionStrategyInterface): void;

    /**
     * Directs the slider to reread the state of the slides and act accordingly, performing necessary bookkeeping,
     * for instance, when slides have been removed or added.
     *
     * @since 0.1.0
     */
    setSlides(): void;

    /**
     * Sets the strategy to use when switching slides..
     *
     * @since 0.1.0
     * @param switchingStrategy - The implementation of the switching strategy.
     */
    setSwitchingStrategy(switchingStrategy: SwitchingStrategyInterface): void;

    /**
     * Directs the Projector to manage the process of displaying a specific slide.
     * - If an absolute number is provided, the Projector attempts to switch to the slide indicated by the given index.
     * - If a relative index is provided as a string, such as '+1' or '-1', the slide to switch to is chosen
     * according to the index of the current slide.
     *
     * @since 0.1.0
     * @param targetSlide - The target slide to switch to.
     */
    switch(targetSlide: number | string): void;
}

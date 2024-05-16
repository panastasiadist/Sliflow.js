import BusEvent from '../Enums/BusEvent';
import HtmlClass from '../Enums/HtmlClass';
import PluginBase from '../Base/PluginBase';
import isPassiveEventListenerSupported from '../Utilities/isPassiveEventListenerSupported';

/**
 * Plugin that enables users to perform mouse or touch-based sliding.
 * This plugin triggers the necessary actions on the Projector to project the slide strip region that corresponds to the
 * user's navigation gesture's distance.
 *
 * @since 0.1.0
 */
export default class SwipePlugin extends PluginBase {
    /**
     * Represents the final position of the navigation gesture in pixels, either horizontally or vertically. It's used
     * in the gesture's covered distance calculation.
     *
     * @since 0.1.0
     */
    private lastPosition: number | null = null;

    /**
     * Represents a number used in gesture direction-related calculations. This number adjusts calculations for varying
     * scenarios of text direction and orientation.
     *
     * @since 0.1.0
     */
    private rtlCoefficient: number = 0;

    /**
     * The slider's primary, top-level HTML element.
     *
     * @since 0.1.0
     */
    private sliderElement: HTMLElement;

    /**
     * Represents the navigation gesture's starting position in pixels, horizontally or vertically. It contributes to
     * the calculation of the distance covered by the navigation gesture.
     *
     * @since 0.1.0
     */
    private startPosition: number | null = null;

    /**
     * The factor by which the actual slide distance in pixels will be multiplied.
     *
     * @since 0.1.0
     */
    private swipeDistanceMultiplier: number;

    /**
     * The threshold value in pixels, which determines when automatic sliding should be triggered on swiping.
     *
     * @since 0.1.0
     */
    private swipeTransitionThreshold: number;

    init(): void {
        const isHorizontal = this.projector.getRuntime().getIsHorizontal();
        const swipe: string = this.configuration.getValue('swipe', 'false');

        if (swipe !== 'true') {
            return;
        }

        this.sliderElement = this.runtime.getSliderElement();
        this.swipeTransitionThreshold = this.configuration.getValue('swipeTransitionThreshold', 0);
        this.swipeDistanceMultiplier = this.configuration.getValue('swipeDistanceMultiplier', 1);

        const isPassive = isPassiveEventListenerSupported();
        const element = this.projector.getProjectorElement();

        element.addEventListener(
            'touchstart',
            (e: TouchEvent) => this.onSwipeStart(isHorizontal ? e.touches[0].clientX : e.touches[0].clientY),
            isPassive ? { passive: true } : false,
        );

        element.addEventListener(
            'touchmove',
            (e: TouchEvent) => this.onSwipeProgress(isHorizontal ? e.touches[0].clientX : e.touches[0].clientY),
            isPassive ? { passive: true } : false,
        );

        element.addEventListener('touchend', () => this.onSwipeEnd());

        element.addEventListener('mousedown', (e: MouseEvent) =>
            this.onSwipeStart(isHorizontal ? e.clientX : e.clientY),
        );

        element.addEventListener('mousemove', (e: MouseEvent) =>
            this.onSwipeProgress(isHorizontal ? e.clientX : e.clientY),
        );

        element.addEventListener('mouseleave', () => this.onSwipeEnd());

        element.addEventListener('mouseup', () => this.onSwipeEnd());
    }

    /**
     * Handles the conclusion of a mouse or touch navigation gesture event.
     *
     * @since 0.1.0
     */
    private onSwipeEnd(): void {
        this.startPosition = null;
        this.lastPosition = null;
        this.sliderElement.classList.remove(HtmlClass.SWIPING);
        this.bus.notify(BusEvent.TRANSITIONING_FINISHED);
    }

    /**
     * Invoked multiple times during a navigation gesture to perform essential record-keeping and coordinate
     * the slider's response accordingly.
     *
     * @since 0.1.0
     * @param position - The current mouse or finger position in pixels.
     */
    private onSwipeProgress(position: number): void {
        if (this.startPosition === null || this.lastPosition === null) {
            return;
        }

        const movement = position - this.lastPosition;
        const distance = position - this.startPosition;

        if (this.swipeTransitionThreshold && Math.abs(distance) > this.swipeTransitionThreshold) {
            this.onSwipeEnd();
            const isNextSlide = distance * this.rtlCoefficient < 0;
            this.projector.switch(isNextSlide ? '+1' : '-1');
            return;
        }

        this.lastPosition = position;
        this.projector.project(movement * this.swipeDistanceMultiplier, true);
    }

    /**
     * Handles the initiation of a mouse or touch-based gesture event.
     *
     * @since 0.1.0
     * @param position The starting position of the gesture in pixels.
     */
    private onSwipeStart(position: number): void {
        this.startPosition = position;
        this.lastPosition = position;
        this.rtlCoefficient = this.runtime.getDirectionCoefficient() * -1;
        this.sliderElement.classList.add(HtmlClass.SWIPING);
        this.bus.notify(BusEvent.TRANSITIONING_STARTED);
    }
}

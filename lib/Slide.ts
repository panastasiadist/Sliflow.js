/**
 * The Slide class encapsulates the behavior of a slide in the presentation. It allows for interaction with its
 * associated HTML element and provides relevant functionality.
 *
 * @since 0.1.0
 */
export default class Slide {
    /**
     * Indicates the slide's position relatively to current slide's position.
     *
     * @since 0.1.0
     */
    private currentPosition: number | null = null;

    /**
     * Represents the slide's HTMLElement.
     *
     * @since 0.1.0
     */
    private readonly element: HTMLElement;

    /**
     * Represents the height of the slide's HTMLElement in pixels.
     *
     * @since 0.1.0
     */
    private height: number = 0;

    /**
     * Indicates whether the slide is active or not.
     *
     * @since 0.1.0
     */
    private isActive: boolean = false;

    /**
     * Represents the translateX value of the slide's HTMLElement.
     *
     * @since 0.1.0
     */
    private offset: number = 0;

    /**
     * Represents the width of the slide's HTMLElement in pixels.
     *
     * @since 0.1.0
     */
    private width: number = 0;

    /**
     * Constructor for this class.
     *
     * @since 0.1.0
     * @param element - The HTML element representing the slide.
     */
    constructor(element: HTMLElement) {
        this.element = element;
    }

    /**
     * Retrieves the HTML element representing this slide.
     *
     * @since 0.1.0
     * @returns The HTML element associated with this slide.
     */
    getElement(): HTMLElement {
        return this.element;
    }

    /**
     * Returns whether the slide is considered available for projection or not.
     * A slide is considered active if it isn't hidden (i.e., CSS display property is not set to 'none').
     *
     * @since 0.1.0
     * @returns true if the slide is active; false otherwise.
     */
    getIsActive(): boolean {
        return this.isActive;
    }

    /**
     * Checks whether the slide is the current one.
     * A slide is considered current if it's active and its current position is 0.
     *
     * @since 0.1.0
     * @returns true if the slide is the current one; false otherwise.
     */
    getIsCurrent(): boolean {
        return this.isActive && this.currentPosition === 0;
    }

    /**
     * Sets the slide's position relative to the slide that's currently being displayed.
     * A position of 0 means the slide is the one currently being displayed.
     *
     * @since 0.1.0
     * @param position - The position of the slide.
     */
    setCurrentPosition(position: number): void {
        this.currentPosition = position;
    }

    /**
     * Adjusts the slide's active state based on the 'display' CSS property of its HTML element.
     * If the display property value is 'none', then the slide isn't active, and its current position is set to null.
     * Otherwise, the slide is marked as active.
     *
     * @since 0.1.0
     */
    setIsActive(): void {
        const isActive = window.getComputedStyle(this.element).display !== 'none';

        if (!isActive) {
            this.currentPosition = null;
        }

        this.isActive = isActive;
    }

    /**
     * Sets the width or height of the slide's HTML element.
     *
     * @since 0.1.0
     * @param amount - The value to set the width or height to.
     * @param isWidth - If true, the method sets the width; otherwise, it sets the height.
     */
    setLength(amount: number, isWidth: boolean): void {
        this.width = isWidth ? amount : 0;
        this.height = isWidth ? 0 : amount;
        this.element.style.width = this.width > 0 ? `${amount}px` : '';
        this.element.style.height = this.height > 0 ? `${amount}px` : '';
    }

    /**
     * Sets the horizontal or vertical offset of the slide's HTML element.
     * It modifies the 'transform' CSS property to translate the element by the specified amount of pixels.
     *
     * @since 0.1.0
     * @param offset - The amount of pixels to offset the slide by.
     * @param isX - If true, the method offsets the element horizontally (along the X-axis); otherwise, it translates it
     * vertically (along the Y-axis).
     */
    setOffset(offset: number, isX: boolean): void {
        if (offset !== this.offset) {
            this.element.style.transform = isX ? `translateX(${offset}px)` : `translateY(${offset}px)`;
            this.offset = offset;
        }
    }
}

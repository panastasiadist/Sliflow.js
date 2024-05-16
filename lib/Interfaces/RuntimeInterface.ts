/**
 * This interface should be implemented by a service that manages information regarding a slider's environment.
 *
 * @since 0.1.0
 */
export default interface RuntimeInterface {
    /**
     * Retrieves a coefficient used for internal computations that depend on various combinations of horizontal/vertical
     * and left-to-right/right-to-left operations. This coefficient is utilized to normalize the mathematical mechanics
     * of the slider, regardless of layout conditions.
     *
     * @since 0.1.0
     * @returns The coefficient.
     */
    getDirectionCoefficient(): 1 | -1;

    /**
     * Determines whether the slider operates in horizontal or vertical mode.
     * - In horizontal mode, slide transitions are left-to-right and right-to-left.
     * - In vertical mode, slide transitions are top-to-bottom and bottom-to-top.
     *
     * @since 0.1.0
     * @returns Returns true if the operation is horizontal, and false otherwise.
     */
    getIsHorizontal(): boolean;

    /**
     * Determines if the layout direction is right-to-left (RTL).
     *
     * @since 0.1.0
     * @returns True if the text direction is right-to-left, and false otherwise.
     */
    getIsRTL(): boolean;

    /**
     * Retrieves the primary HTML element which the slider operates on.
     *
     * @since 0.1.0
     * @returns The slider element.
     */
    getSliderElement(): HTMLElement;

    /**
     * Sets whether the layout direction is right-to-left (RTL) both during runtime and after initial loading.
     *
     * @since 0.1.0
     * @param isRTL - Indicates whether the component should be displayed in RTL direction.
     */
    setIsRTL(isRTL: boolean): void;
}

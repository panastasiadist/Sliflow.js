import RuntimeInterface from './Interfaces/RuntimeInterface';

/**
 * This class represents and delegates access to the runtime environment of the slider.
 *
 * @since 0.1.0
 */
export default class Runtime implements RuntimeInterface {
    /**
     * Constructor for this class.
     *
     * @since 0.1.0
     * @param element - The slider HTML element to associate with this runtime instance.
     * @param isRTL - Specifies whether to use a right-to-left layout.
     * @param isHorizontal - Specifies whether the slides are arranged horizontally. If this is false, the slides are
     * arranged vertically.
     */
    constructor(
        private readonly element: HTMLElement,
        private isRTL: boolean,
        private readonly isHorizontal: boolean,
    ) {}

    getDirectionCoefficient(): 1 | -1 {
        if (this.isHorizontal) {
            return this.isRTL ? 1 : -1;
        }

        // In vertical mode (top to bottom and vice versa), offsets are orientation indifferent.
        // As such, RTL adjustment is not required. Return the default.
        return -1;
    }

    getIsHorizontal(): boolean {
        return this.isHorizontal;
    }

    getIsRTL(): boolean {
        return this.isRTL;
    }

    getSliderElement(): HTMLElement {
        return this.element;
    }

    setIsRTL(isRTL: boolean): void {
        this.isRTL = isRTL;
    }
}

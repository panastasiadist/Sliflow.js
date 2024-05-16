import Slider from './Slider';

/**
 * Creates a new Slider instance for the specified HTML element and returns it.
 *
 * @since 0.1.0
 * @param element - The HTML element for which the new slider will be created.
 * @throws Error - If unable to create a Slider instance, for example, when not running in a browser environment or due
 * to the provided element not being properly structured or missing required child elements.
 */
function createSlider(element: HTMLElement): Slider {
    return new Slider(element);
}

export default {
    createSlider,
};

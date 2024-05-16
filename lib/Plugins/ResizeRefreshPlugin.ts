import PluginBase from '../Base/PluginBase';
import handleSuppressibleCallback from '../Utilities/handleSuppressibleCallback';

/**
 * Plugin that allows the Projector to become informed, should any change in the dimensions of the slider arise.
 *
 * @since 0.1.0
 */
export default class ResizeRefreshPlugin extends PluginBase {
    init(): void {
        // The callback is initially invoked due to the observe() function of the ResizeObserver, which reports the
        // original dimensions of the slider element. Disregard this initial invocation as it doesn't constitute a
        // genuine dimension/layout update.
        const observer = new ResizeObserver(handleSuppressibleCallback(() => this.onResizeEvent(), 1));
        observer.observe(this.runtime.getSliderElement());
    }

    /**
     * Handles resize events and prompts the Projector to execute the appropriate actions.
     *
     * @since 0.1.0
     */
    private onResizeEvent(): void {
        this.projector.setDimensions();
        this.projector.switch('+0');
    }
}

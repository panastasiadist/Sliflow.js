import PluginBase from '../Base/PluginBase';

/**
 * Plugin that facilitates automatic sliding transitions at regular intervals.
 *
 * @since 0.1.0
 */
export default class TimedTransitionPlugin extends PluginBase {
    init(): void {
        const element = this.runtime.getSliderElement();
        const interval = this.configuration.getValue<number>('timedTransitionInterval', 0);

        // A non-positive value, as in the default one, effectively disables automatic slide transitions.
        if (interval <= 0) {
            return;
        }

        // If set, a user-hover check on the slider is executed before proceeding with the transition,each time a slide
        // transition is to occur.
        const pauseOnHover = this.configuration.getValue<string>('timedTransitionHoverStrategy', '') === 'pause';

        let lastSetSlideIndex = -1;

        setInterval(() => {
            if (pauseOnHover && element.matches(':hover')) {
                return;
            }

            // If the last slider index set by this function differs from the active slide index, the active slide has
            // changed since the last function execution. Cancel the switch to grant some display time to the slide,
            // avoiding potential early switches to the next slide.
            if (lastSetSlideIndex !== -1 && lastSetSlideIndex !== this.projector.getCurrentSlideIndex()) {
                lastSetSlideIndex = this.projector.getCurrentSlideIndex();
                return;
            }

            this.projector.switch('+1');
            lastSetSlideIndex = this.projector.getCurrentSlideIndex();
        }, interval * 1000);
    }
}

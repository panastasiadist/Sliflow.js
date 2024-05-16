import BusEvent from '../Enums/BusEvent';
import PluginBase from '../Base/PluginBase';

/**
 * Plugin that provides functionality to transition between different slides.
 *
 * @since 0.1.0
 */
export default class NavigationPlugin extends PluginBase {
    init(): void {
        this.handleNavigationRequest = this.handleNavigationRequest.bind(this);

        const element = this.runtime.getSliderElement();

        this.refreshHandlers(element);

        this.bus.subscribe(BusEvent.SLIDES_UPDATED, () => {
            this.refreshHandlers(element);
        });
    }

    private handleNavigationRequest(event: Event): void {
        const element = event.target as HTMLElement;
        const targetSlide = element.getAttribute('data-sliflow-navigation-target');

        if (targetSlide) {
            this.projector.switch(targetSlide);
        }
    }

    private refreshHandlers(element: HTMLElement): void {
        element.querySelectorAll('[data-sliflow-navigation-target]').forEach((control) => {
            control.removeEventListener('click', this.handleNavigationRequest);
            control.addEventListener('click', this.handleNavigationRequest);
        });
    }
}

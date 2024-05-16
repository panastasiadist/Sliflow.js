import BusEvent from '../Enums/BusEvent';
import PluginBase from '../Base/PluginBase';
import isClassAttributeChanged from '../Utilities/isClassAttributeChanged';
import isStyleAttributeChanged from '../Utilities/isStyleAttributeChanged';
import handleSuppressibleCallback from '../Utilities/handleSuppressibleCallback';

/**
 * Plugin that observes the slider's HTML for any slide modifications and prompts the Projector to consider them.
 *
 * @since 0.1.0
 */
export default class SlideRefreshPlugin extends PluginBase {
    /**
     * Stores mappings of HTMLElement to MutationObserver objects used for bookkeeping purposes.
     *
     * @since 0.1.0
     */
    private elementToMutationObserver = new Map<HTMLElement, MutationObserver>();

    /**
     * Indicates whether a projection operation is currently happening.
     *
     * @since 0.1.0
     */
    private projecting = false;

    init(): void {
        this.bus.subscribe(BusEvent.TRANSITIONING_STARTED, () => {
            this.projecting = true;
        });

        this.bus.subscribe(BusEvent.TRANSITIONING_FINISHED, () => {
            this.projecting = false;
        });

        // Set up attribute mutation observation for all slides.
        this.projector.getSlides(false).forEach((slide) => {
            this.setSlideObservation(slide.getElement(), true);
        });

        // Respond to document / viewport resize events (like CSS adjustments).
        // Ignore the initial callback from the observe() function of the ResizeObserver, which reports the slider's
        // original dimensions.

        // Respond to document / viewport resize events (like CSS adjustments).
        // Ignore the initial callback from the observe() function of the ResizeObserver, which reports the slider's
        // original dimensions.
        const observer1 = new ResizeObserver(handleSuppressibleCallback(() => this.refresh(), 1));
        observer1.observe(document.documentElement);

        // Observe the stage element for any additions or removals of slides.
        const observer2 = new MutationObserver((records) => this.handleStageMutations(records));
        observer2.observe(this.projector.getStageElement() as Node, { childList: true });
    }

    /**
     * Processes a slide's attribute mutation event, reviews the event data, and determines whether the Projector should
     * refresh its state for the slides.
     *
     * @since 0.1.0
     * @param records - The array of mutation records.
     */
    private handleSlideMutations(records: MutationRecord[]): void {
        if (this.projecting) {
            // See refresh() for the rationale behind this check.
            return;
        }

        const attributeRecords = records.filter((record) => record.type === 'attributes');
        const classRecord = attributeRecords.find((record) => record.attributeName === 'class');
        const styleRecord = attributeRecords.find((record) => record.attributeName === 'style');

        if (
            (classRecord && isClassAttributeChanged(classRecord)) ||
            (styleRecord && isStyleAttributeChanged(styleRecord, ['display']))
        ) {
            this.refresh();
        }
    }

    /**
     * Deals with any additions or removals of slides, automatically enabling or disabling their attribute observation.
     * Calls the Projector to consider the new or removed slides.
     *
     * @since 0.1.0
     * @param records - The array of mutation records.
     */
    private handleStageMutations(records: MutationRecord[]): void {
        if (this.projecting) {
            // See refresh() for the rationale behind this check.
            return;
        }

        const childListRecords = records.filter((record) => record.type === 'childList');

        childListRecords.forEach((record) => {
            Array.from(record.addedNodes).forEach((node) => this.setSlideObservation(node as HTMLElement, true));
            Array.from(record.removedNodes).forEach((node) => this.setSlideObservation(node as HTMLElement, false));
        });

        this.refresh();

        this.bus.notify(BusEvent.SLIDES_UPDATED);
    }

    /**
     * Invoked when a slide is added, removed, or updated, and prompts the Projector to perform the necessary operations
     * to incorporate these changes.
     *
     * @since 0.1.0
     */
    private refresh(): void {
        // Don't request the Projector to carry out slide-related operations (which may impact performance or lead to
        // infinite function call recursion) while it's in the middle of a projection procedure.
        if (this.projecting) {
            return;
        }

        this.projector.setSlides();

        if (this.projector.getSlides().length === 0) {
            return;
        }

        this.projector.setDimensions();

        let index = this.projector.getSlides().findIndex((slide) => slide.getIsCurrent());

        // It's possible that index equals -1 when no "current" slide is found among the active slides. For instance,
        // this can happen when all slides are non-active upon initial slider load, before at least one of them becoming
        // active. If so, default to the first available active slide (index = 0).
        if (index < 0 || index >= this.projector.getSlides().length) {
            index = 0;
        }

        this.projector.switch(index);
    }

    /**
     * Enables or disables the observation of slide HTML elements for attribute changes that could necessitate a refresh
     * of the Projector's slide information.
     *
     * @since 0.1.0
     * @param element - The element to observe.
     * @param shouldBeObserved - Indicates whether observation should be enabled or disabled.
     */
    private setSlideObservation(element: HTMLElement, shouldBeObserved: boolean): void {
        if (shouldBeObserved) {
            const observer = new MutationObserver((records) => this.handleSlideMutations(records));

            observer.observe(element as Node, {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: ['class', 'style'],
            });

            this.elementToMutationObserver.set(element, observer);
        } else {
            // If a request to remove a MutationObserver from an element is made, this MutationObserver has definitely
            // been created and stored for this element previously. Disconnect and remove it.
            const observer = this.elementToMutationObserver.get(element) as MutationObserver;

            observer.disconnect();

            this.elementToMutationObserver.delete(element);
        }
    }
}

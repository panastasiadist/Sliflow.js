import PluginBase from '../Base/PluginBase';
import isClassAttributeChanged from '../Utilities/isClassAttributeChanged';
import isStyleAttributeChanged from '../Utilities/isStyleAttributeChanged';
import BusEvent from '../Enums/BusEvent';

/**
 * Plugin that allows the Projector to become informed should any changes in the text direction arise.
 *
 * @since 0.1.0
 */
export default class DirectionRefreshPlugin extends PluginBase {
    /**
     * @since 0.1.0
     */
    private ignoreNextMutation = false;

    /**
     * @since 0.1.0
     */
    private lastIsRTL = false;

    init(): void {
        this.lastIsRTL = getComputedStyle(this.runtime.getSliderElement()).direction === 'rtl';

        this.bus.subscribe(BusEvent.STATE_UPDATE_STARTED, () => {
            this.ignoreNextMutation = true;
        });

        this.bus.subscribe(BusEvent.STATE_UPDATE_FINISHED, () => {
            this.ignoreNextMutation = true;
        });

        // Observe the stage element for any changes in the contained slides.
        const observer = new MutationObserver((records: MutationRecord[]) => this.onDirectionChangeEvent(records));

        [document.documentElement, this.runtime.getSliderElement()].forEach((element) => {
            observer.observe(element, {
                attributes: true,
                attributeFilter: ['dir', 'class'],
            });
        });
    }

    /**
     * Handles attribute mutation events that could indicate that the slider should be informed of any changes in the
     * text direction.
     *
     * @since 0.1.0
     * @param records - An array of MutationRecord objects.
     */
    private onDirectionChangeEvent(records: MutationRecord[]): void {
        if (this.ignoreNextMutation) {
            // The main slider element's state class changes as part of the projection process.
            // We aren't interested in such changes, so avoid unnecessary processing.
            // As this function is called asynchronously by a MutationObserver after detecting a modification,
            // ignoreNextMutation has been set to true elsewhere in the code.
            this.ignoreNextMutation = false;
            return;
        }

        // This function will be called only if at least one of the following attributes appears to be updated.
        const classRecord = records.find((record) => record.attributeName === 'class');
        const styleRecord = records.find((record) => record.attributeName === 'style');
        const dirRecord = records.find((record) => record.attributeName === 'dir');

        const updated =
            (classRecord && isClassAttributeChanged(classRecord)) ||
            (styleRecord && isStyleAttributeChanged(styleRecord, ['direction'])) ||
            (dirRecord && dirRecord.oldValue !== (dirRecord.target as HTMLElement).getAttribute('dir'));

        if (!updated) {
            return;
        }

        // While something may have changed, it does not necessarily mean that the orientation has changed.
        const isRTL = getComputedStyle(this.runtime.getSliderElement()).direction === 'rtl';

        if (this.lastIsRTL === isRTL) {
            return;
        }

        // At least one attribute has changed in a way that necessitates a reevaluation of the slider's text direction.
        this.lastIsRTL = isRTL;
        this.runtime.setIsRTL(isRTL);
        this.projector.switch('+0');
    }
}

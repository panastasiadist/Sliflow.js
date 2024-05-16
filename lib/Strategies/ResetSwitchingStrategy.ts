import modulo from '../Utilities/modulo';
import SimpleSwitchingStrategy from './SimpleSwitchingStrategy';

/**
 * A slide-switching strategy that supports transitioning to the requested slide through a "jump" rather than looping
 * when an out-of-range slide index is requested.
 *
 * @since 0.1.0
 */
export default class ResetSwitchingStrategy extends SimpleSwitchingStrategy {
    switch(targetIndex: number): void {
        const slideCount = this.projector.getSlides().length;
        const finalTargetIndex = modulo(targetIndex, slideCount);

        super.switch(finalTargetIndex);
    }
}

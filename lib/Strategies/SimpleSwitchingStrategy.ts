import StrategyBase from '../Base/StrategyBase';
import SwitchingStrategyInterface from '../Interfaces/SwitchingStrategyInterface';

/**
 * Slide switching strategy that supports projecting only in-range slide indices. It disregards any indices that are
 * less than 0 or greater than the highest slide index available.
 *
 * @since 0.1.0
 */
export default class SimpleSwitchingStrategy extends StrategyBase implements SwitchingStrategyInterface {
    switch(targetIndex: number): void {
        const { projector } = this;
        const slideCount = projector.getSlides().length;
        let finalTargetIndex = targetIndex;

        if (targetIndex < 0) {
            finalTargetIndex = 0;
        } else if (targetIndex >= slideCount) {
            finalTargetIndex = slideCount - 1;
        }

        const coefficient = projector.getRuntime().getDirectionCoefficient();

        projector.project(finalTargetIndex * projector.getSlideLength() * coefficient, false);
        projector.setCurrentSlide(finalTargetIndex);
        projector.setCurrentSlideIndex(finalTargetIndex);
    }
}

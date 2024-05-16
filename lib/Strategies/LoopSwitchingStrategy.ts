import StrategyBase from '../Base/StrategyBase';
import SwitchingStrategyInterface from '../Interfaces/SwitchingStrategyInterface';

/**
 * A slide-switching strategy that accommodates continuous loop-based transitions between slides.
 *
 * @since 0.1.0
 */
export default class LoopSwitchingStrategy extends StrategyBase implements SwitchingStrategyInterface {
    switch(targetIndex: number): void {
        const { projector } = this;
        const coefficient = projector.getRuntime().getDirectionCoefficient();

        // Ensure there are enough slides to enable a projection.
        if (projector.getSlides().length > 1) {
            projector.project(targetIndex * projector.getSlideLength() * coefficient, false);
        }

        // Always invoke the projector to set the targetIndex in order for it to perform any necessary updates.
        // These updates become crucial when the active slides have altered since the last invocation of this function.
        projector.setCurrentSlide(targetIndex);
        projector.setCurrentSlideIndex(targetIndex);
    }
}

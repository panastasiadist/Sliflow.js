import modulo from '../Utilities/modulo';
import StrategyBase from '../Base/StrategyBase';
import ProjectionStrategyInterface from '../Interfaces/ProjectionStrategyInterface';

/**
 * A projection strategy capable of projecting virtual offsets where no real slides exist. This strategy emulates the
 * presence of real slide HTML elements at virtual offsets by dynamically adjusting their presentation position using
 * CSS transforms without actually duplicating their DOM elements.
 *
 * @since 0.1.0
 */
export default class LoopProjectionStrategy extends StrategyBase implements ProjectionStrategyInterface {
    /**
     * Represents the last offset projected by this strategy, used for record-keeping purposes.
     *
     * @since 0.1.0
     */
    private lastOffset: number = 0;

    project(offset: number): void {
        const { projector } = this;
        const isHorizontal = this.projector.getRuntime().getIsHorizontal();

        // Make sure that all non-active slides are reset to an offset of 0, in order to have them prepared in case they
        // become active again.
        projector
            .getSlides(false)
            .filter((slide) => !slide.getIsActive())
            .forEach((slide) => slide.setOffset(0, isHorizontal));

        const slides = projector.getSlides();

        if (slides.length === 0) {
            return;
        }

        const coefficient = this.projector.getRuntime().getDirectionCoefficient();
        const isForward = offset * coefficient > this.lastOffset * coefficient;
        const targetIndex = this.getIndex(offset, isForward, true);

        if (Number.isNaN(targetIndex)) {
            // This can happen only when (unexpectedly) slides' length is 0.
            // In this case, avoid doing any further processing and early exit.
            return;
        }

        const virtualTargetIndex = this.getIndex(offset, isForward, false);
        const realOffset = targetIndex * projector.getSlideLength();
        const virtualOffset = virtualTargetIndex * projector.getSlideLength();
        const finalOffset = (realOffset - virtualOffset) * coefficient;

        slides[targetIndex].setOffset(finalOffset, this.projector.getRuntime().getIsHorizontal());
        projector.setOffset(offset);

        this.lastOffset = offset;
    }

    /**
     * Computes the index of a slide corresponding to a given offset. The offset could be 'virtual', signifying it
     * doesn't exist due to the space occupied by the real HTML slide elements in their natural position. Nonetheless,
     * it represents an offset where the slide indicated by the index will be visible once appropriately projected.
     *
     * @since 0.1.0
     * @param offset - The offset value to calculate the index for.
     * @param isForwardMovement - A flag indicating if the movement or projection is in the forward direction.
     * @param isReal - A flag indicating if the returned index represents a real or virtual index.
     * @returns The computed index value.
     */
    private getIndex(offset: number, isForwardMovement: boolean, isReal: boolean): number {
        const coveredOffset = offset * this.projector.getRuntime().getDirectionCoefficient();
        const coveredSlideCount = coveredOffset / this.projector.getSlideLength();
        const slideCount = this.projector.getSlides().length;
        const virtualIndex = isForwardMovement ? Math.ceil(coveredSlideCount) : Math.floor(coveredSlideCount);

        return isReal ? modulo(virtualIndex, slideCount) : virtualIndex;
    }
}

import StrategyBase from '../Base/StrategyBase';
import ProjectionStrategyInterface from '../Interfaces/ProjectionStrategyInterface';

/**
 * A projection strategy that only projects offsets where real slides are present. It disregards any virtual offsets.
 *
 * @since 0.1.0
 */
export default class SimpleProjectionStrategy extends StrategyBase implements ProjectionStrategyInterface {
    project(offset: number): void {
        const { projector } = this;
        const isRTL = projector.getRuntime().getIsRTL();
        const isHorizontal = projector.getRuntime().getIsHorizontal();
        const maxOffset = isRTL && isHorizontal ? projector.getOffsetInterval() : 0;
        const minOffset = isRTL && isHorizontal ? 0 : projector.getOffsetInterval() * -1;

        if (offset < minOffset || offset > maxOffset) {
            return;
        }

        projector.setOffset(offset);
    }
}

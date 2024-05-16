/**
 * This interface should be implemented by projection-related strategy classes.
 *
 * @since 0.1.0
 */
export default interface ProjectionStrategyInterface {
    /**
     * Coordinates the Projector to project the region of the slide strip that corresponds to the given offset.
     *
     * @since 0.1.0
     * @param offset - The offset to be projected.
     */
    project(offset: number): void;
}

/**
 * This interface should be implemented by slide-switching-related strategy classes.
 * The subclasses will provide ways of translating the requested slide index to an actual slide to project
 *
 * @since 0.1.0
 */
export default interface SwitchingStrategyInterface {
    /**
     * Coordinates the Projector to project a particular slide that corresponds to the given offset.
     *
     * @since 0.1.0
     * @param slideIndex - The index of the slide to project.
     */
    switch(slideIndex: number): void;
}

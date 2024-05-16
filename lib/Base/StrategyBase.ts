import ProjectorInterface from '../Interfaces/ProjectorInterface';

/**
 * This class should be inherited by Projector-related strategy classes.
 *
 * @since 0.1.0
 */
export default abstract class StrategyBase {
    /**
     * Constructor for this class.
     *
     * @since 0.1.0
     * @param projector - The projector service to be used by subclasses.
     */
    constructor(protected readonly projector: ProjectorInterface) {}
}

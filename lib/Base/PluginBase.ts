import BusInterface from '../Interfaces/BusInterface';
import ConfigurationInterface from '../Interfaces/ConfigurationInterface';
import RuntimeInterface from '../Interfaces/RuntimeInterface';
import ProjectorInterface from '../Interfaces/ProjectorInterface';

/**
 * This class should be inherited by plugin classes.
 *
 * @since 0.1.0
 */
export default abstract class PluginBase {
    /**
     * Constructor for this class.
     *
     * @since 0.1.0
     * @param runtime - The runtime service to be used by subclasses.
     * @param configuration - The configuration service to be used by subclasses.
     * @param projector - The projector service to be used by subclasses.
     * @param bus - The bus service to be used by subclasses.
     */
    constructor(
        protected readonly runtime: RuntimeInterface,
        protected readonly configuration: ConfigurationInterface,
        protected readonly projector: ProjectorInterface,
        protected readonly bus: BusInterface,
    ) {}

    /**
     * This method should be implemented by subclasses.
     * It acts as a means for a plugin to carry out initialization tasks.
     *
     * @since 0.1.0
     */
    abstract init(): void;
}

import ConfigurationInterface from './Interfaces/ConfigurationInterface';
import ConfigurationLoadingStrategyInterface from './Interfaces/ConfigurationLoadingStrategyInterface';

/**
 * This class provides a unified interface to interact with various configuration values.
 *
 * @since 0.1.0
 */
export default class Configuration implements ConfigurationInterface {
    /**
     * A  map that stores configuration values in key-value pairs.
     *
     * @since 0.1.0
     */
    private readonly configuration: Record<string, unknown> = {};

    /**
     * Constructor for this class.
     * It aggregates configurations from multiple loading strategies into one configuration map.
     *
     * @since 0.1.0
     */
    constructor(strategies: ConfigurationLoadingStrategyInterface[]) {
        this.configuration = strategies.reduce(
            (config, strategy) => ({ ...config, ...strategy.getConfiguration() }),
            {} as Record<string, unknown>,
        );
    }

    getValue<T>(key: string, defaultValue: T): T {
        const value = this.configuration[key];
        return typeof value !== 'undefined' ? (value as T) : defaultValue;
    }
}

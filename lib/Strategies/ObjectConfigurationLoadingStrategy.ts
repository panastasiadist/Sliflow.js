import ConfigurationLoadingStrategyInterface from '../Interfaces/ConfigurationLoadingStrategyInterface';

/**
 * Slider configuration loading strategy that leverages a key-value pair structure to provide configuration.
 *
 * @since 0.1.0
 */
export default class ObjectConfigurationLoadingStrategy implements ConfigurationLoadingStrategyInterface {
    constructor(private readonly dictionary: Record<string, unknown>) {}

    getConfiguration(): Record<string, unknown> {
        return this.dictionary;
    }
}

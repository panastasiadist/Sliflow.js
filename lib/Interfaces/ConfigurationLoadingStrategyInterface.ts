/**
 * This interface should be implemented by a configuration loading strategy.
 */
export default interface ConfigurationLoadingStrategyInterface {
    /**
     * Retrieves the configuration settings.
     *
     * @since 0.1.0
     * @returns The configuration settings represented as a key-value pair object.
     */
    getConfiguration(): Record<string, unknown>;
}

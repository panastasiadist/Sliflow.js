/**
 * This interface should be implemented by a configuration service.
 *
 * @since 0.1.0
 */
export default interface ConfigurationInterface {
    /**
     * Returns the configuration value associated with the given key, or the defaultValue if the key is not found.
     *
     * @since 0.1.0
     * @param key - The configuration key to return a value for.
     * @param defaultValue - The value to return if the key is not found.
     * @returns The value associated with the key, or the defaultValue if the key is not found.
     */
    getValue<T>(key: string, defaultValue: T): T;
}

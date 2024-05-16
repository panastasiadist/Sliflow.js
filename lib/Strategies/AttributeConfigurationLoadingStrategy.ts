import ConfigurationLoadingStrategyInterface from '../Interfaces/ConfigurationLoadingStrategyInterface';

/**
 * Slider configuration loading strategy that parses custom HTML attributes present on the main HTML element with the
 * 'data-sliflow-' prefix, to provide configuration.
 *
 * @since 0.1.0
 */
export default class AttributeConfigurationLoadingStrategy implements ConfigurationLoadingStrategyInterface {
    /**
     * Constructor for this class.
     *
     * @since 0.1.0
     * @param element - The HTML element whose HTML attributes will be parsed as configuration parameters.
     */
    constructor(private readonly element: HTMLElement) {}

    getConfiguration(): Record<string, unknown> {
        const attributeNameTemplate = 'data-sliflow-';

        return this.element
            .getAttributeNames()
            .filter((item) => item.startsWith(attributeNameTemplate))
            .reduce(
                (acc, name) => {
                    const key = name
                        .substring(attributeNameTemplate.length)
                        .replace(/-[a-z]/g, (match) => match.toUpperCase().replace('-', ''));

                    const value = this.element.getAttribute(name);

                    if (value) {
                        acc[key] = value;
                    }

                    return acc;
                },
                {} as Record<string, string>,
            );
    }
}

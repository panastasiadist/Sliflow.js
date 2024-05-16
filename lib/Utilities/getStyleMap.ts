/**
 * Parses a style string into a Map, where each key-value pair represents a style property and its corresponding value.
 *
 * @since 0.1.0
 * @param styleString - A string of CSS styles to parse.
 * @returns A Map where the keys are style properties, and the values are the respective CSS values.
 */
export default function getStyleMap(styleString: string): Map<string, string> {
    const map = new Map<string, string>();

    styleString.split(';').forEach((rule) => {
        const [property, value] = rule.split(':').map((part) => part.trim());
        if (property && value) {
            map.set(property, value);
        }
    });

    return map;
}

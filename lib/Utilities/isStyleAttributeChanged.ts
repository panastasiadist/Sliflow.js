import getStyleMap from './getStyleMap';

/**
 * Checks if specific style properties of an element have been modified according to a MutationRecord.
 *
 * @since 0.1.0
 * @param record - The MutationRecord. Contains information about changes to a DOM node.
 * @param properties - An array of CSS property names (in camelCase format) to check for modifications.
 * @returns A boolean indicating whether any of the specified CSS properties have been changed. Returns true if changes
 * were found, otherwise false.
 */
export default function isStyleAttributeChanged(record: MutationRecord, properties: string[]): boolean {
    const oldStyle = getStyleMap(record.oldValue || '');
    const currentStyle = getStyleMap((record.target as HTMLElement).getAttribute('style') || '');

    return !!properties.find((property) => oldStyle.get(property) !== currentStyle.get(property));
}

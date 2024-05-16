import extractForeignClasses from './extractForeignClasses';

/**
 * Checks if non-reserved CSS classes of an element have changed based on a MutationRecord.
 *
 * @since 0.1.0
 * @param record - The MutationRecord to be analyzed.
 * @returns A boolean indicating whether non-reserved CSS classes have been added or removed. Returns true if there was
 * a change, false otherwise.
 */
export default function isClassAttributeChanged(record: MutationRecord): boolean {
    const oldItems = extractForeignClasses(record.oldValue || '');
    const newItems = extractForeignClasses((record.target as HTMLElement).getAttribute('class') || '');

    return (
        newItems.filter((x) => !oldItems.includes(x)).length > 0 ||
        oldItems.filter((x) => !newItems.includes(x)).length > 0
    );
}

/**
 * Extracts all CSS classes from the given string, excluding any classes that are reserved or used by the slider.
 *
 * @since 0.1.0
 * @param classValue - A string of classes from which classes should be extracted.
 * @returns An array of foreign (non-slider related) classes extracted from the provided class string.
 */
export default function extractForeignClasses(classValue: string): string[] {
    return classValue
        .split(' ')
        .map((c) => c.trim())
        .filter((c) => c.length && !c.startsWith('sliflow'));
}

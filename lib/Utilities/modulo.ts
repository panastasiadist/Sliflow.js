/**
 * Calculates the modulo of a given number and a divisor. This specific implementation also works correctly with
 * negative numbers, unlike JavaScript's standard modulus operator (%).
 *
 * @since 0.1.0
 * @param divided - The dividend (the number to be divided).
 * @param divisor - The divisor (the number by which the dividend will be divided).
 * @returns The modulo (remainder of the division) of the dividend by the divisor.
 * Returns a positive value in all cases.
 */
export default function modulo(divided: number, divisor: number): number {
    if (divided >= 0) {
        return divided % divisor;
    }

    let d = Math.abs(divided);
    d %= divisor;
    d = divisor - d;
    d %= divisor;

    return d;
}

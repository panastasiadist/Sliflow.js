/**
 * Creates a callback wrapper that suppresses the initial set of calls to the enclosed callback function. The number of
 * suppressed calls is controlled by a provided parameter.
 *
 * @since 0.1.0
 * @param callback The target callback function to be called after the suppression count is reached.
 * @param suppressionCount The number of initial calls to the target callback to be suppressed. Defaults to 0.
 * @returns A wrapped callback function that will suppress the first 'suppressionCount' calls before invoking the
 * original callback function.
 */
export default function handleSuppressibleCallback<T extends Function>(callback: T, suppressionCount: number = 0) {
    let count = 0;
    // eslint-disable-next-line func-names
    return function () {
        if (suppressionCount > 0 && count < suppressionCount) {
            count += 1;
            return;
        }

        callback();
    };
}

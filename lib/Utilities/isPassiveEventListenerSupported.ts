/**
 * Verifies if the use of passive event listeners is supported in the current browser environment. Passive listeners
 * improve scrolling performance by not calling `preventDefault` on `touch` and `wheel` events.
 *
 * @since 0.1.0
 * @return A boolean value indicating whether passive event listeners are supported (true) or not (false).
 */
export default function isPassiveEventListenerSupported(): boolean {
    let supported = false;

    try {
        const options = {
            get passive() {
                supported = true;
                return false;
            },
        };

        const callback = () => {};

        window.addEventListener('touchstart', callback, options);
        window.removeEventListener('touchstart', callback);
    } catch (err) {
        supported = false;
    }

    return supported;
}

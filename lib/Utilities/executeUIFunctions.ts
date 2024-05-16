type FunctionCallback = () => void;

/**
 * Executes an array of functions sequentially before each browser repaint. Optionally, it can notify the caller when
 * all provided functions have been executed by using a given callback.
 *
 * @since 0.1.0
 * @param functionsToRun - An array of functions to be executed sequentially.
 * @param onFinishedCallback - An optional callback function to be invoked after executing all the provided functions.
 */
export default function executeUIFunctions(
    functionsToRun: FunctionCallback[],
    onFinishedCallback: FunctionCallback | undefined = undefined,
) {
    requestAnimationFrame(() => {
        if (functionsToRun.length === 0) {
            if (typeof onFinishedCallback !== 'undefined') {
                onFinishedCallback();
            }
            return;
        }

        functionsToRun[0]();

        executeUIFunctions(functionsToRun.slice(1), onFinishedCallback);
    });
}

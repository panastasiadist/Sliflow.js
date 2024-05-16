type MutationObserverCallback = (records: MutationRecord[], observer: MutationObserver) => void;

interface ObservationData {
    callback: MutationObserverCallback;
    observer: MutationObserver;
}

const observedElementToData = new Map<HTMLElement, ObservationData[]>();

export function fireMutationObserverCallbacks(element: HTMLElement, records: MutationRecord[]): void {
    observedElementToData.get(element)?.forEach((data) => data.callback(records, data.observer));
}

export function resetMutationObserverCallbacks(): void {
    observedElementToData.clear();
}

export function createMutationRecord(
    type: 'childList' | 'attributes',
    target: HTMLElement,
    attributeName: string | null = null,
    addedNode: HTMLElement | null = null,
    removedNode: HTMLElement | null = null,
    oldValue: string | null = null,
): MutationRecord {
    const addedNodes = (
        addedNode
            ? (document.createDocumentFragment().appendChild(addedNode).parentNode as HTMLElement)
            : document.createDocumentFragment()
    ).querySelectorAll('*');

    const removedNodes = (
        removedNode
            ? (document.createDocumentFragment().appendChild(removedNode).parentNode as HTMLElement)
            : document.createDocumentFragment()
    ).querySelectorAll('*');

    return {
        type,
        target,
        addedNodes,
        removedNodes,
        previousSibling: null,
        nextSibling: null,
        attributeName,
        attributeNamespace: null,
        oldValue,
    };
}

class MutationObserver {
    constructor(public callback: MutationObserverCallback) {}

    disconnect() {
        observedElementToData.forEach((data, element) => {
            observedElementToData.set(
                element,
                data.filter((d) => d.observer !== this),
            );
        });
    }

    observe(element: HTMLElement) {
        observedElementToData.set(element, [
            ...(observedElementToData.get(element) || []),
            {
                callback: this.callback,
                observer: this,
            },
        ]);
    }

    // eslint-disable-next-line class-methods-use-this
    takeRecords(): MutationRecord[] {
        return [];
    }
}

window.MutationObserver = MutationObserver;

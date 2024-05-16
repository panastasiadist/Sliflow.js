type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ObservationData {
    callback: ResizeObserverCallback;
    observer: ResizeObserver;
}

const observedElementToData = new Map<HTMLElement, ObservationData[]>();

export function fireResizeObserverCallbacks(element: HTMLElement, width: number, height: number) {
    observedElementToData.get(element)?.forEach((data) =>
        data.callback(
            [
                {
                    target: element,
                    borderBoxSize: [
                        {
                            inlineSize: width,
                            blockSize: height,
                        },
                    ],
                    contentBoxSize: [
                        {
                            inlineSize: width,
                            blockSize: height,
                        },
                    ],
                    devicePixelContentBoxSize: [
                        {
                            inlineSize: width,
                            blockSize: height,
                        },
                    ],
                    contentRect: {
                        width,
                        height,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                        x: 0,
                        y: 0,
                        toJSON(): string {
                            return '{}';
                        },
                    },
                },
            ],
            data.observer,
        ),
    );
}

export function resetResizeObserverCallbacks() {
    observedElementToData.clear();
}

class ResizeObserver {
    constructor(private callback: ResizeObserverCallback) {}

    disconnect(): void {
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

        const rect = element.getBoundingClientRect();

        // The real ResizeObserver fires a callback as long as observe() is called.
        fireResizeObserverCallbacks(element, rect.width, rect.height);
    }

    unobserve(element: HTMLElement) {
        const data = observedElementToData.get(element) || [];

        observedElementToData.set(
            element,
            data.filter((d) => d.observer !== this),
        );
    }
}

window.ResizeObserver = ResizeObserver;

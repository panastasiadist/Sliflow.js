import BusEvent from './Enums/BusEvent';
import BusInterface, { BusListenerFunction } from './Interfaces/BusInterface';

/**
 * This class represents a simple event bus. It manages subscriptions to specific events and allows triggering these
 * events along with executing associated callback functions (event listeners).
 *
 * @since 0.1.0
 */
export default class Bus implements BusInterface {
    /**
     * A map where each property key is an event type, and the corresponding value is an array with all the listener
     * functions subscribed to that event.
     *
     * @since 0.1.0
     */
    private eventTypeToListenerFunctions: Record<string, BusListenerFunction[]> = {};

    public notify(eventType: BusEvent): void {
        this.getEventTypeFunctions(eventType).forEach((func: BusListenerFunction) => func(eventType));
    }

    public subscribe(eventType: BusEvent, listenerFunction: BusListenerFunction): void {
        this.getEventTypeFunctions(eventType).push(listenerFunction);
    }

    /**
     * Retrieves an array of listener functions associated with a specific event type
     *
     * @since 0.1.0
     * @param eventType - The event type to fetch the listener functions for.
     * @returns The array of listener functions associated with the given event type.
     */
    private getEventTypeFunctions(eventType: string): BusListenerFunction[] {
        if (!this.eventTypeToListenerFunctions[eventType]) {
            this.eventTypeToListenerFunctions[eventType] = [];
        }

        return this.eventTypeToListenerFunctions[eventType];
    }
}

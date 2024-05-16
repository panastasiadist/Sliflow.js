import BusEvent from '../Enums/BusEvent';

/**
 * Represents a listener function for bus events.
 *
 * @since 0.1.0
 */
export type BusListenerFunction = (eventType: BusEvent) => void;

/**
 * This interface should be implemented by a message bus service.
 *
 * @since 0.1.0
 */
export default interface BusInterface {
    /**
     * Notifies listeners about the occurrence of a specific event.
     *
     * @since 0.1.0
     * @param eventType - The type of event being communicated.
     */
    notify(eventType: BusEvent): void;

    /**
     * Subscribes a listener function to a specific event type.
     *
     * @since 0.1.0
     * @param eventType - The type of event to subscribe to.
     * @param listenerFunction - The listener function to be invoked when the event occurs.
     */
    subscribe(eventType: BusEvent, listenerFunction: BusListenerFunction): void;
}

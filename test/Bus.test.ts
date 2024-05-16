import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import Bus from '../lib/Bus';
import BusEvent from '../lib/Enums/BusEvent';
import { BusListenerFunction } from '../lib/Interfaces/BusInterface';

type EventFunction = [BusEvent, BusListenerFunction];

describe('Bus', () => {
    let log: number[];
    let bus: Bus;
    let subscriberFn1: BusListenerFunction;
    let subscriberFn2: BusListenerFunction;

    function executeScenario(eventFunctions: EventFunction[], eventToNotify: BusEvent) {
        eventFunctions.forEach(([event, fn]) => {
            bus.subscribe(event, fn);
        });

        bus.notify(eventToNotify);
    }

    beforeEach(() => {
        log = [];
        bus = new Bus();
        subscriberFn1 = jest.fn(() => log.push(1));
        subscriberFn2 = jest.fn(() => log.push(2));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should notify all subscribers in the order they have subscribed', () => {
        executeScenario(
            [
                [BusEvent.TRANSITIONING_STARTED, subscriberFn1],
                [BusEvent.TRANSITIONING_STARTED, subscriberFn2],
            ],
            BusEvent.TRANSITIONING_STARTED,
        );

        expect(subscriberFn1).toHaveBeenCalledTimes(1);
        expect(subscriberFn2).toHaveBeenCalledTimes(1);
        expect(log).toEqual([1, 2]);
    });

    it('should notify the appropriate subscribers', () => {
        executeScenario(
            [
                [BusEvent.TRANSITIONING_STARTED, subscriberFn1],
                [BusEvent.TRANSITIONING_FINISHED, subscriberFn2],
            ],
            BusEvent.TRANSITIONING_STARTED,
        );

        expect(subscriberFn1).toHaveBeenCalledTimes(1);
        expect(subscriberFn2).toHaveBeenCalledTimes(0);
    });
});

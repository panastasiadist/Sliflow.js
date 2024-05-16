import { ConfigurationSet } from '../types';

export default function calculateConfigurationSetVariationCount(set: ConfigurationSet): number {
    const lengths: number[] = [];

    Object.values(set).forEach((possibleValues) => {
        lengths.push(possibleValues.length);
    });

    return Math.min(...lengths);
}

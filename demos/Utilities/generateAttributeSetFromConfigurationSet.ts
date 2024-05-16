import { AttributeSet, ConfigurationSet } from '../types';

export default function generateAttributeSetFromConfigurationSet(
    set: ConfigurationSet,
    valueIndex: number,
): AttributeSet {
    const attributes: AttributeSet = {};

    Object.entries(set).forEach(([key, possibleValues]) => {
        if (possibleValues[valueIndex]) {
            attributes[key] = possibleValues[valueIndex];
        }
    });

    return attributes;
}

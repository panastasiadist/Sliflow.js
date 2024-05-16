import { AttributeSet, ConfigurationSet } from '../types';
import calculateConfigurationSetVariationCount from './calculateConfigurationSetVariationCount';
import generateAttributeSetFromConfigurationSet from './generateAttributeSetFromConfigurationSet';

export default function generateAttributeSets(
    configurationSets: ConfigurationSet[],
    parentAttributeSet: AttributeSet = {},
): AttributeSet[] {
    if (configurationSets.length === 0) {
        return [parentAttributeSet];
    }

    const attributeSets: AttributeSet[] = [];
    const configurationSet = configurationSets[0];
    const configurationSetVariationCount = calculateConfigurationSetVariationCount(configurationSet);

    for (let index = 0; index < configurationSetVariationCount; index += 1) {
        const attributesObject = generateAttributeSetFromConfigurationSet(configurationSet, index);
        const attributeSet = { ...parentAttributeSet, ...attributesObject };
        attributeSets.push(...generateAttributeSets(configurationSets.slice(1), attributeSet));
    }

    return attributeSets;
}

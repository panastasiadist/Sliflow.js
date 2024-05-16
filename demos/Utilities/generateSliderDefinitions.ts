import generateAttributeSets from './generateAttributeSets';
import { ConfigurationSet } from '../types';

export default function generateSliderDefinitions(configurations: ConfigurationSet[]) {
    const attributeSets = generateAttributeSets(configurations);

    attributeSets.sort((a, b) => Object.keys(a).length - Object.keys(b).length);

    return attributeSets.map((combination) => ({
        attributes: combination,
    }));
}

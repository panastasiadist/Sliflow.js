import { describe, expect, it } from '@jest/globals';
import extractForeignClasses from '../../lib/Utilities/extractForeignClasses';
import HtmlClass from '../../lib/Enums/HtmlClass';

type Scenario = [string, string[]];

describe('extractForeignClasses', () => {
    const scenarios: Scenario[] = [
        [`class1 class2 ${HtmlClass.CURRENT}`, ['class1', 'class2']],
        [`${HtmlClass.READY} class1 class2 ${HtmlClass.SLIDE}`, ['class1', 'class2']],
        [`${HtmlClass.STAGE} class1 class2 ${HtmlClass.PROJECTOR}   class3`, ['class1', 'class2', 'class3']],
    ];

    scenarios.forEach((scenario) => {
        const c = scenario[1].join(', ');
        it(`should extract the classes ${c} from the class string '${scenario[0]}'`, () => {
            // Execute & Verify
            expect(extractForeignClasses(scenario[0])).toEqual(scenario[1]);
        });
    });
});

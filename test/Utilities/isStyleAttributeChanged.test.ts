import { describe, expect, it } from '@jest/globals';
import { createMutationRecord } from '../__mocks__/MutationObserver';
import isStyleAttributeChanged from '../../lib/Utilities/isStyleAttributeChanged';

describe('isStyleAttributeChanged', () => {
    it.each([
        [false, 'display:none', 'display:none', []],
        [false, 'display:none', 'display:none', ['display']],
        [false, 'display:none', 'display:none', ['color']],
        [false, 'display:none', 'display:block', ['border']],
        [true, 'display:none', 'display:block', ['display']],
        [false, 'display:none', 'display:none; color:red', []],
        [false, 'display:none; color:red', 'display:none', ['display']],
        [true, 'display:none', 'display:none; color:black', ['color']],
        [true, 'display:none; border:none', 'display:block', ['border']],
        [true, 'display:none; border:none', 'display:none: border: solid', ['display', 'border']],
    ])(
        "should return %s when style is changed from '%s' to '%s'",
        (isChanged: boolean, sourceStyle: string, targetStyle: string, properties: string[]) => {
            const element = document.createElement('div');
            element.setAttribute('style', targetStyle);
            const record = createMutationRecord('attributes', element, 'style', null, null, sourceStyle);
            expect(isStyleAttributeChanged(record, properties)).toEqual(isChanged);
        },
    );
});

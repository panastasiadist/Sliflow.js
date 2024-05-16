import { describe, expect, it } from '@jest/globals';
import { createMutationRecord } from '../__mocks__/MutationObserver';
import isClassAttributeChanged from '../../lib/Utilities/isClassAttributeChanged';
import HtmlClass from '../../lib/Enums/HtmlClass';

describe('isClassAttributeChanged', () => {
    it.each([
        [false, 'class1', 'class1'],
        [true, 'class1', 'class1 class2'],
        [false, 'class1', `class1 ${HtmlClass.READY}`],
        [true, `class1 ${HtmlClass.CURRENT} ${HtmlClass.STAGE}`, `class2 ${HtmlClass.READY}`],
        [false, `${HtmlClass.CURRENT} ${HtmlClass.STAGE}`, `${HtmlClass.CURRENT} ${HtmlClass.STAGE}`],
    ])(
        "should return %s when class is changed from '%s' to '%s'",
        (isChanged: boolean, sourceClass: string, targetClass: string) => {
            const element = document.createElement('div');
            element.setAttribute('class', targetClass);
            const record = createMutationRecord('attributes', element, 'class', null, null, sourceClass);
            expect(isClassAttributeChanged(record)).toEqual(isChanged);
        },
    );
});

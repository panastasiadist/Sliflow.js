import { describe, expect, it, beforeEach } from '@jest/globals';
import AttributeConfigurationLoadingStrategy from '../../lib/Strategies/AttributeConfigurationLoadingStrategy';

describe('AttributeConfigurationLoadingStrategy', () => {
    type Rule = [string, Record<string, string>, Record<string, string>];

    const attributePrefix = 'data-sliflow-';
    let element: HTMLElement;
    let strategy: AttributeConfigurationLoadingStrategy;

    function setAttributes(attributes: { [key: string]: string }) {
        Object.keys(attributes).forEach((attribute: string) => {
            element.setAttribute(attribute, attributes[attribute]);
        });
    }

    beforeEach(() => {
        element = document.createElement('div');
        strategy = new AttributeConfigurationLoadingStrategy(element);
    });

    describe('getConfiguration', () => {
        const rules: Rule[] = [
            ['should return empty object if there are no attributes', {}, {}],
            ['should handle attributes with empty values', { [`${attributePrefix}width`]: '' }, {}],
            [
                `should ignore attributes that do not start with a ${attributePrefix} prefix`,
                { 'data-random-width': '200' },
                {},
            ],
            [
                'should correctly map camelCase attribute names',
                { [`${attributePrefix}image-height`]: '200' },
                { imageHeight: '200' },
            ],
            [
                'should handle mix of valid and invalid attributes',
                {
                    'data-random-width': '200',
                    [`${attributePrefix}width`]: '1000',
                    [`${attributePrefix}height`]: '800',
                    [`${attributePrefix}image-height`]: '2000',
                },
                {
                    width: '1000',
                    height: '800',
                    imageHeight: '2000',
                },
            ],
        ];

        it.each<Rule>(rules)(
            '%s',
            (_testDescription: string, attributes: Record<string, string>, expectedResult: Record<string, string>) => {
                // Setup
                setAttributes(attributes);

                // Execute & Verify
                expect(strategy.getConfiguration()).toEqual(expectedResult);
            },
        );
    });
});

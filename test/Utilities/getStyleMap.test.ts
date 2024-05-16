import { describe, expect, it } from '@jest/globals';
import getStyleMap from '../../lib/Utilities/getStyleMap';

type Scenario = [string, Map<string, string>];

describe('extractForeignClasses', () => {
    const scenarios: Scenario[] = [
        ['display:none', new Map<string, string>(Object.entries({ display: 'none' }))],
        [
            'display:none; color:red',
            new Map<string, string>(
                Object.entries({
                    display: 'none',
                    color: 'red',
                }),
            ),
        ],
        [
            'display:none; color:green; invalid',
            new Map<string, string>(
                Object.entries({
                    display: 'none',
                    color: 'green',
                }),
            ),
        ],
        [
            'display:none; color:green; invalid; border: none;',
            new Map<string, string>(
                Object.entries({
                    display: 'none',
                    color: 'green',
                    border: 'none',
                }),
            ),
        ],
    ];

    scenarios.forEach((scenario) => {
        it(`should correctly extract the style properties from the string '${scenario[0]}'`, () => {
            // Execute & Verify
            expect(getStyleMap(scenario[0])).toEqual(scenario[1]);
        });
    });
});

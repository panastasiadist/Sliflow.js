export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },
    moduleNameMapper: {
        '\\.(css)$': '<rootDir>/test/__mocks__/Style.ts',
    },
    setupFiles: [
        '<rootDir>/test/__mocks__/ResizeObserver.ts',
        '<rootDir>/test/__mocks__/MutationObserver.ts',
        '<rootDir>/test/__mocks__/requestAnimationFrame.ts',
    ],
};

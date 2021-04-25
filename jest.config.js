module.exports = {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": [
        "<rootDir>/setupJest.ts"
    ],
    "testPathIgnorePatterns": [
        "<rootDir>/node_modules/",
        "<rootDir>/dist/",
        "<rootDir>/src/test.ts"
    ],
    "globals": {
        "ts-jest": {
            "tsConfig": "<rootDir>/tsconfig.spec.json",
            "stringifyContentPathRegex": "\\.html$",
            "astTransformers": {
                "before": [
                    "jest-preset-angular/build/InlineFilesTransformer",
                    "jest-preset-angular/build/StripStylesTransformer"
                ]
            }
        }
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^~/(.*)$': '<rootDir>/src/presentation/$1',
    },
    moduleFileExtensions: [
        'ts',
        'js',
        'json'
    ],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main/**'
    ],
    coverageDirectory: 'coverage',
    transform: {
    '.+\\.ts$': 'ts-jest'
    }
}

module.exports = {
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

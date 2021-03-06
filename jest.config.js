module.exports = {
    roots: [
        '<rootDir>/src'
    ],
    testMatch: [
        '**/__tests__/**/*.+(ts|js|tsx|jsx)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    }

}
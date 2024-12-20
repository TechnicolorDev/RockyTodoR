module.exports = {
    testEnvironment: 'jsdom', // Ensures that Jest uses jsdom for DOM-based testing
    preset: 'ts-jest', // Ensures that Jest works with TypeScript
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Transforms TypeScript files
    },
};

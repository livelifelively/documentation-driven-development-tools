const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  coverageThreshold: {
    global: {
      lines: 50,
      branches: 50,
      functions: 0,
      statements: 0,
    },
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
};

module.exports = createJestConfig(customJestConfig);

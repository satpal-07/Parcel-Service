// jest.config.js
module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/helpers/',
    '/__tests__/config-unit-tests/'
  ],
  globalSetup: './__tests__/config-unit-tests/setup.js',
  globalTeardown: './__tests__/config-unit-tests/teardown.js',
  testEnvironment: './__tests__/config-unit-tests/mongo-environment.js'
};

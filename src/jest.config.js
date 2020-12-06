// jest.config.js
module.exports = {
  verbose: true,
  // setupTestFrameworkScriptFile: '/__tests__/setup.js',
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/*.{js,jsx}',
    'app.{js,jsx}',
    'routes.{js,jsx}',
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
};

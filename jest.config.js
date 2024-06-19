/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './__tests__/setup/global.setup.ts',
  globalTeardown: './__tests__/setup/global.teardown.ts',
  testMatch: [
    '**/__tests__/**/*test*.ts',
    '*test*.ts'
  ]
};
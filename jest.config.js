const moduleDirectories = ['./src', './node_modules'];

const testPathIgnorePatterns = ['./__tests__/helpers/*'];

const testEnvironment = 'jsdom';

const collectCoverage = true;

const collectCoverageFrom = ['./src/**/*.[t|j]s'];

const coverageDirectory = './__test-coverage__';

module.exports = {
  moduleDirectories,
  testPathIgnorePatterns,
  testEnvironment,
  collectCoverage,
  collectCoverageFrom,
  coverageDirectory,
};

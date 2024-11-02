module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/test/setup.js"],
  // If using TypeScript:
  preset: "ts-jest",
  moduleNameMapper: {
    // Mock asset imports
    "\\.(jpg|jpeg|png|gif|wav|mp3)$": "<rootDir>/test/mocks/fileMock.js",
  },
};

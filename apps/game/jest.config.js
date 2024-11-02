module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/test/setup.js"],
  // If using TypeScript:
  preset: "ts-jest",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/test/mocks/fileMock.ts",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

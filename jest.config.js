module.exports = {
  coverageReporters: ["json-summary", "text", "lcov"],
  collectCoverageFrom: [
    "src/**/**/*.{ts,tsx}",
    "src/**/**/**/*.{ts,tsx}",
    "!src/**/**/**/*.dto.{ts,tsx}",
    "!src/styles/globalStyle.ts",
    "!src/vite-env.d.ts",
    "!src/index.tsx",
    "!src/service/*.{ts,tsx}",
  ],
  collectCoverage: true,
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/.jest/setup-tests.js", "dotenv/config"],
  preset: "ts-jest",
  transform: {
    ".*\\.[jt]sx?$": "babel-jest",
    ".*\\.[jt]s?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  reporters: [
    "default",
    [
      "jest-sonar",
      {
        outputDirectory: "./",
        outputName: "jest-report.xml",
        reportedFilePath: "relative",
        relativeRootDir: "<rootDir>/../",
      },
    ],
  ],
  moduleNameMapper: {
    "^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css)$":
      "<rootDir>/__mocks__/fileMock.js",
    "^axios$": require.resolve("axios"),
  },
  testTimeout: 20000,
};

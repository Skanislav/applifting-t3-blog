/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.m?js$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/src/$1",
  },
};

export default {
	testEnvironment: "node",
	collectCoverage: true,
	coverageDirectory: "coverage",
	testMatch: ["**/src/**/*.test.js"],
	transform: {
		"^.+\\.js$": "babel-jest" // Use Babel to transform ES modules
	}
};

import parseSFS from "./sfsParser";
import testData from "./sfsParser.test.data.js";

describe("sfsParser.parseSFS", () => {
	test("should correctly parse valid SFS content", () => {
		const result = parseSFS(testData.CONTENT_FULL, "/path/to/CONTENT_FULL.sfs");

		expect(result).toEqual({
			name: "CONTENT_FULL.sfs",
			path: "/path/to/CONTENT_FULL.sfs",
			version: "1.12.5",
			mode: "CAREER",
			sciencePoints: 123.5,
			experiments: [
				{ id: "science@tempId", collected: 5, total: 10 },
				{ id: "science2@tempId2", collected: 6, total: 12 }
			],
			experimentCount: 2
		});
	});

	test("should return null for missing version", () => {
		const result = parseSFS(testData.CONTENT_NO_VERSION, "/path/to/CONTENT_NO_VERSION.sfs");

		expect(result).toEqual({
			name: "CONTENT_NO_VERSION.sfs",
			path: "/path/to/CONTENT_NO_VERSION.sfs",
			version: null,
			mode: "SCIENCE_SANDBOX",
			sciencePoints: 50,
			experiments: [{ id: "science@tempId", collected: 1.2, total: 2.6 }],
			experimentCount: 1
		});
	});

	test("should return null for missing mode", () => {
		const result = parseSFS(testData.CONTENT_NO_MODE, "/path/to/CONTENT_NO_MODE.sfs");

		expect(result).toEqual({
			name: "CONTENT_NO_MODE.sfs",
			path: "/path/to/CONTENT_NO_MODE.sfs",
			version: "1.10.1",
			mode: null,
			sciencePoints: 75,
			experiments: [],
			experimentCount: 0
		});
	});

	test("should return null for missing ResearchAndDevelopment block", () => {
		const result = parseSFS(testData.CONTENT_NO_R_AND_D, "/path/to/CONTENT_NO_R_AND_D.sfs");

		expect(result).toEqual({
			name: "CONTENT_NO_R_AND_D.sfs",
			path: "/path/to/CONTENT_NO_R_AND_D.sfs",
			version: "1.9.0",
			mode: "SANDBOX",
			sciencePoints: 0,
			experiments: [],
			experimentCount: 0
		});
	});

	test("should handle empty SFS content", () => {
		const result = parseSFS("", "/path/to/EMPTY.sfs");

		expect(result).toEqual({
			name: "EMPTY.sfs",
			path: "/path/to/EMPTY.sfs",
			version: null,
			mode: null,
			sciencePoints: 0,
			experiments: [],
			experimentCount: 0
		});
	});

	test("should handle malformed SFS content", () => {
		const result = parseSFS(testData.CONTENT_MALFORMED, "/path/to/CONTENT_MALFORMED.sfs");

		expect(result).toEqual({
			name: "CONTENT_MALFORMED.sfs",
			path: "/path/to/CONTENT_MALFORMED.sfs",
			version: null,
			mode: null,
			sciencePoints: 0,
			experiments: [],
			experimentCount: 0
		});
	});
});

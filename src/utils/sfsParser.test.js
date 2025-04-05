import parseSFS from "./sfsParser";
import testData from "./sfsParser.test.data.js";

describe("sfsParser.parseSFS", () => {
    test("should correctly parse valid SFS content", () => {
        const result = parseSFS(testData.CONTENT_FULL, "CONTENT_FULL.sfs");

        expect(result).toEqual({
            name: "CONTENT_FULL.sfs",
			version: "1.12.5",
			mode: "CAREER",
			sciencePoints: 123.5,
			experiments: ["science@tempId", "science2@tempId2"],
			experimentCount: 2
		});
    });

    test("should return null for missing version", () => {
        const result = parseSFS(testData.CONTENT_NO_VERSION, "CONTENT_NO_VERSION.sfs");

        expect(result).toEqual({
            name: "CONTENT_NO_VERSION.sfs",
			version: null,
			mode: "SCIENCE_SANDBOX",
			sciencePoints: 50,
			experiments: ["science@tempId"],
			experimentCount: 1
		});
    });

    test("should return null for missing mode", () => {
        const result = parseSFS(testData.CONTENT_NO_MODE, "CONTENT_NO_MODE.sfs");

        expect(result).toEqual({
            name: "CONTENT_NO_MODE.sfs",
            version: "1.10.1",
            mode: null,
            sciencePoints: 75,
            experiments: [],
            experimentCount: 0
        });
    });

    test("should return null for missing ResearchAndDevelopment block", () => {
        const result = parseSFS(testData.CONTENT_NO_R_AND_D, "CONTENT_NO_R_AND_D.sfs");

        expect(result).toEqual({
            name: "CONTENT_NO_R_AND_D.sfs",
            version: "1.9.0",
            mode: "SANDBOX",
            sciencePoints: 0,
            experiments: [],
            experimentCount: 0
        });
    });

    test("should handle empty SFS content", () => {
        const result = parseSFS("", "EMPTY.sfs");

        expect(result).toEqual({
            name: "EMPTY.sfs",
            version: null,
            mode: null,
            sciencePoints: 0,
            experiments: [],
            experimentCount: 0
        });
    });

    test("should handle malformed SFS content", () => {
        const result = parseSFS(testData.CONTENT_MALFORMED, "CONTENT_MALFORMED.sfs");

        expect(result).toEqual({
            name: "CONTENT_MALFORMED.sfs",
            version: null,
            mode: null,
            sciencePoints: 0,
            experiments: [],
            experimentCount: 0
        });
    });
});

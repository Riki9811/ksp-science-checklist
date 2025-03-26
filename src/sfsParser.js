import fs from "fs";

const SCENARIO_REGEX = /SCENARIO\s*{\s*name\s*=\s*ResearchAndDevelopment([\s\S]*?)\n\t}/g;
const SCIENCE_REGEX =
	/Science\s*{\s*id\s*=\s*(.*?)\s*title\s*=\s*(.*?)\s*dsc\s*=\s*(.*?)\s*scv\s*=\s*(.*?)\s*sbv\s*=\s*(.*?)\s*sci\s*=\s*(.*?)\s*asc\s*=\s*(.*?)\s*cap\s*=\s*(.*?)\s*}/g;

/**
 * Enum for possible save types (for future use)
 */
export const SaveType = {
	CAREER: "CAREER",
	SCIENCE: "SCIENCE",
	SANDBOX: "SANDBOX"
};

/**
 * Reads an SFS file and extracts science data from the ResearchAndDevelopment SCENARIO.
 * @param {string} filePath - Path to the .sfs file.
 * @returns {Object|null} - Parsed save data or null if an error occurs.
 */
export function parseSFS(filePath) {
	try {
		const fileContents = fs.readFileSync(filePath, "utf-8");
		if (filePath.includes("quicksave")) {
			console.log("quicksave");
		}
		return extractScienceData(fileContents);
	} catch (error) {
		console.error(`Error reading SFS file: ${filePath}`, error);
		return null;
	}
}

/**
 * Extracts the ResearchAndDevelopment science data from raw SFS file content.
 * @param {string} fileContents - The raw text of an SFS file.
 * @returns {Object} - Extracted science data.
 */
function extractScienceData(fileContents) {
	const scienceData = [];

	const scenarioMatch = SCENARIO_REGEX.exec(fileContents);
	if (!scenarioMatch) return { scienceData };

	const scenarioContent = scenarioMatch[0];

	let match;
	while ((match = SCIENCE_REGEX.exec(scenarioContent)) !== null) {
		scienceData.push({
			id: match[1].trim(),
			sci: match[6].trim(),
			cap: match[8].trim()
		});
	}

	return { scienceData };
}

// /**
//  * Parses the science ID field to extract experiment, celestial body, situation, and biome.
//  * @param {string} id - The raw science ID string.
//  * @returns {Object} - Parsed components of the science ID.
//  */
// function parseScienceId(id) {
// 	const parts = id.split("@");
// 	return {
// 		experiment: parts[0] || "Unknown",
// 		body: parts[1] || "Unknown",
// 		situation: parts[2] || "Unknown",
// 		biome: parts[3] || "Unknown"
// 	};
// }
